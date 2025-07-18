
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      fetchGigData();
    }
  }, [id, isLoading, user]);

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
    
    try {
      setApplying(true);
      
      const newApplication = {
        gig_id: id,
        worker_id: user.id,
        proposal,
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
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully!",
      });
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
      
      if (status === 'accepted') {
        // Update gig status to in_progress
        const { error: gigError } = await supabase
          .from('gigs')
          .update({ 
            status: 'in_progress',
            worker_id: applications.find(app => app.id === applicationId)?.worker_id
          })
          .eq('id', id);
        
        if (gigError) throw gigError;
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
                              <p className="text-sm text-muted-foreground">
                                Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                              </p>
                              <div className="mt-3 border-l-2 border-muted pl-3 italic">
                                "{app.proposal}"
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
                      
                      <div className="py-4">
                        <label className="block text-sm font-medium mb-2">
                          Your Proposal
                        </label>
                        <Textarea 
                          placeholder="Explain why you're perfect for this gig..."
                          value={proposal}
                          onChange={(e) => setProposal(e.target.value)}
                          rows={6}
                        />
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
                          disabled={!proposal.trim() || applying}
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
                <p className="text-center text-sm text-muted-foreground">
                  Related gigs will appear here
                </p>
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
