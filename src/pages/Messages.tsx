import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, Paperclip, MoreVertical, Phone, Video, Smile, Calendar, Clock, DollarSign, FileText, CheckCircle, Shield, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToBucket } from '@/lib/storage';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Loader from '@/components/ui/loader';
import { formatDistanceToNow } from 'date-fns';

function Messages() {
  const { user, profile } = useAuth();
  const [activeChat, setActiveChat] = useState<number | null>(0);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchChatsRef = useRef<() => Promise<void>>();
  const fetchMessagesRef = useRef<(recipientId: string) => Promise<void>>();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !user) return;
    try {
      setIsUploadingAttachment(true);
      const { url } = await uploadFileToBucket({
        bucket: 'messages',
        file: selectedFile,
        folder: user.id,
      });
      setNewMessage(prev => prev ? `${prev}\n[Attachment] ${url}` : `[Attachment] ${url}`);
      toast({ title: 'File uploaded', description: selectedFile.name });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleScheduleMeeting = () => {
    setNewMessage("📅 I'd like to schedule a quick call to discuss the project details. Are you available?");
  };

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

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Move filteredChats to the very top after state declarations
  const filteredChats = searchQuery 
    ? chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const setActiveChatByRecipient = useCallback((recipientId: string) => {
    setActiveChat(prev => {
      const idx = chats.findIndex(chat => chat.recipient_id === recipientId);
      if (idx !== -1) return idx;
      // If not found, fallback to first chat
      return 0;
    });
  }, [chats]);

  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:profiles!sender_id(id, first_name, last_name, avatar_url),
            receiver:profiles!receiver_id(id, first_name, last_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationMap = new Map();
      
      data.forEach(msg => {
          const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          if (!conversationMap.has(partnerId)) {
               const partner = msg.sender_id === user.id ? msg.receiver : msg.sender;
               conversationMap.set(partnerId, {
                   id: partnerId,
                   recipient_id: partnerId,
                   name: `${partner?.first_name || 'Unknown'} ${partner?.last_name || ''}`.trim(),
                   avatar: partner?.avatar_url,
                   lastMessage: msg.content,
                   time: formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }),
                   unread: msg.receiver_id === user.id && !msg.read ? 1 : 0,
                   timestamp: new Date(msg.created_at)
               });
          } else {
               const existing = conversationMap.get(partnerId);
               if (msg.receiver_id === user.id && !msg.read) {
                   existing.unread += 1;
               }
          }
      });

      setChats(Array.from(conversationMap.values()));
      setLoading(false);

    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (recipientId: string) => {
    if (!user) return;
    setIsLoadingMessages(true);
    setErrorLoadingMessages(false);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, first_name, last_name, avatar_url),
          receiver:profiles!receiver_id(id, first_name, last_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Mark as read
      const unreadIds = data?.filter((m: any) => m.receiver_id === user.id && !m.read).map((m: any) => m.id) || [];
      if (unreadIds.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setErrorLoadingMessages(true);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user, toast]);

  const handleNewMessage = useCallback((payload: any) => {
    const currentChat = filteredChats[activeChat || 0];
    if (currentChat && (payload.sender_id === currentChat.recipient_id || payload.receiver_id === currentChat.recipient_id)) {
      setMessages((prev: any) => [...prev, payload]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      fetchChats();
      toast({
        title: "New Message",
        description: "You have a new message",
      });
    }
  }, [activeChat, filteredChats, fetchChats, toast]);

  // Keep stable refs to avoid dependency-driven re-renders
  fetchChatsRef.current = fetchChats;
  fetchMessagesRef.current = fetchMessages;

  const fetchRecipientProfile = useCallback(async (recipientId: string) => {
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
  }, [user, navigate, fetchChats, setActiveChatByRecipient]);

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
  }, [location.search, chats, user, fetchRecipientProfile]);

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
      fetchChatsRef.current?.();
      
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
  }, [user, fetchChats, handleNewMessage]);

  // Fix chat loader bug: only call fetchMessages when activeChat is valid and filteredChats[activeChat] exists
  useEffect(() => {
    if (
      typeof activeChat === 'number' &&
      activeChat >= 0 &&
      filteredChats.length > 0 &&
      filteredChats[activeChat]
    ) {
      fetchMessagesRef.current?.(filteredChats[activeChat].recipient_id);
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

  // Mock Fetching Logic (simplified for layout) - Assume existing logic works but wrapping it
    useEffect(() => {
        if (user) {
          setLoading(true);
          // Simulate chat fetch
          setTimeout(() => {
            // In reality, this would be the actual fetch
            fetchChatsRef.current?.();
            setLoading(false);
          }, 1000);
        }
      }, [user]);

  // Send Message Handler
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() && !file) return;
        
        const currentChat = activeChat !== null ? chats[activeChat] : null;
        if (!currentChat) return;

        const optimisticMsg = {
            id: Date.now(),
            content: newMessage,
            sender_id: user.id,
            created_at: new Date().toISOString(),
            status: 'sending'
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        
        try {
            const { error } = await supabase.from('messages').insert({
                sender_id: user.id,
                receiver_id: currentChat.recipient_id,
                content: newMessage // Simplified
            });
            if (error) throw error;
        } catch (error ) {
             console.error("Failed to send", error);
             toast({ title: "Failed to send message", variant: "destructive" });
        }
    };

  return (
    <AnimatedPage>
        <div className="h-[calc(100vh-100px)] overflow-hidden rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row relative">
            {/* Sidebar / Chat List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-white/5 md:bg-transparent">
                <div className="p-4 border-b border-white/10 space-y-4">
                    <h2 className="text-2xl font-bold font-heading px-2">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input 
                            placeholder="Search chats..." 
                            className="pl-9 bg-black/20 border-white/10 focus:bg-black/40 transition-all rounded-xl border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {loading ? (
                             <div className="flex justify-center p-4"><Loader /></div>
                        ) : filteredChats.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                <p>No conversations yet.</p>
                                <Button variant="link" className="text-primary mt-2">Find a Gig</Button>
                            </div>
                        ) : (
                            filteredChats.map((chat, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveChat(index)}
                                    className={cn(
                                        "w-full p-3 rounded-xl flex items-center gap-4 transition-all duration-300 text-left group hover:bg-white/5",
                                        activeChat === index ? "bg-primary/20 hover:bg-primary/20 shadow-glow border border-primary/20" : "border border-transparent"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border border-white/10 group-hover:border-primary/50 transition-colors">
                                            <AvatarImage src={chat.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900">{chat.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={cn("font-medium truncate", activeChat === index ? "text-primary-foreground" : "text-foreground")}>{chat.name}</span>
                                            <span className="text-xs text-muted-foreground">{chat.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground truncate max-w-[140px] opacity-80 group-hover:opacity-100 transition-opacity">
                                                {chat.lastMessage}
                                            </p>
                                            {chat.unread > 0 && (
                                                <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px] animate-pulse">
                                                    {chat.unread}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-black/20 relative">
                {activeChat !== null && filteredChats[activeChat] ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-white/10 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                    <AvatarImage src={filteredChats[activeChat].avatar} />
                                    <AvatarFallback>{filteredChats[activeChat].name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{filteredChats[activeChat].name}</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-muted-foreground">
                                <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-primary/10 rounded-full"><Phone size={18} /></Button>
                                <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-primary/10 rounded-full"><Video size={18} /></Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" className="hover:text-primary hover:bg-primary/10 rounded-full"><MoreVertical size={18} /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white backdrop-blur-xl">
                                        <DropdownMenuItem onClick={handleScheduleMeeting} className="cursor-pointer hover:bg-white/10 hover:text-primary focus:bg-white/10 focus:text-primary">
                                            <Calendar className="mr-2 h-4 w-4" /> Schedule Meeting
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages Feed */}
                        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-black/20">
                            <div className="space-y-4 pb-4">
                                {messages.map((msg, i) => {
                                    const isMe = msg.sender_id === user?.id;
                                    const sender = isMe ? profile : msg.sender;
                                    const senderName = sender ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim() || sender.username || 'User' : 'Unknown';
                                    return (
                                        <motion.div 
                                            key={msg.id || i}
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className={cn(
                                                "flex w-full mb-2",
                                                isMe ? "justify-end" : "justify-start"
                                            )}
                                        >
                                          {!isMe && (
                                            <button
                                              aria-label={`View ${senderName} profile`}
                                              onClick={() => navigate(`/profile/${msg.sender_id}`)}
                                              className="mr-2 shrink-0"
                                            >
                                              <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarImage src={sender?.avatar_url} />
                                                <AvatarFallback>{senderName?.[0] || 'U'}</AvatarFallback>
                                              </Avatar>
                                            </button>
                                          )}
                                          <div className="space-y-1 max-w-[70%]">
                                            <button
                                              className={cn(
                                                "text-xs font-medium text-left",
                                                isMe ? "text-primary-foreground/80" : "text-white/80 hover:text-white"
                                              )}
                                              onClick={() => navigate(`/profile/${msg.sender_id}`)}
                                            >
                                              {isMe ? 'You' : senderName}
                                            </button>
                                            <div className={cn(
                                                "p-3 px-4 rounded-2xl text-sm relative group transition-all",
                                                isMe 
                                                    ? "bg-primary text-primary-foreground rounded-tr-none shadow-glow-sm" 
                                                    : "bg-white/10 text-foreground rounded-tl-none border border-white/5"
                                            )}>
                                                {msg.content}
                                                <span className="text-[10px] opacity-50 block text-right mt-1">10:42 AM</span>
                                            </div>
                                          </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                            <form onSubmit={handleSendMessage} className="flex items-end gap-2 p-1.5 bg-black/40 border border-white/10 rounded-3xl focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-lg">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileSelect} 
                                />
                                <Button 
                                    type="button" 
                                    size="icon" 
                                    variant="ghost" 
                                    className="rounded-full text-muted-foreground hover:text-white h-10 w-10 shrink-0"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip size={18} />
                                </Button>
                                <Input 
                                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 min-h-[40px] py-3 text-sm resize-none placeholder:text-muted-foreground/50"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    autoComplete="off"
                                />
                                <Button type="button" size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-white h-10 w-10 shrink-0 hidden sm:flex">
                                    <Smile size={18} />
                                </Button>
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 shadow-lg shrink-0 transition-transform active:scale-95"
                                    disabled={!newMessage.trim()}
                                >
                                    <Send size={18} className="ml-0.5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50 p-8 text-center bg-black/20">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Send size={40} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Your Messages</h3>
                        <p className="max-w-xs">Select a chat to start messaging or find a gig to connect with people.</p>
                    </div>
                )}
            </div>
        </div>
    </AnimatedPage>
  );
}

export default Messages;
