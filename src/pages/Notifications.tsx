
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    notifications, 
    filteredNotifications, 
    loading, 
    activeTab, 
    setActiveTab, 
    markAllAsRead, 
    markAsRead, 
    unreadCount 
  } = useNotifications();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
            <p className="mb-4">You need to sign in to view your notifications.</p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Notifications" 
        description={unreadCount > 0 ? `You have ${unreadCount} unread notifications` : undefined}
      >
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </PageHeader>
      
      <Card>
        <NotificationFilters 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        
        <CardContent className="p-0">
          <NotificationsList 
            notifications={notifications}
            filteredNotifications={filteredNotifications}
            loading={loading}
            activeTab={activeTab}
            markAsRead={markAsRead}
            navigate={navigate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
