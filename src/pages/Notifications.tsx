
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Briefcase, MessageCircle, AlertCircle, Bell, Clock, Check, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to real-time notifications
      const channel = supabase
        .channel('notifications-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          handleNewNotification(payload.new);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewNotification = (notification: any) => {
    // Add the new notification to the list
    setNotifications(prev => [notification, ...prev]);
    
    // Show a toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error: any) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="text-blue-500" />;
      case 'message':
        return <MessageCircle className="text-green-500" />;
      case 'gig':
        return <Briefcase className="text-purple-500" />;
      case 'payment':
        return <DollarSign className="text-emerald-500" />;
      case 'system':
        return <CheckCircle className="text-emerald-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
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

  // Filter notifications based on the active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
    ? notifications.filter(notification => !notification.read)
    : notifications.filter(notification => notification.type === activeTab);
    
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Please Sign In</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You need to sign in to view your notifications.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-gigstr-purple text-white px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h1>
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-2">
              <TabsTrigger value="all">
                All
                {notifications.length > 0 && (
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="gig">Gigs</TabsTrigger>
              <TabsTrigger value="application">Applications</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(80vh-12rem)]">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gigstr-purple mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div>
                {filteredNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className={`p-4 flex gap-3 hover:bg-gray-50 ${!notification.read ? 'bg-gray-50' : ''}`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        
                        // Navigate to the appropriate page based on the notification type
                        if (notification.link) {
                          navigate(notification.link);
                        }
                      }}
                    >
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${!notification.read ? 'text-black' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.created_at)}
                            </span>
                            {notification.read && (
                              <Check className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        {notification.link && (
                          <div className="mt-2">
                            <Button variant="link" className="h-auto p-0" onClick={(e) => {
                              e.stopPropagation();
                              navigate(notification.link);
                            }}>
                              View details
                            </Button>
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-gigstr-purple self-center"></div>
                      )}
                    </div>
                    {index < filteredNotifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="font-medium text-lg">No notifications</h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? "You don't have any notifications at the moment." 
                    : activeTab === 'unread'
                    ? "You don't have any unread notifications."
                    : `You don't have any ${activeTab} notifications.`}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
