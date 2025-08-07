
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { messaging, getToken, onMessage } from '@/integrations/firebase';

// Utility to call the push notification Edge Function
async function sendPushNotification(user_id: string, notification: { title: string; body: string; data?: any }) {
  await fetch('/functions/v1/send-push-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, notification }),
  });
}

export const useNotifications = () => {
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
      // FCM: Request permission and get token
      if (window.Notification && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            getToken(messaging, { vapidKey: 'BBm-UlrzqXZCmdrGfiIc8a3x0r0UtGJtZ-K4qotAAqOAb47YtcdJ_ifn0WbbGk9Um7IdTPpieAznXu-YVkVs' })
              .then(async (currentToken) => {
                if (currentToken) {
                  // Store the FCM token in Supabase if new or changed
                  const { data: existing } = await supabase
                    .from('fcm_tokens')
                    .select('token')
                    .eq('user_id', user.id)
                    .eq('token', currentToken)
                    .single();
                  if (!existing) {
                    await supabase
                      .from('fcm_tokens')
                      .upsert({ user_id: user.id, token: currentToken });
                  }
                  console.log('FCM Token registered:', currentToken);
                }
              })
              .catch((err) => {
                console.error('An error occurred while retrieving token. ', err);
              });
          }
        });
      }
      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        toast({
          title: payload.notification?.title || 'Notification',
          description: payload.notification?.body || '',
        });
      });
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
      toast({
        title: 'Error',
        description: 'Failed to load notifications. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev]);
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
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read. Please try again.',
        variant: 'destructive',
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
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error: any) {
      // Optionally show error toast
    }
  };

  // Create a notification and trigger push notification
  const createNotification = async (notif: { title: string; message: string; type: string; link?: string }) => {
    if (!user) return;
    const { data, error } = await supabase.from('notifications').insert({
      user_id: user.id,
      ...notif,
    }).select().single();
    if (!error && data) {
      await sendPushNotification(user.id, { title: notif.title, body: notif.message, data: { link: notif.link } });
      setNotifications(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter(notification => !notification.read)
    : notifications.filter(notification => notification.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    filteredNotifications,
    loading,
    activeTab,
    setActiveTab,
    markAllAsRead,
    markAsRead,
    unreadCount,
    createNotification,
  };
};

