import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { NotificationFilters } from '@/components/notifications/NotificationFilters';
import { useNotifications } from '@/hooks/useNotifications';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
import { CheckCheck, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [markingAll, setMarkingAll] = React.useState(false);
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

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user && !loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleMarkAll = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await markAllAsRead();
    } finally {
      setMarkingAll(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatedPage>
        <div className="max-w-4xl mx-auto space-y-6 pt-4 pb-12">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-heading mb-2 flex items-center gap-3">
                        Notifications 
                        {unreadCount > 0 && <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/50">{unreadCount}</Badge>}
                    </h1>
                  <p className="text-muted-foreground">Updates on your gigs, applications, and messages.</p>
                  {lastFetchedAt && (
                    <p className="text-xs text-muted-foreground mt-1">Last checked {new Date(lastFetchedAt).toLocaleTimeString()}</p>
                  )}
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                  onClick={handleMarkAll} 
                  disabled={unreadCount === 0 || loading || markingAll}
                  className="gap-2"
                >
                  {markingAll ? <Loader2 size={16} className="animate-spin" /> : <CheckCheck size={16} />} Mark all read
                </Button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden shadow-lg"
            >
              {loadError && (
                <div className="p-4 text-sm bg-destructive/15 text-destructive border-b border-destructive/20 flex items-center justify-between">
                    <span>{loadError}</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={retryFetch}>Retry</Button>
                </div>
              )}
              
                <NotificationFilters 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    notifications={notifications}
                    unreadCount={unreadCount}
                />
                
                <div className="min-h-[300px]">
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
            </motion.div>
        </div>
    </AnimatedPage>
  );
};

export default Notifications;
