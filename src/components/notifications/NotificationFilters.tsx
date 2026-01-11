
import React from 'react';
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { CardHeader } from '@/components/ui/card';
import type { Notification } from '@/utils/notificationUtils';

interface NotificationFiltersProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  notifications: Notification[];
  unreadCount: number;
}

export const NotificationFilters = ({
  activeTab,
  setActiveTab,
  notifications,
  unreadCount
}: NotificationFiltersProps) => {
  return (
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
  );
};
