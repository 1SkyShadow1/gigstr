
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

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

  // Add state for file upload
  const [file, setFile] = useState<File | null>(null);
  // Add state for typing indicator
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [activeGigs, setActiveGigs] = useState<any[]>([]);
  const [selectedGig, setSelectedGig] = useState<any>(null);
  // Add error state to component state
  const [errorLoadingMessages, setErrorLoadingMessages] = useState(false);
  // Add state for profile modal
  const [profileModalUser, setProfileModalUser] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Move filteredChats to the very top after state declarations
  const filteredChats = searchQuery 
    ? chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

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
        // Check if a message already exists between users
        const { data: existingMessages, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
          .limit(1);
        if (msgError) throw msgError;
        // If no messages exist, send a starter message
        if (!existingMessages || existingMessages.length === 0) {
          await supabase.from('messages').insert({
            sender_id: user.id,
            receiver_id: recipientId,
            content: '👋',
            created_at: new Date().toISOString(),
            read: false
          });
        }
        // Create a new chat with this recipient (local, for immediate UI update)
        const newChat = {
          id: `new-${recipientId}`,
          recipient_id: recipientId,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
          avatar: data.avatar_url,
          lastMessage: 'Start a conversation',
          time: 'Now',
          unread: 0
        };
        
        setChats(prevChats => {
          // Avoid duplicates
          if (prevChats.some(chat => chat.recipient_id === recipientId)) return prevChats;
          return [...prevChats, newChat];
        });
        setActiveChatByRecipient(recipientId);
        // Clear the recipient from URL
        navigate('/messages', { replace: true });
        // Refetch chats to ensure the new chat persists
        fetchChats();
      }
    } catch (error: any) {
      console.error('Error fetching recipient profile:', error);
    }
  };

  // Helper to select chat by recipient_id
  const setActiveChatByRecipient = (recipientId: string) => {
    setActiveChat(prev => {
      const idx = chats.findIndex(chat => chat.recipient_id === recipientId);
      if (idx !== -1) return idx;
      // If not found, fallback to first chat
      return 0;
    });
  };

  // When chats update, if a recipient param is present, select the correct chat
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const recipientId = params.get('recipient');
    if (recipientId && chats.length > 0) {
      const idx = chats.findIndex(chat => chat.recipient_id === recipientId);
      if (idx !== -1) setActiveChat(idx);
    }
  }, [chats, location.search]);

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

  // Fix chat loader bug: only call fetchMessages when activeChat is valid and filteredChats[activeChat] exists
  useEffect(() => {
    if (
      typeof activeChat === 'number' &&
      activeChat >= 0 &&
      filteredChats.length > 0 &&
      filteredChats[activeChat]
    ) {
      fetchMessages(filteredChats[activeChat].recipient_id);
    } else if (filteredChats.length > 0 && (activeChat === null || activeChat < 0 || activeChat >= filteredChats.length)) {
      setActiveChat(0); // fallback to first chat
    }
    // Only depend on activeChat and filteredChats.length to avoid infinite loop
    // eslint-disable-next-line
  }, [activeChat, filteredChats.length]);

  // Fetch active gigs for the user (as client or worker)
  useEffect(() => {
    if (user) {
      const fetchActiveGigs = async () => {
        const { data: gigs, error } = await supabase
          .from('gigs')
          .select('*')
          .or(`client_id.eq.${user.id},worker_id.eq.${user.id}`)
          .eq('status', 'in_progress');
        if (!error && gigs) setActiveGigs(gigs);
      };
      fetchActiveGigs();
    }
  }, [user]);

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
      setIsLoadingMessages(true);
      setErrorLoadingMessages(false);
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
      setErrorLoadingMessages(true);
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
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
    if (!user || activeChat === null || (!newMessage.trim() && !file)) return;
    
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
      
      // Send notification to recipient
      await supabase.from('notifications').insert({
        id: uuidv4(),
        user_id: recipientId,
        title: `New Message`,
        message: `${profile?.first_name || user.email}: ${newMessage.trim().slice(0, 50)}`,
        type: 'message',
        link: `/messages?recipient=${user.id}`,
        read: false,
      });
      
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
      setFile(null); // Clear file state
      
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

  // All hooks and usages of filteredChats now come after this declaration

  // User search logic
  const handleUserSearch = async () => {
    if (!userSearchInput.trim()) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${userSearchInput}%,first_name.ilike.%${userSearchInput}%,last_name.ilike.%${userSearchInput}%`)
      .neq('id', user.id)
      .limit(10);
    if (!error && data) setUserSearchResults(data);
  };
  const startChatWithUser = (profile: any) => {
    fetchRecipientProfile(profile.id);
    setShowUserSearch(false);
    setUserSearchInput('');
    setUserSearchResults([]);
  };

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
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={() => setShowUserSearch(true)}>
          Search Users
        </Button>
        {activeGigs.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="font-medium">Active Gigs:</span>
            {activeGigs.map(gig => (
              <Button key={gig.id} size="sm" variant={selectedGig?.id === gig.id ? 'default' : 'outline'} onClick={() => setSelectedGig(gig)}>
                {gig.title}
              </Button>
            ))}
          </div>
        )}
      </div>
      {/* User Search Modal */}
      <Dialog open={showUserSearch} onOpenChange={setShowUserSearch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Users</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search by username or name..."
            value={userSearchInput}
            onChange={e => setUserSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUserSearch()}
          />
          <Button className="mt-2" onClick={handleUserSearch}>Search</Button>
          <div className="mt-4 space-y-2">
            {userSearchResults.map(profile => (
              <div key={profile.id} className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-50" onClick={() => startChatWithUser(profile)}>
                <Avatar>
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
                  ) : (
                    <AvatarFallback>{(profile.first_name?.[0] || 'U') + (profile.last_name?.[0] || '')}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">{profile.first_name} {profile.last_name}</div>
                  <div className="text-xs text-muted-foreground">@{profile.username}</div>
                </div>
                <Button size="sm" className="ml-auto">Start Chat</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
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
          {/* Optionally, show active gigs at the top */}
          {activeGigs.length > 0 && (
            <div className="p-2 border-b bg-gray-50">
              <div className="font-semibold text-xs mb-1">Active Gigs</div>
              {activeGigs.map(gig => (
                <div key={gig.id} className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedGig?.id === gig.id ? 'bg-gray-100' : ''}`} onClick={() => setSelectedGig(gig)}>
                  {gig.title}
                </div>
              ))}
            </div>
          )}
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
          {/* If a gig is selected, show gig context */}
          {selectedGig && (
            <div className="p-3 border-b bg-blue-50 flex items-center gap-2">
              <span className="font-medium">Chat about:</span>
              <span>{selectedGig.title}</span>
              <Button size="sm" variant="ghost" onClick={() => setSelectedGig(null)}>Clear</Button>
            </div>
          )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    const recipientId = filteredChats[activeChat].recipient_id;
                    const { data, error } = await supabase
                      .from('profiles')
                      .select('*')
                      .eq('id', recipientId)
                      .single();
                    if (!error && data) {
                      setProfileModalUser(data);
                      setProfileModalOpen(true);
                    } else {
                      navigate(`/profile/${recipientId}`);
                    }
                  }}
                >
                  View Profile
                </Button>
              </div>
              
              {/* In the chat message area, improve loading/error state */}
              <ScrollArea className="flex-1 p-4 h-[calc(80vh-18rem)]">
                <div className="space-y-4 p-4 overflow-y-auto flex-1" style={{ maxHeight: '60vh' }}>
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gigstr-purple"></div>
                    </div>
                  ) : errorLoadingMessages ? (
                    <div className="text-center py-8">
                      <p className="text-red-500">Failed to load messages. Please try again later.</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl shadow-md transition-all duration-200 ${
                            message.sender_id === user.id
                              ? 'bg-gradient-to-br from-gigstr-purple to-gigstr-indigo text-white rounded-tr-none'
                              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                          }`}
                        >
                          {message.content && <p className="whitespace-pre-line break-words">{message.content}</p>}
                          {message.file_url && (
                            <div className="mt-2">
                              {message.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img src={message.file_url} alt="attachment" className="rounded-lg max-h-40 max-w-full" />
                              ) : (
                                <a
                                  href={message.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-sm text-blue-600"
                                >
                                  {message.file_url.substring(message.file_url.lastIndexOf('/') + 1)}
                                </a>
                              )}
                            </div>
                          )}
                          <div className={`text-xs mt-2 flex items-center gap-2 ${message.sender_id === user.id ? 'text-purple-100' : 'text-gray-500'}`}>
                            {formatMessageTime(message.created_at)}
                            {message.sender_id === user.id && (
                              <span className="ml-1">{message.read ? '• Read' : '• Sent'}</span>
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
                  {isRecipientTyping && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-gigstr-purple animate-bounce"></div>
                      <span className="text-xs text-gray-400">Typing...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input 
                    type="file"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-32"
                  />
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim() && !file}>
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
      {/* Add Profile Preview Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Preview</DialogTitle>
          </DialogHeader>
          {profileModalUser ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-20 w-20">
                {profileModalUser.avatar_url ? (
                  <AvatarImage src={profileModalUser.avatar_url} alt={profileModalUser.first_name} />
                ) : (
                  <AvatarFallback>{(profileModalUser.first_name?.[0] || 'U') + (profileModalUser.last_name?.[0] || '')}</AvatarFallback>
                )}
              </Avatar>
              <div className="font-bold text-lg">{profileModalUser.first_name} {profileModalUser.last_name}</div>
              <div className="text-sm text-muted-foreground">@{profileModalUser.username}</div>
              <div className="text-xs text-muted-foreground">{profileModalUser.bio || 'No bio provided.'}</div>
              <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${profileModalUser.id}`)}>Full Profile</Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
