
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DollarSign, MapPin, Calendar, Clock, Calendar as CalendarIcon, User, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const GigDetail = () => {
  const { id } = useParams();
  const { user, isLoading } = useAuth();
  const [gig, setGig] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      fetchGigData();
    }
  }, [id, isLoading, user]);

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

  const fetchGigData = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        throw new Error("Gig ID is missing");
      }
      
      // Fetch gig with a flat select
      const { data: gigData, error: gigError } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (gigError) {
        console.error("Error fetching gig:", gigError);
        throw gigError;
      }
      
      console.log('Fetched gig details:', gigData);
      
      if (!gigData) {
        throw new Error("Gig not found");
      }
      
      setGig(gigData);
      
      // Optionally, fetch client profile here if needed
      if (user) {
        // Check if current user is the owner
        const isUserOwner = user.id === gigData.client_id;
        setIsOwner(isUserOwner);
        
        // If user is owner, fetch applications
        if (isUserOwner) {
          // Fetch applications with a flat select
          const { data: appsData, error: appsError } = await supabase
            .from('applications')
            .select('*')
            .eq('gig_id', id);
          if (appsError) {
            console.error("Error fetching applications:", appsError);
            throw appsError;
          }
          setApplications(appsData || []);
        } else {
          // Check if current user has applied
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('gig_id', id)
            .eq('worker_id', user.id)
            .maybeSingle();
          
          if (appError) {
            console.error("Error checking application:", appError);
            // Don't throw here as this is not a critical error
          } else {
            console.log('Current user application:', appData);
            setApplication(appData);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching gig details:', error);
      toast({
        title: "Error fetching gig details",
        description: error.message || "Failed to load gig details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    try {
      setApplying(true);
      let fileUrl = null;
      let introMediaUrl = null;
      // Upload file if present
      if (file) {
        const { data, error } = await supabase.storage.from('applications').upload(`files/${Date.now()}_${file.name}`, file);
        if (error) throw error;
        fileUrl = data?.path ? supabase.storage.from('applications').getPublicUrl(data.path).publicURL : null;
      }
      // Upload intro media if present
      if (introMedia) {
        const { data, error } = await supabase.storage.from('applications').upload(`media/${Date.now()}_${introMedia.name}`, introMedia);
        if (error) throw error;
        introMediaUrl = data?.path ? supabase.storage.from('applications').getPublicUrl(data.path).publicURL : null;
      }
      const newApplication = {
        gig_id: id,
        worker_id: user.id,
        proposal,
        expected_rate: expectedRate,
        availability,
        portfolio,
        file_url: fileUrl,
        intro_media_url: introMediaUrl,
        request_interview: requestInterview,
        status: 'pending',
      };
      const { data, error } = await supabase
        .from('applications')
        .insert(newApplication)
        .select()
        .single();
      if (error) throw error;
      setApplication(data);
      setShowApplyDialog(false);
      setProposal('');
      setExpectedRate('');
      setAvailability('');
      setPortfolio('');
      setFile(null);
      setIntroMedia(null);
      setAgreeTerms(false);
      setRequestInterview(false);
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully!",
      });
      // Notify client
      if (gig && gig.client_id) {
        await supabase.from('notifications').insert({
          id: uuidv4(),
          user_id: gig.client_id,
          title: 'New Application',
          message: `${user.user_metadata?.first_name || user.email} applied to your gig: ${gig.title}`,
          type: 'application',
          link: `/gigs/${gig.id}`,
          read: false,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
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
      
      let workerId = applications.find(app => app.id === applicationId)?.worker_id;
      // Notify applicant
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

  // Rating submission (after gig completion)
  const handleSubmitRating = async () => {
    if (!ratingValue || !gig) return;
    // For demo: just toast, but in real app, would update DB
    toast({
      title: 'Thank you for your feedback!',
      description: 'Your rating has been submitted.',
    });
    setShowRatingDialog(false);
    setRatingValue(0);
    setRatingComment('');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gigstr-purple"></div>
      </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--color-card)]">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gig header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{gig.title}</h1>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    gig.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : gig.status === 'in_progress' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {gig.status === 'open' ? 'Open' : 
                     gig.status === 'in_progress' ? 'In Progress' : 'Completed'}
                  </div>
                  <Button size="icon" variant={bookmark ? 'default' : 'outline'} onClick={handleBookmark} title={bookmark ? 'Bookmarked' : 'Bookmark'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={bookmark ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
                    </svg>
                  </Button>
                </div>
              </div>
              
              <div className="prose max-w-none mb-6">
                <p>{gig.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground flex items-center">
                    <span className="font-bold text-lg mr-1">R</span> Price
                  </div>
                  <div className="font-semibold">{formatPrice(gig.price)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Location
                  </div>
                  <div className="font-semibold">{gig.location || 'Remote'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> Start Date
                  </div>
                  <div className="font-semibold">
                    {gig.start_date ? new Date(gig.start_date).toLocaleDateString() : 'Flexible'}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Posted
                  </div>
                  <div className="font-semibold">
                    {formatDistanceToNow(new Date(gig.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Applications section for owner */}
            {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Applications ({applications.length})</CardTitle>
                  <CardDescription>
                    Review and respond to applications for this gig
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <div className="space-y-6">
                      {applications.map(app => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              {app.worker?.profiles?.[0]?.avatar_url ? (
                                <AvatarImage src={app.worker.profiles[0].avatar_url} />
                              ) : (
                                <AvatarFallback>
                                  {getInitials(
                                    app.worker?.profiles?.[0]?.first_name,
                                    app.worker?.profiles?.[0]?.last_name
                                  )}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">
                                  {app.worker?.profiles?.[0]?.first_name || 'User'} {app.worker?.profiles?.[0]?.last_name || ''}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  app.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : app.status === 'accepted' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm">{app.worker?.profiles?.[0]?.rating || 'New'}</span>
                                <span className="ml-2 text-xs text-muted-foreground">{app.worker?.profiles?.[0]?.completed_gigs || 0} completed gigs</span>
                                {app.worker?.profiles?.[0]?.is_verified && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Verified</span>}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                              </p>
                              <div className="mt-3 border-l-2 border-muted pl-3 italic">
                                "{app.proposal}"
                              </div>
                              
                              {/* Show extra fields if present */}
                              {app.expected_rate && <div className="mt-2 text-sm">Expected Rate: R{app.expected_rate}</div>}
                              {app.availability && <div className="mt-2 text-sm">Availability: {app.availability}</div>}
                              {app.portfolio && <div className="mt-2 text-sm">Portfolio: <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{app.portfolio}</a></div>}
                              {app.file_url && <div className="mt-2 text-sm">File: <a href={app.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a></div>}
                              {app.intro_media_url && <div className="mt-2 text-sm">Intro: <a href={app.intro_media_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View/Listen</a></div>}
                              {app.request_interview && <div className="mt-2 text-sm">Requested Interview</div>}
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${app.worker?.profiles?.[0]?.id}`)}>View Profile</Button>
                                <Button size="sm" onClick={() => navigate(`/messages?recipient=${app.worker?.profiles?.[0]?.id}`)}>Message</Button>
                              </div>
                              {app.status === 'pending' && gig.status === 'open' && (
                                <div className="mt-4 flex gap-3">
                                  <Button 
                                    onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                    className="flex items-center"
                                    size="sm"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Accept
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                    className="flex items-center"
                                    size="sm"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No applications yet
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Application status section for applicant */}
            {!isOwner && application && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Application</CardTitle>
                  <CardDescription>
                    Status: <span className={`${
                      application.status === 'pending' 
                        ? 'text-yellow-600' 
                        : application.status === 'accepted' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-l-2 border-muted pl-3 italic">
                    "{application.proposal}"
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* After gig is completed, show rating dialog */}
            {gig.status === 'completed' && !isOwner && (
              <Button className="mt-4" onClick={() => setShowRatingDialog(true)}>
                Rate Client
              </Button>
            )}
            {gig.status === 'completed' && isOwner && (
              <Button className="mt-4" onClick={() => setShowRatingDialog(true)}>
                Rate Worker
              </Button>
            )}
            <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leave a Rating</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setRatingValue(star)}>
                        <span className={star <= ratingValue ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>★</span>
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Leave a comment (optional)"
                    value={ratingComment}
                    onChange={e => setRatingComment(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleSubmitRating} disabled={!ratingValue}>Submit</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action card */}
            <Card>
              <CardContent className="pt-6">
                {isOwner ? (
                  <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                    Manage in Dashboard
                  </Button>
                ) : gig.status === 'open' && !application ? (
                  <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Apply Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply to: {gig.title}</DialogTitle>
                        <DialogDescription>
                          Write a compelling proposal to increase your chances of being selected.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Your Proposal</label>
                          <Textarea 
                            placeholder="Explain why you're perfect for this gig..."
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Expected Rate (optional)</label>
                          <input
                            type="number"
                            className="input"
                            placeholder="e.g. 500"
                            value={expectedRate}
                            onChange={e => setExpectedRate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Availability</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g. Weekends, evenings, specific dates"
                            value={availability}
                            onChange={e => setAvailability(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Portfolio Link</label>
                          <input
                            type="url"
                            className="input"
                            placeholder="https://yourportfolio.com"
                            value={portfolio}
                            onChange={e => setPortfolio(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Upload File (CV, Portfolio, etc.)</label>
                          <input
                            type="file"
                            className="input"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Intro Video/Audio (optional)</label>
                          <input
                            type="file"
                            accept="video/*,audio/*"
                            className="input"
                            onChange={e => setIntroMedia(e.target.files?.[0] || null)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={e => setAgreeTerms(e.target.checked)}
                            id="agreeTerms"
                          />
                          <label htmlFor="agreeTerms" className="text-sm">I agree to the terms and conditions</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={requestInterview}
                            onChange={e => setRequestInterview(e.target.checked)}
                            id="requestInterview"
                          />
                          <label htmlFor="requestInterview" className="text-sm">Request a call/interview</label>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowApplyDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleApply} 
                          disabled={!proposal.trim() || applying || !agreeTerms}
                        >
                          {applying ? "Submitting..." : "Submit Application"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : gig.status !== 'open' ? (
                  <div className="text-center text-muted-foreground py-2">
                    This gig is no longer accepting applications.
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-2">
                    You've already applied to this gig.
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Client info card */}
            <Card>
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                {gig.client && gig.client.profiles && gig.client.profiles[0] ? (
                  <div className="flex items-start gap-4">
                    <Avatar>
                      {gig.client.profiles[0]?.avatar_url ? (
                        <AvatarImage src={gig.client.profiles[0].avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {getInitials(
                            gig.client.profiles[0]?.first_name,
                            gig.client.profiles[0]?.last_name
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {gig.client.profiles[0]?.first_name || ''} {gig.client.profiles[0]?.last_name || ''}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{gig.client.profiles[0]?.username || 'username'}
                      </p>
                      {/* Creative: Show rating, completed gigs, badges */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{gig.client.profiles[0]?.rating || 'New'}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{gig.client.profiles[0]?.completed_gigs || 0} completed gigs</span>
                        {gig.client.profiles[0]?.is_verified && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Verified</span>}
                      </div>
                      {/* Buttons */}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${gig.client.profiles[0].id}`)}>View Profile</Button>
                        {!isOwner && <Button size="sm" onClick={() => navigate(`/messages?recipient=${gig.client.profiles[0].id}`)}>Message</Button>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-2">
                    Client information unavailable
                  </div>
                )}
                
                {gig.client?.profiles?.[0]?.bio && (
                  <div className="mt-4 text-sm">
                    {gig.client.profiles[0].bio}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Related gigs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Gigs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarGigs.length > 0 ? (
                  similarGigs.map(sim => (
                    <div key={sim.id} className="border rounded p-2 flex flex-col gap-1">
                      <span className="font-medium">{sim.title}</span>
                      <span className="text-xs text-muted-foreground">{sim.location || 'Remote'} | R{sim.price}</span>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/gigs/${sim.id}`)}>View</Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">No similar gigs found</p>
                )}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/gigs')}
                >
                  Browse All Gigs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
