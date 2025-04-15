
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check } from 'lucide-react';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsListProps {
  notifications: any[];
  filteredNotifications: any[];
  loading: boolean;
  activeTab: string;
  markAsRead: (id: string) => Promise<void>;
  navigate: (path: string) => void;
}

export const NotificationsList = ({
  filteredNotifications,
  loading,
  activeTab,
  markAsRead,
  navigate
}: NotificationsListProps) => {

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gigstr-purple mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  if (filteredNotifications.length === 0) {
    return (
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
    );
  }

  return (
    <ScrollArea className="h-[calc(80vh-12rem)]">
      <div>
        {filteredNotifications.map((notification, index) => (
          <div key={notification.id}>
            <NotificationItem 
              notification={notification} 
              markAsRead={markAsRead} 
              navigate={navigate} 
            />
            {index < filteredNotifications.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
