
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<number | null>(0);
  
  // Mock data - in a real app, this would come from the database
  const chats = [
    {
      id: 1,
      name: 'Sipho Mabaso',
      avatar: '',
      lastMessage: 'I can fix your plumbing issue tomorrow',
      time: '10:23',
      unread: 2
    },
    {
      id: 2,
      name: 'Thandi Nkosi',
      avatar: '',
      lastMessage: 'Thanks for the quote, I will get back to you',
      time: 'Yesterday',
      unread: 0
    },
    {
      id: 3,
      name: 'Mandla Zulu',
      avatar: '',
      lastMessage: 'The job is done, thank you for your service',
      time: 'Mon',
      unread: 0
    }
  ];

  // Mock messages for the active chat
  const messages = [
    {
      id: 1,
      sender: 'them',
      content: 'Hi there! I saw your gig posting about plumbing help needed.',
      time: '10:10'
    },
    {
      id: 2,
      sender: 'me',
      content: 'Yes, my kitchen sink is leaking. Can you help?',
      time: '10:12'
    },
    {
      id: 3,
      sender: 'them',
      content: 'I can fix your plumbing issue tomorrow. Would 10AM work for you?',
      time: '10:15'
    },
    {
      id: 4,
      sender: 'me',
      content: 'That works perfectly. How much will it cost?',
      time: '10:18'
    },
    {
      id: 5,
      sender: 'them',
      content: 'I charge R350 per hour plus parts if needed. Most kitchen sink issues take about 1-2 hours to fix.',
      time: '10:23'
    }
  ];

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
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(80vh-12rem)]">
            <div className="p-0">
              {chats.map((chat, index) => (
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
                  {index < chats.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
        
        {/* Chat messages */}
        <Card className="md:col-span-2 flex flex-col">
          {activeChat !== null ? (
            <>
              <div className="p-3 border-b flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gigstr-purple text-white">
                    {chats[activeChat].name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{chats[activeChat].name}</h3>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4 h-[calc(80vh-18rem)]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'me' 
                            ? 'bg-gigstr-purple text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            message.sender === 'me' ? 'text-purple-100' : 'text-gray-500'
                          }`}
                        >
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                  />
                  <Button>
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
