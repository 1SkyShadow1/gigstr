
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Notification } from '@/utils/notificationUtils';

interface NotificationsListProps {
  notifications?: Notification[];
  filteredNotifications: Notification[];
  loading: boolean;
  activeTab: string;
  markAsRead: (id: string) => Promise<void>;
  navigate: (path: string) => void;
  lastFetchedAt?: number | null;
  loadError?: string | null;
}

export const NotificationsList = ({
  filteredNotifications,
  loading,
  activeTab,
  markAsRead,
  navigate,
  lastFetchedAt,
  loadError
}: NotificationsListProps) => {

  if (loadError && !loading) {
    return (
      <div className="p-4 text-center text-sm text-red-300 bg-red-500/5">
        {loadError}
      </div>
    );
  }

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
        {lastFetchedAt && (
          <p className="text-[11px] text-muted-foreground mt-2">Last checked: {new Date(lastFetchedAt).toLocaleTimeString()}</p>
        )}
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
