import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export function useMessages(session: Session, otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages between current user and other user
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${session.user.id})`)
      .order('created_at', { ascending: true });
    if (!error && data) setMessages(data as Message[]);
    setLoading(false);
  }, [session.user.id, otherUserId]);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    const { error } = await supabase.from('messages').insert({
      sender_id: session.user.id,
      receiver_id: otherUserId,
      content,
    });
    if (!error) fetchMessages();
    return error;
  }, [session.user.id, otherUserId, fetchMessages]);

  // Mark message as read
  const markAsRead = useCallback(async (id: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    fetchMessages();
    const sub = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        if (
          (payload.new.sender_id === session.user.id && payload.new.receiver_id === otherUserId) ||
          (payload.new.sender_id === otherUserId && payload.new.receiver_id === session.user.id)
        ) {
          fetchMessages();
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
  }, [session.user.id, otherUserId, fetchMessages]);

  return { messages, loading, sendMessage, markAsRead, fetchMessages };
} 