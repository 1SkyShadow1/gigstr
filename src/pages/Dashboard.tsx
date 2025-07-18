
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, DollarSign, MapPin, Briefcase, ArrowRight, Award, Star } from 'lucide-react';
import Loader from '@/components/ui/loader';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const Dashboard = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMyGigs();
      fetchMyApplications();
    }
  }, [user]);

  const fetchMyGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyGigs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching gigs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchMyApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          gigs:gig_id(*)
        `)
        .eq('worker_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--color-card)]">
      <div className="container-custom py-8">
        {/* Profile Summary */}
        <div className="bg-gradient-to-r from-gigstr-purple to-gigstr-indigo text-white rounded-xl p-6 mb-8 shadow-md dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow transition-shadow">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} />
              ) : (
                <AvatarFallback className="bg-white/10 text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-grow">
              <h1 className="text-2xl font-bold mb-1">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-white/80 mb-2">@{profile?.username || 'username'}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {profile?.skills && profile.skills.map((skill: string, i: number) => (
                  <span key={i} className="bg-white/10 rounded-full px-3 py-1 text-sm">
                    {skill}
                  </span>
                ))}
                {(!profile?.skills || profile.skills.length === 0) && (
                  <span className="text-white/60 text-sm">No skills added yet</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 md:self-start">
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-gigs">My Gigs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-gigstr-purple" /> 
                    My Active Gigs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{myGigs.filter(g => g.status === 'open').length}</div>
                  <p className="text-muted-foreground">Open opportunities you've posted</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="mr-2 h-5 w-5 text-gigstr-purple" /> 
                    Applications Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{myApplications.length}</div>
                  <p className="text-muted-foreground">Jobs you've applied for</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Star className="mr-2 h-5 w-5 text-gigstr-purple" /> 
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{profile?.rating || '0.0'} / 5</div>
                  <p className="text-muted-foreground">From {profile?.jobs_completed || 0} completed jobs</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Gigs */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Gigs</CardTitle>
                  <CardDescription>Gigs you've recently posted</CardDescription>
                </CardHeader>
                <CardContent>
                  {myGigs.length > 0 ? (
                    <div className="space-y-4">
                      {myGigs.slice(0, 3).map(gig => (
                        <div key={gig.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="font-medium">{gig.title}</div>
                          <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                            <span className="flex items-center">
                              <span className="font-bold text-lg mr-1">R</span>{formatPrice(gig.price)}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {gig.location || 'Remote'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {new Date(gig.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You haven't posted any gigs yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/create-gig')}
                      >
                        Create Your First Gig
                      </Button>
                    </div>
                  )}
                </CardContent>
                {myGigs.length > 0 && (
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => setActiveTab('my-gigs')}
                    >
                      View All Gigs <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Gigs you've recently applied for</CardDescription>
                </CardHeader>
                <CardContent>
                  {myApplications.length > 0 ? (
                    <div className="space-y-4">
                      {myApplications.slice(0, 3).map(app => (
                        <div key={app.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="font-medium">{app.gigs.title}</div>
                          <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                            <span className="flex items-center">
                              <span className="font-bold text-lg mr-1">R</span>{formatPrice(app.gigs.price)}
                            </span>
                            <span className="flex items-center bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 text-xs">
                              {app.status}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You haven't applied to any gigs yet</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/gigs')}
                      >
                        Browse Available Gigs
                      </Button>
                    </div>
                  )}
                </CardContent>
                {myApplications.length > 0 && (
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => setActiveTab('applications')}
                    >
                      View All Applications <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-gigs">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Gigs</h2>
                <Button onClick={() => navigate('/create-gig')}>Create New Gig</Button>
              </div>

              {myGigs.length > 0 ? (
                <div className="grid gap-4">
                  {myGigs.map(gig => (
                    <Card key={gig.id} className="hover:shadow-md transition-shadow dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle>{gig.title}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            gig.status === 'open' 
                              ? 'bg-green-100 text-green-800' 
                              : gig.status === 'in_progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {gig.status === 'open' ? 'Open' : 
                             gig.status === 'in_progress' ? 'In Progress' : 'Completed'}
                          </span>
                        </div>
                        <CardDescription className="line-clamp-2">{gig.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center">
                            <span className="font-bold text-lg mr-1">R</span>{formatPrice(gig.price)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gigstr-purple" />
                            {gig.location || 'Remote'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gigstr-purple" />
                            Posted {new Date(gig.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/gigs/${gig.id}`)}
                        >
                          Manage Gig
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">No Gigs Found</h3>
                  <p className="text-muted-foreground mb-6">You haven't posted any gigs yet.</p>
                  <Button onClick={() => navigate('/create-gig')}>Create Your First Gig</Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="grid grid-cols-1 gap-6">
              <h2 className="text-2xl font-bold">My Applications</h2>

              {myApplications.length > 0 ? (
                <div className="grid gap-4">
                  {myApplications.map(app => (
                    <Card key={app.id} className="hover:shadow-md transition-shadow dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle>{app.gigs.title}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            app.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : app.status === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {app.status === 'pending' ? 'Pending' : 
                             app.status === 'accepted' ? 'Accepted' : 'Rejected'}
                          </span>
                        </div>
                        <CardDescription>Applied on {new Date(app.created_at).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Your Proposal</h4>
                          <p className="text-muted-foreground text-sm">{app.proposal}</p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <span className="font-bold text-lg mr-1">R</span>{formatPrice(app.gigs.price)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gigstr-purple" />
                            {app.gigs.location || 'Remote'}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/gigs/${app.gig_id}`)}
                        >
                          View Gig Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
                  <p className="text-muted-foreground mb-6">You haven't applied to any gigs yet.</p>
                  <Button onClick={() => navigate('/gigs')}>Browse Available Gigs</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
