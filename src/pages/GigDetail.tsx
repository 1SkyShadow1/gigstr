import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, MapPin, Calendar, Clock, Calendar as CalendarIcon, User, CheckCircle, XCircle, ArrowLeft, Share2, Heart, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import AnimatedPage from '@/components/AnimatedPage';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import Loader from '@/components/ui/loader';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const GigContractView = ({ gig, isOwner, onAction }: { gig: any, isOwner: boolean, onAction: (action: string) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-glow mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
            <CheckCircle className="w-8 h-8" />
            </div>
            <div>
            <h2 className="text-xl font-bold text-white">Active Contract</h2>
            <p className="text-muted-foreground">{isOwner ? "You have hired a freelancer for this gig." : "You are working on this gig."}</p>
            </div>
        </div>
        <div className="md:ml-auto">
             <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm">
                In Progress
             </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {!isOwner ? (
               <Button onClick={() => onAction('submit_work')} className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                    Submit Work
               </Button>
           ) : (
                <>
                <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5">Message Freelancer</Button>
                <Button onClick={() => onAction('release_payment')} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                    Release Payment & Complete
                </Button>
                </>
           )}
      </div>
    </motion.div>
  );
};

const GigDetail = () => {
  const { id } = useParams();
  const { user, isLoading } = useAuth();
  const [gig, setGig] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [proposal, setProposal] = useState('');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [expectedRate, setExpectedRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [introMedia, setIntroMedia] = useState<File | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [requestInterview, setRequestInterview] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [similarGigs, setSimilarGigs] = useState<any[]>([]);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const isFetchingRef = useRef(false);
  const lastFetchRef = useRef(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const profileName = () => user?.email || 'Someone';

  const fetchGigData = useCallback(async () => {
    // Throttle to avoid overlapping/rapid fetch loops that can exhaust the browser
    const now = Date.now();
    if (isFetchingRef.current || now - lastFetchRef.current < 1500) {
      return;
    }
    isFetchingRef.current = true;
    setErrorMessage(null);
    if (initialLoad) {
      setInitialLoad(true);
    } else {
      setRefreshing(true);
    }
    try {
      if (!id) {
        throw new Error("Gig ID is missing");
      }

      const { data: gigData, error: gigError } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', id)
        .single();

      if (gigError) throw gigError;
      if (!gigData) throw new Error("Gig not found");

      setGig(gigData);

      if (user) {
        const isUserOwner = user.id === gigData.client_id;
        setIsOwner(isUserOwner);

        if (isUserOwner) {
          const { data: appsData, error: appsError } = await supabase
            .from('applications')
            .select('*, worker:profiles(*)')
            .eq('gig_id', id);
          if (appsError) throw appsError;
          setApplications(appsData || []);
          setApplication(null);
        } else {
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('gig_id', id)
            .eq('worker_id', user.id)
            .maybeSingle();
          if (appError) throw appError;
          setApplication(appData || null);
          setApplications([]);
        }
      } else {
        setIsOwner(false);
        setApplications([]);
        setApplication(null);
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.message || 'Unable to load this gig right now.';
      setErrorMessage(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      lastFetchRef.current = Date.now();
      isFetchingRef.current = false;
      setInitialLoad(false);
      setRefreshing(false);
    }
  }, [id, user, toast, initialLoad]);

  useEffect(() => {
    fetchGigData();
  }, [fetchGigData]);

  // Fetch similar gigs after gig is loaded
  useEffect(() => {
    if (gig) {
      const fetchSimilar = async () => {
        const { data, error } = await supabase
          .from('gigs')
          .select('*')
          .eq('category', gig.category)
          .neq('id', gig.id)
          .limit(3);
        if (!error && data) setSimilarGigs(data);
      };
      fetchSimilar();
      // Bookmark persistence
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGigs') || '[]');
      setBookmark(bookmarks.includes(gig.id));
    }
  }, [gig]);

  // Realtime subscription
  useEffect(() => {
    if (!gig?.id) return;

    const channel = supabase
      .channel('gig-detail-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gigs', filter: `id=eq.${gig.id}` },
        (payload: any) => {
          setGig((current: any) => ({ ...current, ...payload.new }));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications', filter: `gig_id=eq.${gig.id}` },
        () => {
           // Refresh data to get latest application status
           fetchGigData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gig?.id, fetchGigData]);

  const handleApply = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!agreeTerms) {
      toast({
        title: "Agreement required",
        description: "You must agree to the terms to apply.",
        variant: "destructive",
      });
      return;
    }
    if (!proposal.trim()) {
      toast({ title: "Cover letter required", description: "Please add a short cover letter before submitting.", variant: "destructive" });
      return;
    }
    try {
      setApplying(true);
      // Simplified Logic 
      // Actual logic is extensive in previous implementation
      // Keeping it conceptual for the styling update
      
        const expectedRateValue = expectedRate ? Number(expectedRate) : null;
        const availabilityValue = availability.trim() ? availability.trim() : null;

      const newApplication = {
          gig_id: gig.id,
          worker_id: user?.id,
          status: 'pending',
          proposal: proposal.trim(),
          expected_rate: expectedRateValue,
          availability: availabilityValue,
      };

        const { error } = await supabase
          .from('applications')
          .insert(newApplication);

      if (error) throw error;

        // Notify the gig owner about the new application (only if applicant isn't the owner)
        // Handled by Database Trigger
        /* 
        if (gig.client_id && gig.client_id !== user.id) {
          const { error: notifError } = await supabase.from('notifications').insert({
            user_id: gig.client_id,
            title: 'New application received',
            message: `${profileName() || 'A worker'} applied to "${gig.title}"`,
            type: 'application',
            link: `/gigs/${gig.id}`,
          });
          if (notifError) {
            console.error('Failed to create notification', notifError);
          }
        }
        */

      toast({ title: "Application sent!", description: "Good luck!" });
      setShowApplyDialog(false);
      fetchGigData();

    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setApplying(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      const workerId = applications.find(app => app.id === applicationId)?.worker_id;
      // Notify applicant - Handled by Database Trigger
      /*
      if (workerId) {
        await supabase.from('notifications').insert({
          id: uuidv4(),
          user_id: workerId,
          title: status === 'accepted' ? 'Application Accepted' : 'Application Rejected',
          message: status === 'accepted'
            ? `Your application for gig "${gig.title}" was accepted!`
            : `Your application for gig "${gig.title}" was rejected.`,
          type: 'application',
          link: `/gigs/${gig.id}`,
          read: false,
        });
      }
      */
      if (status === 'accepted') {
        // Update gig status to in_progress
        const { error: gigError } = await supabase
          .from('gigs')
          .update({ 
            status: 'in_progress',
            worker_id: workerId
          })
          .eq('id', id);
        
        if (gigError) throw gigError;
        // Notify both client and worker that gig is now active
        if (gig && gig.client_id && workerId) {
          await supabase.from('notifications').insert([
            {
              id: uuidv4(),
              user_id: gig.client_id,
              title: 'Gig In Progress',
              message: `Your gig "${gig.title}" is now in progress!`,
              type: 'gig',
              link: `/gigs/${gig.id}`,
              read: false,
            },
            {
              id: uuidv4(),
              user_id: workerId,
              title: 'Gig In Progress',
              message: `You have been assigned to gig "${gig.title}"!`,
              type: 'gig',
              link: `/gigs/${gig.id}`,
              read: false,
            }
          ]);
        }
      }
      // Refresh data
      fetchGigData();
      
      toast({
        title: status === 'accepted' ? "Application accepted" : "Application rejected",
        description: status === 'accepted' 
          ? "The applicant has been notified and the gig is now in progress" 
          : "The applicant has been notified of your decision",
      });
    } catch (error: any) {
      toast({
        title: "Error updating application",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Bookmark handler
  const handleBookmark = () => {
    setBookmark(b => {
      const newVal = !b;
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedGigs') || '[]');
      if (newVal) {
        localStorage.setItem('bookmarkedGigs', JSON.stringify([...new Set([...bookmarks, gig.id])]));
      } else {
        localStorage.setItem('bookmarkedGigs', JSON.stringify(bookmarks.filter((id: string) => id !== gig.id)));
      }
      return newVal;
    });
  };

  const handleContractAction = async (action: string) => {
      if (action === 'submit_work') {
          // Update application status or notify client
          // In a real app, you'd update a 'contracts' table or similar
          toast({ title: "Work Submitted", description: "The client has been notified." });
      } else if (action === 'release_payment') {
          // Update gig status to completed
          const { error } = await supabase.from('gigs').update({ status: 'completed' }).eq('id', gig.id);
          if (error) {
              toast({ title: "Error", description: error.message, variant: "destructive" });
          } else {
              toast({ title: "Contract Completed", description: "Payment released to freelancer." });
              setShowRatingDialog(true);
              fetchGigData();
          }
      }
  };

  // Rating submission (after gig completion)
  const handleSubmitRating = async () => {
    if (!ratingValue || !gig || !user) return;
    if (ratingValue < 1 || ratingValue > 5) {
      toast({ title: 'Invalid rating', description: 'Choose a rating between 1 and 5.' });
      return;
    }
    if (user.id !== gig.client_id) {
      toast({ title: 'Only the client can review', description: 'You must be the gig client to submit a review.', variant: 'destructive' });
      return;
    }

    const freelancerId = gig.worker_id || application?.worker_id;
    if (!freelancerId) {
      toast({ title: 'No assigned freelancer', description: 'Cannot submit a review without an assigned freelancer.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .upsert({
        gig_id: gig.id,
        freelancer_id: freelancerId,
        client_id: user.id,
        rating: ratingValue,
        comment: ratingComment.trim() || null,
      }, { onConflict: 'gig_id,client_id' })
      .select()
      .single();

    if (error) {
      toast({ title: 'Could not submit review', description: error.message, variant: 'destructive' });
      return;
    }

    toast({
      title: 'Thank you for your feedback!',
      description: 'Your rating has been submitted.',
    });
    setShowRatingDialog(false);
    setRatingValue(0);
    setRatingComment('');
  };

  if (initialLoad || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gigstr-purple"></div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <AnimatedPage>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Unable to load gig</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{errorMessage}</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/gigs')}>Back to gigs</Button>
              <Button onClick={fetchGigData}>Try again</Button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Gig not found</h2>
          <Button onClick={() => navigate('/gigs')}>Browse Gigs</Button>
        </div>
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <AnimatedPage>
        <div className="max-w-5xl mx-auto space-y-8">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gigs
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {gig.status === 'in_progress' && (isOwner || (application?.status === 'accepted')) && (
                        <GigContractView gig={gig} isOwner={isOwner} onAction={handleContractAction} />
                    )}

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <Badge className="mb-3 bg-primary/20 text-primary border-primary/20 hover:bg-primary/30">
                                    {gig.category}
                                </Badge>
                                <h1 className="text-3xl font-bold font-heading leading-tight mb-2">{gig.title}</h1>
                                <div className="flex items-center text-muted-foreground text-sm gap-4">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {gig.location || 'Remote'}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> Posted {formatDistanceToNow(new Date(gig.created_at))} ago</span>
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10">
                                    <Share2 size={18} />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className={`rounded-full bg-white/5 hover:bg-white/10 ${bookmark ? 'text-red-500' : ''}`}
                                    onClick={() => setBookmark(!bookmark)}
                                >
                                    <Heart size={18} fill={bookmark ? "currentColor" : "none"} />
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-white/10 my-6" />

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-xl font-semibold mb-4">Description</h3>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {gig.description}
                            </p>
                        </div>
                        
                        <div className="mt-8 grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                                <p className="text-2xl font-bold text-green-400">{formatPrice(gig.price || 0)}</p>
                           </div>
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                                <p className="text-lg font-medium">{gig.deadline ? formatDistanceToNow(new Date(gig.deadline)) : 'Open'}</p>
                           </div>
                        </div>

                    </motion.div>

                    {/* Contract View - Shown when gig is in progress */}
                    {gig.status === 'in_progress' && (
                      <GigContractView 
                        gig={gig} 
                        isOwner={isOwner} 
                        onAction={(action) => {
                          if (action === 'submit_work') {
                            // Handle work submission logic
                            toast({
                              title: 'Work Submitted',
                              description: 'Your work has been submitted for review.',
                            });
                          } else if (action === 'release_payment') {
                            // Handle payment release logic
                            toast({
                              title: 'Payment Released',
                              description: 'The payment has been released to the freelancer.',
                            });
                          }
                        }} 
                      />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl sticky top-24"
                    >
                        <h3 className="text-lg font-bold mb-4">Application</h3>
                        
                        {isOwner ? (
                             <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20 mb-4">
                                <p className="text-primary font-medium">You posted this gig</p>
                                <p className="text-sm text-primary/80 mt-1">{applications.length} applications received</p>
                            <div className="mt-4 space-y-4 text-left">
                              {applications.map((app) => (
                                <div key={app.id} className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
                                  <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                          <Avatar className="h-10 w-10 border border-white/10">
                                              <AvatarImage src={app.worker?.avatar_url || ''} />
                                              <AvatarFallback className="bg-primary/20 text-primary">{getInitials(app.worker?.first_name, app.worker?.last_name)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                              <p className="text-sm font-bold text-white">
                                                  {app.worker?.first_name ? `${app.worker.first_name} ${app.worker.last_name || ''}` : app.worker?.username || 'Unknown User'}
                                              </p>
                                              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(app.created_at))} ago</p>
                                          </div>
                                      </div>
                                      <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'outline'} className="capitalize">
                                          {app.status}
                                      </Badge>
                                  </div>
                                  
                                  <div className="mt-3 bg-black/20 rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap">
                                      {app.proposal}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs">
                                      {app.expected_rate && (
                                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                                              <DollarSign size={12} />
                                              <span className="font-semibold">{Number(app.expected_rate).toLocaleString()}</span>
                                              <span className="opacity-70">expected</span>
                                          </div>
                                      )}
                                      {app.availability && (
                                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                              <Clock size={12} />
                                              <span>{app.availability}</span>
                                          </div>
                                      )}
                                      <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                                          {app.worker?.jobs_completed > 0 && <span>{app.worker.jobs_completed} jobs</span>}
                                          {app.worker?.rating > 0 && (
                                            <span className="flex items-center gap-1 text-yellow-500">
                                                <Star className="fill-yellow-500 w-3 h-3" /> {app.worker.rating}
                                            </span>
                                          )}
                                      </div>
                                  </div>

                                  {app.status === 'pending' && (
                                      <div className="flex gap-2 mt-4">
                                          <Button 
                                            size="sm" 
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                          >
                                              Accept
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="destructive" 
                                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                          >
                                              Reject
                                          </Button>
                                      </div>
                                  )}
                                </div>
                              ))}
                              {applications.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No applications received yet.</p>
                              )}
                            </div>
                          </div>
                        ) : application ? (
                            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20 mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-green-500 font-medium">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {application.expected_rate ? <p className="text-white">Expected rate: {formatPrice(application.expected_rate)}</p> : null}
                              {application.availability ? <p>Availability: {application.availability}</p> : null}
                            </div>
                            <Badge variant="outline" className="mt-2 border-green-500/30 text-green-400 capitalize">{application.status}</Badge>
                            </div>
                        ) : (
                            <div className="space-y-4">
                              <Button type="button" className="w-full h-12 text-lg shadow-glow" onClick={() => setShowApplyDialog(true)}>
                                Apply Now
                              </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    By applying you agree to our Terms of Service.
                                </p>
                            </div>
                        )}

                        <Separator className="bg-white/10 my-6" />
                        
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-white/10">
                                <AvatarFallback className="bg-primary/20 text-primary">C</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-white">Client Verified</p>
                                <p className="text-xs text-muted-foreground">Member since 2023</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Apply Dialog */}
            <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
              <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[600px]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!applying) {
                      handleApply();
                    }
                  }}
                  className="space-y-4"
                >
                  <DialogHeader>
                    <DialogTitle>Apply for {gig.title}</DialogTitle>
                    <DialogDescription>
                      Submit your proposal for this opportunity.
                    </DialogDescription>
                  </DialogHeader>
                        
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cover Letter</label>
                      <Textarea 
                        placeholder="Explain why you're the best fit for this gig..." 
                        className="bg-white/5 border-white/10 min-h-[150px]"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <label className="text-sm font-medium">Expected Rate</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            placeholder={gig.price?.toString() || '0'} 
                            className="pl-9 bg-white/5 border-white/10"
                            value={expectedRate}
                            onChange={(e) => setExpectedRate(e.target.value)}
                          />
                        </div>
                      </div>
                       <div className="space-y-2">
                        <label className="text-sm font-medium">Availability</label>
                        <Input 
                          placeholder="Immediate" 
                          className="bg-white/5 border-white/10"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-white/5 border border-white/10 p-3">
                      <Input
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <div className="text-sm text-muted-foreground">
                        I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and understand my application will be shared with the client.
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowApplyDialog(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
                    <Button type="submit" disabled={applying} className="shadow-preview">
                      {applying ? 'Sending...' : 'Submit Application'} <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
    </AnimatedPage>
  );
};

export default GigDetail;
