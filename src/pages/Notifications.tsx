
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Briefcase, MessageCircle, AlertCircle, Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const Notifications = () => {
  const { user } = useAuth();
  
  // Mock data - in a real app, this would come from the database
  const notifications = [
    {
      id: 1,
      type: 'application',
      title: 'New application received',
      message: 'Sipho Mabaso has applied to your plumbing gig',
      time: '10 minutes ago',
      read: false,
      link: '/gigs/1'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message',
      message: 'You have a new message from Thandi Nkosi',
      time: '2 hours ago',
      read: false,
      link: '/messages'
    },
    {
      id: 3,
      type: 'system',
      title: 'Account verified',
      message: 'Your account has been successfully verified',
      time: 'Yesterday',
      read: true,
      link: '/profile'
    },
    {
      id: 4,
      type: 'gig',
      title: 'Gig completed',
      message: 'Your gardening gig has been marked as completed',
      time: '2 days ago',
      read: true,
      link: '/gigs/2'
    },
    {
      id: 5,
      type: 'application',
      title: 'Application accepted',
      message: 'Your application for electrical repair has been accepted',
      time: '3 days ago',
      read: true,
      link: '/gigs/3'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Briefcase className="text-blue-500" />;
      case 'message':
        return <MessageCircle className="text-green-500" />;
      case 'gig':
        return <Briefcase className="text-purple-500" />;
      case 'system':
        return <CheckCircle className="text-emerald-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

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
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Recent notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(80vh-12rem)]">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div className={`p-4 flex gap-3 hover:bg-gray-50 ${!notification.read ? 'bg-gray-50' : ''}`}>
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${!notification.read ? 'text-black' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <div className="mt-2">
                          <Button variant="link" className="h-auto p-0" asChild>
                            <a href={notification.link}>View details</a>
                          </Button>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-gigstr-purple self-center"></div>
                      )}
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="font-medium text-lg">No notifications</h3>
                <p className="text-gray-500">You don't have any notifications at the moment.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
