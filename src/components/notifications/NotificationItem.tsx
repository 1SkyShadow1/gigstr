
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNotificationIcon, formatTimestamp, Notification } from '@/utils/notificationUtils';

interface NotificationItemProps {
  notification: Notification;
  markAsRead: (id: string) => Promise<void>;
  navigate: (path: string) => void;
}

export const NotificationItem = ({
  notification,
  markAsRead,
  navigate
}: NotificationItemProps) => {
  return (
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
  );
};
