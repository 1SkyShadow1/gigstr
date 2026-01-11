
import React from 'react';
import { Briefcase, MessageCircle, Bell, CheckCircle, DollarSign } from 'lucide-react';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  created_at: string;
};

export const getNotificationIcon = (type: string) => {
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

export const formatTimestamp = (timestamp: string) => {
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
