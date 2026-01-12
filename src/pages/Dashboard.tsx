import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, DollarSign, MapPin, Briefcase, ArrowRight, Award, Star, TrendingUp, Zap, Calendar, MessageCircle, MoreVertical, Plus } from 'lucide-react';
import Loader from '@/components/ui/loader';
import AnimatedPage from '@/components/AnimatedPage';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Bento Grid Item Wrapper
const BentoItem = ({ children, className, span = "col-span-1" }: { children: React.ReactNode, className?: string, span?: string }) => (
    <motion.div 
        className={cn(
            "glass-card rounded-3xl p-6 relative overflow-hidden group flex flex-col",
            span,
            className
        )}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
        {children}
    </motion.div>
);

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
    const [activeGigs, setActiveGigs] = useState<any[]>([]);
    const [activeGigsCount, setActiveGigsCount] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [completionRate, setCompletionRate] = useState(0);
    const [upcoming, setUpcoming] = useState<any[]>([]);
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [hasLoadedDashboard, setHasLoadedDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();

    const fetchStats = useCallback(async () => {
      if (!user) return;
            try {
                // Avoid flicker: only show loading when we have no data yet
                if (!hasLoadedDashboard) {
                    setLoadingDashboard(true);
                }
                const { data: gigsData, error: gigsError } = await supabase
                        .from('gigs')
                        .select('*')
                        .or(`client_id.eq.${user.id},worker_id.eq.${user.id}`);

                if (gigsError) throw gigsError;

                const active = (gigsData || []).filter(g => (g.status || '').toLowerCase() === 'in_progress' || (g.status || '').toLowerCase() === 'active');
                const completed = (gigsData || []).filter(g => (g.status || '').toLowerCase() === 'completed');
                const total = gigsData?.length || 0;

                setActiveGigs(active);
                setActiveGigsCount(active.length);
                setCompletionRate(total ? Math.round((completed.length / total) * 100) : 0);

                const upcomingDeadlines = active
                        .filter(g => g.due_date)
                        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                        .slice(0, 3);
                setUpcoming(upcomingDeadlines);

                const { data: invoicesData, error: invoicesError } = await supabase
                        .from('invoices')
                        .select('amount,status')
                        .eq('user_id', user.id);

                if (invoicesError) throw invoicesError;
                const paidTotal = (invoicesData || [])
                        .filter(inv => (inv.status || '').toLowerCase() === 'paid')
                        .reduce((sum, inv: any) => sum + (inv.amount || 0), 0);
                setEarnings(paidTotal);
                setHasLoadedDashboard(true);
            } catch (err: any) {
                toast({ title: 'Dashboard data unavailable', description: err.message, variant: 'destructive' });
                setActiveGigs([]);
                setActiveGigsCount(0);
                setCompletionRate(0);
                setUpcoming([]);
                setEarnings(0);
            } finally {
                setLoadingDashboard(false);
            }
  }, [user, toast, hasLoadedDashboard]);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
    if (user) {
        fetchStats();

        // Realtime Subscription
        const channel = supabase
            .channel('dashboard-metrics')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'gigs' },
                () => fetchStats()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
  }, [user, isLoading, navigate, fetchStats]);


  if (isLoading) return <Loader />;

  return (
    <AnimatedPage>
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Welcome back, {profile?.first_name || 'Creator'}
                    </h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your gigs today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="hidden sm:flex" asChild>
                        <Link to="/profile">View Profile</Link>
                    </Button>
                    <Button variant="glow" asChild>
                        <Link to="/create-gig">
                            <Plus className="mr-2 h-4 w-4" /> New Gig
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                
                {/* 1. Main Stats Logic - Large Block */}
                <BentoItem span="col-span-1 md:col-span-2 lg:col-span-2 row-span-1" className="bg-gradient-to-br from-primary/20 to-purple-900/20 border-primary/20">
                    <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-primary/20 rounded-2xl">
                            <DollarSign className="h-6 w-6 text-primary" />
                         </div>
                         <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded-full">Live</span>
                    </div>
                    <div className="mt-auto">
                        <p className="text-muted-foreground font-medium">Total Earnings</p>
                        <h2 className="text-4xl font-bold font-heading mt-1 text-white">{formatPrice(earnings)}</h2>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                         <TrendingUp size={120} />
                    </div>
                </BentoItem>

                {/* 2. Quick Actions */}
                <BentoItem span="col-span-1 md:col-span-1">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Link to="/gigs" className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <Briefcase size={20} className="mb-2 text-blue-400" />
                            <span className="text-xs">Find Work</span>
                        </Link>
                         <Link to="/messages" className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <MessageCircle size={20} className="mb-2 text-pink-400" />
                            <span className="text-xs">Messages</span>
                        </Link>
                    </div>
                </BentoItem>

                 {/* 3. Performance Score */}
                <BentoItem span="col-span-1">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">Job Success</h3>
                        <MoreVertical size={16} className="text-muted-foreground" />
                    </div>
                     <div className="flex items-center justify-center flex-1 my-4 relative">
                         {/* Circle Chart Placeholder */}
                         <div className="w-24 h-24 rounded-full border-8 border-white/5 border-t-green-400 flex items-center justify-center">
                             <span className="text-xl font-bold">{completionRate}%</span>
                         </div>
                     </div>
                     <p className="text-xs text-center text-muted-foreground">Based on your completed gigs</p>
                </BentoItem>

                {/* 4. Active Gigs List - Tall Block */}
                <BentoItem span="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-xl">Active Gigs</h3>
                        <Link to="/gigs" className="text-xs text-primary hover:underline">View All</Link>
                    </div>
                    
                    <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
                        {loadingDashboard && <div className="text-center text-muted-foreground">Loading gigs...</div>}
                        {!loadingDashboard && activeGigs.length === 0 && (
                            <div className="text-center text-muted-foreground border border-dashed rounded-lg p-6">No active gigs yet.</div>
                        )}
                        {!loadingDashboard && activeGigs.map((gig) => (
                            <div key={gig.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shrink-0">
                                    <Zap size={20} className="text-yellow-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate text-white group-hover:text-primary transition-colors">{gig.title || 'Untitled gig'}</h4>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                        <Clock size={12} /> {gig.due_date ? `Due ${new Date(gig.due_date).toLocaleDateString()}` : 'No due date set'}
                                    </p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-sm">{gig.budget ? formatPrice(gig.budget) : '—'}</p>
                                     <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full capitalize">{gig.status || 'active'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoItem>
                
                 {/* 5. Calendar / Schedule */}
                <BentoItem span="col-span-1 md:col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-pink-500" />
                        </div>
                        <h3 className="font-semibold">Upcoming Deadlines</h3>
                    </div>
                    <div className="space-y-3">
                         {loadingDashboard && <div className="text-muted-foreground text-sm">Loading schedule...</div>}
                         {!loadingDashboard && upcoming.length === 0 && (
                            <div className="text-muted-foreground text-sm">No upcoming deadlines.</div>
                         )}
                         {!loadingDashboard && upcoming.map((gig, idx) => (
                             <div key={gig.id || idx} className="flex items-center gap-3 text-sm">
                                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                 <span className="text-muted-foreground flex-1">{gig.title || 'Gig deadline'}</span>
                                 <span className="text-white font-medium">{gig.due_date ? new Date(gig.due_date).toLocaleString() : 'Date pending'}</span>
                             </div>
                         ))}
                    </div>
                </BentoItem>

            </div>
        </div>
    </AnimatedPage>
  );
};


function PlusIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    )
}
export default Dashboard;
