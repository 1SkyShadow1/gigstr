import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToBucket } from '@/lib/storage';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Shield, Award, Check, Star, Settings, Camera, Mail, Briefcase, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChangeEmailDialog from '@/components/ChangeEmailDialog';
import ReauthenticationModal from '@/components/ReauthenticationModal';
import Loader from '@/components/ui/loader';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, profile, isLoading, updatePassword, isReauthenticationRequired } = useAuth();
  const { id: profileIdParam } = useParams();
  const [viewedProfile, setViewedProfile] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
        const [performance, setPerformance] = useState({ earnings: 0, jobsDone: 0, rating: 0, reviewsCount: 0 });
        const [performanceLoading, setPerformanceLoading] = useState(false);
        const [reviews, setReviews] = useState<any[]>([]);
  
  // Only essential states for UI demo
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // If viewing another user's profile
    if (profileIdParam && (!profile || profileIdParam !== user?.id)) {
      const fetchOtherProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileIdParam)
          .single();
        if (!error && data) setViewedProfile(data);
      };
      fetchOtherProfile();
    } else {
      setViewedProfile(profile);
    }
  }, [profileIdParam, profile, user]);

  useEffect(() => {
      if (viewedProfile) {
          setFirstName(viewedProfile.first_name || '');
          setLastName(viewedProfile.last_name || '');
          setBio(viewedProfile.bio || '');
          fetchPortfolio(viewedProfile.id);
                    fetchPerformance(viewedProfile.id, viewedProfile);
      }
  }, [viewedProfile]);

    const fetchPerformance = async (ownerId: string, profileData: any) => {
        setPerformanceLoading(true);
        try {
            const jobsDone = Number(profileData?.jobs_completed || 0);

            const [{ data: invoices, error: invoicesError }, { data: reviewsData, error: reviewsError }] = await Promise.all([
                supabase.from('invoices').select('amount,status').eq('user_id', ownerId),
                supabase
                    .from('reviews')
                    .select('rating,comment,created_at,client_id')
                    .eq('freelancer_id', ownerId)
                    .order('created_at', { ascending: false }),
            ]);

            if (invoicesError) throw invoicesError;
            if (reviewsError) throw reviewsError;

            const normalizedReviews = (reviewsData || []).map((r: any) => ({
                ...r,
                reviewer_name: 'Client',
                reviewer_initials: 'CL',
            }));
            setReviews(normalizedReviews);

            const earnings = (invoices || [])
                .filter((inv) => (inv as any).status === 'paid')
                .reduce((sum, inv) => sum + Number((inv as any).amount || 0), 0);

            const avgRating = normalizedReviews.length
                ? normalizedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / normalizedReviews.length
                : Number(profileData?.rating || 0);

            setPerformance({
                earnings,
                jobsDone,
                rating: avgRating || 0,
                reviewsCount: normalizedReviews.length,
            });
        } catch (error) {
            console.error('Error loading performance', error);
            setPerformance({ earnings: 0, jobsDone: Number(profileData?.jobs_completed || 0), rating: Number(profileData?.rating || 0), reviewsCount: 0 });
            setReviews([]);
        } finally {
            setPerformanceLoading(false);
        }
    };

  const fetchPortfolio = async (ownerId: string) => {
      try {
          const { data, error } = await supabase
              .from('portfolio_items')
              .select('*')
              .eq('user_id', ownerId)
              .order('created_at', { ascending: false });
          if (error) throw error;
          setPortfolioItems(data || []);
      } catch (error) {
          console.error('Error loading portfolio', error);
      }
  };

  const handleUpdateProfile = async () => {
      try {
          setIsUpdating(true);
          const updates = {
              id: user?.id,
              first_name: firstName,
              last_name: lastName,
              bio: bio,
              updated_at: new Date().toISOString(),
          };

          const { error } = await supabase.from('profiles').upsert(updates);
          if (error) throw error;
          toast({ title: "Profile updated" });
      } catch (error: any) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
          setIsUpdating(false);
      }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !user) return;
      try {
          setIsUploadingAvatar(true);
          const { url } = await uploadFileToBucket({
              bucket: 'avatars',
              file,
              folder: user.id,
          });

          const { error } = await supabase
              .from('profiles')
              .update({ avatar_url: url, updated_at: new Date().toISOString() })
              .eq('id', user.id);

          if (error) throw error;
          setViewedProfile((prev: any) => prev ? { ...prev, avatar_url: url } : prev);
          toast({ title: 'Avatar updated', description: 'Your new profile photo is live.' });
      } catch (err: any) {
          toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      } finally {
          setIsUploadingAvatar(false);
          if (avatarInputRef.current) {
              avatarInputRef.current.value = '';
          }
      }
  };

    const formatCurrency = (value: number) => `R ${Number(value || 0).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  if (!viewedProfile) return null;

  const isOwnProfile = user?.id === viewedProfile.id;

  return (
    <AnimatedPage>
        <div className="relative pb-20 min-h-screen">
            {/* Header / Cover */}
            <div className="h-64 md:h-96 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 z-0" />
                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                
                {/* Actual cover image if available, else decorative gradient */}
                <div 
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 dark:opacity-20"
                />
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-32">
                {/* Main Profile Header Card */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="glass-panel rounded-3xl p-6 md:p-10 shadow-2xl mb-8 backdrop-blur-3xl border-border/50"
                >
                    <div className="flex flex-col md:flex-row gap-8 md:items-end">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary via-purple-500 to-blue-500 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background shadow-2xl rounded-[1.8rem] relative z-10">
                                <AvatarImage src={viewedProfile.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-5xl font-heading bg-gradient-to-br from-primary to-purple-600 text-white rounded-[1.8rem]">
                                    {viewedProfile.first_name?.[0]}{viewedProfile.last_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            {isOwnProfile && (
                                <>
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute bottom-2 right-2 z-20 rounded-xl shadow-lg h-10 w-10 border border-white/20 hover:scale-110 transition-transform"
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
                                    >
                                        {isUploadingAvatar ? <Loader className="h-4 w-4" /> : <Camera size={18} />}
                                    </Button>
                                </>
                            )}
                        </div>
                        
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight text-foreground">{viewedProfile.first_name} {viewedProfile.last_name}</h1>
                                            {viewedProfile.verification_status === 'verified' && (
                                                <div className="bg-green-500/10 text-green-600 border border-green-500/20 p-1 rounded-full" title="Verified">
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-lg flex items-center gap-3 mt-2 font-medium">
                                            <span className="text-primary">@{viewedProfile.username || 'username'}</span>
                                        </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {isOwnProfile ? (
                                        <>
                                            <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary gap-2 h-12 px-6 rounded-xl" onClick={() => setActiveTab('settings')}>
                                                <Settings size={18} /> Edit Profile
                                            </Button>
                                            <Button className="shadow-glow gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                                                <PlusCircle size={18} /> Create Gig
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="h-12 px-6 rounded-xl gap-2">
                                                More Options
                                            </Button>
                                            <Button className="shadow-glow gap-2 h-12 px-8 rounded-xl bg-primary text-white hover:bg-primary/90">
                                                <Mail size={18} /> Hire Now
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                                                                <div className="flex gap-3 mt-6 flex-wrap">
                                                                        {viewedProfile.skills?.length > 0 && (
                                                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-4 py-1.5 text-sm rounded-lg">
                                                                                <Briefcase size={14} className="mr-2" /> {viewedProfile.skills.slice(0,2).join(' • ')}
                                                                            </Badge>
                                                                        )}
                                                                        {viewedProfile.verification_status && (
                                                                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-4 py-1.5 text-sm rounded-lg">
                                                                                <Shield size={14} className="mr-2" /> {viewedProfile.verification_status}
                                                                            </Badge>
                                                                        )}
                                                                </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Layout for Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar (Stats & Info) */}
                    <div className="lg:col-span-4 space-y-6">
                         {/* Stats Card */}
                         <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.1 }}
                             className="glass-card rounded-2xl p-6"
                         >
                            <h3 className="font-heading font-semibold mb-4 text-foreground">Performance</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Earnings</div>
                                    <div className="text-xl font-bold font-heading text-foreground">{performanceLoading ? '—' : formatCurrency(performance.earnings)}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Jobs Done</div>
                                    <div className="text-xl font-bold font-heading text-foreground">{performanceLoading ? '—' : performance.jobsDone}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Rating</div>
                                    <div className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                                        {performanceLoading ? '—' : performance.rating.toFixed(1)}
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Reviews</div>
                                    <div className="text-xl font-bold font-heading text-foreground">{performanceLoading ? '—' : performance.reviewsCount}</div>
                                </div>
                            </div>
                         </motion.div>

                        {/* About Card */}
                        <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.2 }}
                             className="glass-card rounded-2xl p-6"
                        >
                             <h3 className="font-heading font-semibold mb-4 text-foreground">About Me</h3>
                             <p className="text-muted-foreground leading-relaxed">
                                {viewedProfile.bio || "I am a passionate gig worker ready to take on new challenges. I specialize in delivering high-quality work with quick turnaround times."}
                             </p>
                             
                             <div className="mt-6 space-y-3">
                                <div className="flex items-center text-sm text-foreground/80">
                                    <MapPin size={16} className="mr-3 text-primary" /> From Johannesburg, South Africa
                                </div>
                                <div className="flex items-center text-sm text-foreground/80">
                                    <Briefcase size={16} className="mr-3 text-primary" /> Member since Jan 2024
                                </div>
                                <div className="flex items-center text-sm text-foreground/80">
                                    <Check size={16} className="mr-3 text-primary" /> English, Zulu, Afrikaans
                                </div>
                             </div>
                        </motion.div>
                    </div>

                    {/* Right Content Area (Tabs) */}
                    <div className="lg:col-span-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-card/50 backdrop-blur-md border border-border/50 p-1.5 rounded-2xl w-full flex justify-start overflow-x-auto no-scrollbar">
                                <TabsTrigger value="overview" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">Overview</TabsTrigger>
                                <TabsTrigger value="portfolio" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">Portfolio</TabsTrigger>
                                <TabsTrigger value="reviews" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">Reviews</TabsTrigger>
                                {isOwnProfile && <TabsTrigger value="settings" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">Edit Profile</TabsTrigger>}
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                                                {/* Featured Project / Gig */}
                                                                {portfolioItems.length > 0 ? (
                                                                    <Card className="glass-card overflow-hidden border-border/50">
                                                                            <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                                                                                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                                                                                            Featured Work
                                                                                    </div>
                                                                            </div>
                                                                            <CardContent className="p-6">
                                                                                    {(() => {
                                                                                        const featured = portfolioItems[0];
                                                                                        return (
                                                                                            <>
                                                                                                <div className="flex justify-between items-start mb-2">
                                                                                                        <div>
                                                                                                                <h3 className="text-xl font-bold font-heading">{featured.title || 'Untitled project'}</h3>
                                                                                                                {featured.category && <p className="text-sm text-primary mb-3">{featured.category}</p>}
                                                                                                        </div>
                                                                                                        <div className="text-right">
                                                                                                                {featured.budget ? (
                                                                                                                    <div className="text-lg font-bold">R {Number(featured.budget).toLocaleString()}</div>
                                                                                                                ) : null}
                                                                                                                {featured.pricing_model && (
                                                                                                                    <div className="text-xs text-muted-foreground capitalize">{featured.pricing_model}</div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                </div>
                                                                                                {featured.description && (
                                                                                                    <p className="text-muted-foreground mb-4 line-clamp-2">
                                                                                                        {featured.description}
                                                                                                    </p>
                                                                                                )}
                                                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                                                        <div className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {performance.rating.toFixed(1)} Rating</div>
                                                                                                        {featured.completed_at && <><div>•</div><div>{new Date(featured.completed_at).toLocaleDateString()}</div></>}
                                                                                                </div>
                                                                                            </>
                                                                                        );
                                                                                    })()}
                                                                            </CardContent>
                                                                    </Card>
                                                                ) : (
                                                                    <div className="p-6 rounded-2xl border border-dashed border-border/60 text-center text-muted-foreground bg-card/30">
                                                                        <p className="mb-3">No featured work yet.</p>
                                                                        {isOwnProfile && (
                                                                            <Button variant="outline" className="gap-2" onClick={() => navigate('/tools/showcase')}>
                                                                                <PlusCircle size={16} /> Add featured project
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                )}

                                {/* Recent Reviews Preview */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold font-heading px-1">Recent Feedback</h3>
                                                                        {reviews.length === 0 && (
                                                                            <div className="p-6 rounded-2xl border border-dashed border-border/60 text-center text-muted-foreground bg-card/30">
                                                                                No reviews yet. Complete gigs to start collecting feedback.
                                                                            </div>
                                                                        )}
                                                                        {reviews.length > 0 && (
                                                                            <div className="grid gap-4">
                                                                                {reviews.slice(0, 3).map((review, idx) => (
                                                                                    <Card key={idx} className="bg-card/30 border-border/50 shadow-sm hover:bg-card/50 transition-colors">
                                                                                        <CardContent className="p-5">
                                                                                            <div className="flex gap-4">
                                                                                                <Avatar className="h-10 w-10 border border-border">
                                                                                                    <AvatarFallback>{review.reviewer_initials || 'CL'}</AvatarFallback>
                                                                                                </Avatar>
                                                                                                <div className="w-full">
                                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                                        <span className="font-semibold text-foreground">{review.reviewer_name || 'Client'}</span>
                                                                                                        <div className="flex text-yellow-400">
                                                                                                            {Array.from({ length: 5 }).map((_, s) => (
                                                                                                                <Star key={s} size={12} fill={s < (review.rating || 0) ? 'currentColor' : 'none'} className={s < (review.rating || 0) ? 'text-yellow-400' : 'text-muted-foreground/40'} />
                                                                                                            ))}
                                                                                                        </div>
                                                                                                        <span className="text-xs text-muted-foreground ml-auto">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</span>
                                                                                                    </div>
                                                                                                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                                                                                        {review.comment || 'No comment provided.'}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                </div>
                            </TabsContent>

                            <TabsContent value="portfolio">
                                                                {portfolioItems.length === 0 ? (
                                                                    <div className="p-8 rounded-2xl border border-dashed border-border text-center bg-card/30">
                                                                        <p className="text-muted-foreground mb-4">No portfolio projects yet.</p>
                                                                        {isOwnProfile && (
                                                                            <Button onClick={() => navigate('/tools/showcase')} variant="outline" className="gap-2">
                                                                                <PlusCircle size={16} /> Add your first project
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        {portfolioItems.map((item) => (
                                                                            <div key={item.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                                                                                    {item.image_url ? (
                                                                                            <img 
                                                                                                    src={item.image_url} 
                                                                                                    alt={item.title} 
                                                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                                            />
                                                                                    ) : (
                                                                                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                                                                                                    {item.title || 'Project'}
                                                                                            </div>
                                                                                    )}
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                                                            <h4 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h4>
                                                                                            <p className="text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.tags?.join(' • ')}</p>
                                                                                    </div>
                                                                                    {item.project_url && (
                                                                                        <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                                                                                                    <ExternalLink size={14} />
                                                                                                </Button>
                                                                                        </a>
                                                                                    )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                            </TabsContent>

                            <TabsContent value="reviews">
                                                                 <Card className="glass-card border-border/50">
                                                                     <CardContent className="p-6 space-y-4">
                                                                         <div className="flex items-center gap-4">
                                                                             <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                                                                 <div className="text-3xl font-bold flex items-center gap-2">{performance.rating.toFixed(1)} <Star size={18} className="text-yellow-400 fill-yellow-400" /></div>
                                                                                 <div className="text-sm text-muted-foreground">Average rating</div>
                                                                                 <div className="text-xs text-muted-foreground">{performance.reviewsCount} review{performance.reviewsCount === 1 ? '' : 's'}</div>
                                                                             </div>
                                                                         </div>

                                                                         {reviews.length === 0 && (
                                                                             <div className="text-center py-8 text-muted-foreground border border-dashed border-border/60 rounded-2xl bg-card/30">
                                                                                 No reviews yet. Complete gigs to start collecting feedback.
                                                                             </div>
                                                                         )}

                                                                         {reviews.length > 0 && (
                                                                             <div className="space-y-4">
                                                                                 {reviews.map((review, idx) => (
                                                                                     <div key={idx} className="p-4 rounded-xl border border-border/60 bg-card/30">
                                                                                         <div className="flex items-center justify-between mb-2">
                                                                                             <div className="font-semibold">{review.reviewer_name || 'Client'}</div>
                                                                                             <div className="flex items-center gap-1 text-yellow-400">
                                                                                                 {Array.from({ length: 5 }).map((_, s) => (
                                                                                                     <Star key={s} size={14} fill={s < (review.rating || 0) ? 'currentColor' : 'none'} className={s < (review.rating || 0) ? 'text-yellow-400' : 'text-muted-foreground/40'} />
                                                                                                 ))}
                                                                                             </div>
                                                                                         </div>
                                                                                         <p className="text-sm text-muted-foreground mb-2">{review.comment || 'No comment provided.'}</p>
                                                                                         <div className="text-xs text-muted-foreground">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</div>
                                                                                     </div>
                                                                                 ))}
                                                                             </div>
                                                                         )}
                                                                     </CardContent>
                                                                 </Card>
                            </TabsContent>

                            {isOwnProfile && (
                                <TabsContent value="settings">
                                    <Card className="glass-card border-border/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle>Edit Profile Information</CardTitle>
                                            <CardDescription>Update your personal details visible to others</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label>First Name</Label>
                                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background/50 border-border/50 h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Last Name</Label>
                                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background/50 border-border/50 h-12" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Bio</Label>
                                                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="bg-background/50 border-border/50 min-h-[150px] resize-none p-4 leading-relaxed" placeholder="Tell the world about yourself..." />
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <Button onClick={handleUpdateProfile} disabled={isUpdating} className="shadow-glow h-12 px-8 rounded-xl bg-primary hover:bg-primary/90">
                                                    {isUpdating ? 'Saving Changes...' : 'Save Profile'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    </AnimatedPage>
  );
};

export default Profile;
