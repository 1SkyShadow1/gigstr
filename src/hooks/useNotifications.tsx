
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  // Use a ref for toast to avoid dependency loops if useToast returns a new function on every render
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setLoadError(null);
      return;
    }
    try {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setNotifications(data || []);
      setLastFetchedAt(Date.now());
      setLoadError(null);
    } catch (error: any) {
      console.error('Failed to load notifications', error);
      let errorMessage = error?.message || 'Failed to load notifications.';
      
      // Enhance error message for common network/CORS issues
      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
      }
      
      setLoadError(errorMessage);
      // Only toast on manual retry or critical failures, not on auto-load to avoid spam
      if (retryCount > 0) {
        toastRef.current({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, retryCount]); // Depend on user and retryCount only

  // Safety net: if loading takes too long, stop spinner and show a timeout message
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setLoading(false);
      setLoadError((prev) => prev || 'Notifications timed out. Please refresh.');
    }, 4000);
    return () => clearTimeout(timeout);
  }, [loading]);

  const handleNewNotification = useCallback((notification: any) => {
    setNotifications(prev => [notification, ...prev]);
    toastRef.current({
      title: notification.title,
      description: notification.message,
    });
  }, []);

  // Initial Fetch & Real-time Subscription
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
    } else {
      setLoading(false);
    }
  }, [user, fetchNotifications, handleNewNotification]);

  // FCM Logic - Separated and guarded against errors
  useEffect(() => {
    if (!user) return;

    const initFCM = async () => {
      try {
        if (typeof window !== 'undefined' && window.Notification && Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') return;
        }

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
           // Basic check before invoking Firebase
           // We place this in a try/catch to ensure it doesn't crash the app if Firebase config is bad
           try {
             // Dynamic import could be safer, but we use the static imports from top
             const currentToken = await getToken(messaging, { vapidKey: 'BBm-UlrzqXZCmdrGfiIc8a3x0r0UtGJtZ-K4qotAAqOAb47YtcdJ_ifn0WbbGk9Um7IdTPpieAznXu-YVkVs' });
             
             if (currentToken) {
                // Store the FCM token in Supabase
                const { data: existing } = await supabase
                  .from('fcm_tokens')
                  .select('token')
                  .eq('user_id', user.id)
                  .eq('token', currentToken)
                  .maybeSingle(); // maybeSingle instead of single to avoid error if 0 rows

                if (!existing) {
                  await supabase
                    .from('fcm_tokens')
                    .upsert({ user_id: user.id, token: currentToken });
                }
                console.log('FCM Token registered');
             }
           } catch (fcmErr) {
             console.warn('FCM Init failed:', fcmErr);
           }
        }
      } catch (err) {
        console.warn('Notification permission/setup failed:', err);
      }
    };

    // Execute FCM init non-blockingly
    initFCM();
    
    // Listen for foreground messages - wrap in try catch setup
    let unsubscribe = () => {};
    try {
        unsubscribe = onMessage(messaging, (payload) => {
          toastRef.current({
              title: payload.notification?.title || 'Notification',
              description: payload.notification?.body || '',
          });
        });
    } catch(e) {
        console.warn('Firebase onMessage failed to register', e);
    }

    return () => {
        if(unsubscribe) unsubscribe();
    };
  }, [user]); // Removed dependencies that change frequently

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
    loadError,
    lastFetchedAt,
    retryFetch: () => { setRetryCount(c => c + 1); fetchNotifications(); },
    activeTab,
    setActiveTab,
    markAllAsRead,
    markAsRead,
    unreadCount,
    createNotification,
  };
};

