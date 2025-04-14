
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';

const Messages = () => {
  const { user, profile } = useAuth();
  const [activeChat, setActiveChat] = useState<number | null>(0);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract recipient ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const recipientId = params.get('recipient');
    
    if (recipientId && user) {
      // Check if chat with this recipient exists
      const chatIndex = chats.findIndex(chat => chat.recipient_id === recipientId);
      
      if (chatIndex >= 0) {
        setActiveChat(chatIndex);
      } else {
        // Create a new chat with this recipient
        fetchRecipientProfile(recipientId);
      }
    }
  }, [location, chats, user]);

  const fetchRecipientProfile = async (recipientId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Create a new chat with this recipient
        const newChat = {
          id: chats.length + 1,
          recipient_id: recipientId,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
          avatar: data.avatar_url,
          lastMessage: 'Start a conversation',
          time: 'Now',
          unread: 0
        };
        
        setChats(prevChats => [...prevChats, newChat]);
        setActiveChat(chats.length); // Set to the new chat
        
        // Clear the recipient from URL
        navigate('/messages', { replace: true });
      }
    } catch (error: any) {
      console.error('Error fetching recipient profile:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel('messages-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          handleNewMessage(payload.new);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (activeChat !== null && chats[activeChat]) {
      fetchMessages(chats[activeChat].recipient_id);
    }
  }, [activeChat, chats]);

  const fetchChats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get all unique conversations the user is part of
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });
        
      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });
        
      if (sentError) throw sentError;
      if (receivedError) throw receivedError;
      
      // Get unique user IDs the current user has chatted with
      const uniqueUserIds = new Set<string>();
      
      sentMessages?.forEach(msg => uniqueUserIds.add(msg.receiver_id));
      receivedMessages?.forEach(msg => uniqueUserIds.add(msg.sender_id));
      
      // Fetch profiles for these users
      const userIds = Array.from(uniqueUserIds);
      if (userIds.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      // Get the last message for each conversation
      const chatPromises = userIds.map(async (userId) => {
        const { data: lastMessage, error: lastMessageError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (lastMessageError && lastMessageError.code !== 'PGRST116') {
          console.error('Error fetching last message:', lastMessageError);
        }
        
        const profile = profiles?.find(p => p.id === userId);
        if (!profile) return null;
        
        // Count unread messages
        const { count: unreadCount, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', userId)
          .eq('receiver_id', user.id)
          .eq('read', false);
          
        if (countError) {
          console.error('Error counting unread messages:', countError);
        }
        
        return {
          id: userId,
          recipient_id: userId,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
          avatar: profile.avatar_url,
          lastMessage: lastMessage?.content || 'Start a conversation',
          time: lastMessage ? formatMessageTime(lastMessage.created_at) : 'Now',
          unread: unreadCount || 0
        };
      });
      
      const chatsData = (await Promise.all(chatPromises)).filter(Boolean);
      setChats(chatsData as any[]);
      
    } catch (error: any) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error",
        description: "Failed to load your conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (recipientId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', recipientId)
        .eq('receiver_id', user.id)
        .eq('read', false);
        
      // Update the unread count in the chat list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.recipient_id === recipientId 
            ? { ...chat, unread: 0 } 
            : chat
        )
      );
      
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewMessage = (message: any) => {
    // If this is a message for the current active chat, add it to the messages list
    if (activeChat !== null && chats[activeChat]?.recipient_id === message.sender_id) {
      setMessages(prev => [...prev, message]);
      
      // Mark as read since we're viewing this chat
      supabase
        .from('messages')
        .update({ read: true })
        .eq('id', message.id);
    } else {
      // Update the chats list with the new message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.recipient_id === message.sender_id 
            ? { 
                ...chat, 
                lastMessage: message.content, 
                time: formatMessageTime(message.created_at),
                unread: chat.unread + 1
              } 
            : chat
        )
      );
      
      // Show a toast notification
      const senderChat = chats.find(chat => chat.recipient_id === message.sender_id);
      if (senderChat) {
        toast({
          title: `New message from ${senderChat.name}`,
          description: message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content,
        });
      }
    }
  };

  const sendMessage = async () => {
    if (!user || activeChat === null || !newMessage.trim()) return;
    
    const recipientId = chats[activeChat].recipient_id;
    
    try {
      const message = {
        sender_id: user.id,
        receiver_id: recipientId,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        read: false
      };
      
      const { error } = await supabase
        .from('messages')
        .insert([message]);
        
      if (error) throw error;
      
      // Optimistically add the message to the UI
      setMessages(prev => [...prev, { 
        ...message, 
        id: Date.now().toString() // Temporary ID until refresh
      }]);
      
      // Update the chat list with the new message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.recipient_id === recipientId 
            ? { 
                ...chat, 
                lastMessage: newMessage.trim(), 
                time: 'Just now'
              } 
            : chat
        )
      );
      
      // Clear the input
      setNewMessage('');
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const filteredChats = searchQuery 
    ? chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Please Sign In</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You need to sign in to view your messages.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(80vh-8rem)]">
        {/* Chats list */}
        <Card className="md:col-span-1 overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(80vh-12rem)]">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gigstr-purple mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
              </div>
            ) : (
              <div className="p-0">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat, index) => (
                    <div key={chat.id}>
                      <div 
                        className={`flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer ${activeChat === index ? 'bg-gray-100' : ''}`}
                        onClick={() => setActiveChat(index)}
                      >
                        <Avatar>
                          {chat.avatar ? (
                            <AvatarImage src={chat.avatar} alt={chat.name} />
                          ) : (
                            <AvatarFallback className="bg-gigstr-purple text-white">
                              {chat.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-medium truncate">{chat.name}</h4>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="bg-gigstr-purple text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                            {chat.unread}
                          </div>
                        )}
                      </div>
                      {index < filteredChats.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No conversations found</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Chat messages */}
        <Card className="md:col-span-2 flex flex-col">
          {activeChat !== null && filteredChats[activeChat] ? (
            <>
              <div className="p-3 border-b flex items-center gap-3">
                <Avatar>
                  {filteredChats[activeChat].avatar ? (
                    <AvatarImage src={filteredChats[activeChat].avatar} alt={filteredChats[activeChat].name} />
                  ) : (
                    <AvatarFallback className="bg-gigstr-purple text-white">
                      {filteredChats[activeChat].name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{filteredChats[activeChat].name}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/profile/${filteredChats[activeChat].recipient_id}`)}>
                  View Profile
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4 h-[calc(80vh-18rem)]">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender_id === user.id 
                              ? 'bg-gigstr-purple text-white rounded-tr-none' 
                              : 'bg-gray-100 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div 
                            className={`text-xs mt-1 ${
                              message.sender_id === user.id ? 'text-purple-100' : 'text-gray-500'
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                            {message.sender_id === user.id && (
                              <span className="ml-1">
                                {message.read ? '• Read' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
