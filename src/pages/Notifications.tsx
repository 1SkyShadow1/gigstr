import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { useNotifications } from '@/hooks/useNotifications';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    notifications, 
    filteredNotifications, 
    loading, 
    loadError,
    lastFetchedAt,
    retryFetch,
    activeTab, 
    setActiveTab, 
    markAllAsRead, 
    markAsRead, 
    unreadCount 
  } = useNotifications();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center p-6">
            <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
        <div className="max-w-4xl mx-auto space-y-6">
             <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading mb-2 flex items-center gap-3">
                        Notifications 
                        {unreadCount > 0 && <Badge className="bg-primary hover:bg-primary">{unreadCount}</Badge>}
                    </h1>
                    <p className="text-muted-foreground">Stay updated with your gigs and applications.</p>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllAsRead} 
                    disabled={unreadCount === 0}
                    className="border-white/10 hover:bg-white/5 gap-2"
                >
                    <CheckCheck size={16} /> Mark all read
                </Button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {loadError && (
                <div className="p-3 text-sm text-red-300 bg-red-500/10 border-b border-red-500/20">
                  <div className="flex items-center justify-between">
                    <span>{loadError}</span>
                    <Button size="sm" variant="outline" className="h-8" onClick={retryFetch}>Retry</Button>
                  </div>
                </div>
              )}
                <NotificationFilters 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    notifications={notifications}
                    unreadCount={unreadCount}
                />
                
                <div className="p-0">
                    <NotificationsList 
                        notifications={notifications}
                        filteredNotifications={filteredNotifications}
                        loading={loading}
                        activeTab={activeTab}
                        markAsRead={markAsRead}
                        navigate={navigate}
                    lastFetchedAt={lastFetchedAt}
                    loadError={loadError}
                        onRetry={retryFetch}
                    />
                </div>

                <div className="p-4 flex items-center justify-between text-xs text-muted-foreground border-t border-white/10 bg-black/30">
                  <span>State: user {user?.id ? 'ok' : 'missing'} • loading {loading ? 'true' : 'false'} • error {loadError ? 'yes' : 'no'} • last fetch {lastFetchedAt ? new Date(lastFetchedAt).toLocaleTimeString() : '—'}</span>
                  <Button size="sm" variant="outline" className="h-8" onClick={retryFetch}>Force refresh</Button>
                </div>
            </motion.div>
        </div>
    </AnimatedPage>
  );
};

export default Notifications;
