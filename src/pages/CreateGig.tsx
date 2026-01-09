import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, Plus, X, AlignLeft, Briefcase, MapPin, Calendar, DollarSign, Tag, Globe, Sparkles } from 'lucide-react';
import Loader from '@/components/ui/loader';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';

const categories = [
  "Plumbing", "Electrical", "Domestic Work", "Gardening", "Cleaning", 
  "Childcare", "Transportation", "Repairs", "Painting", "Construction", 
  "Security", "IT Support", "Teaching", "Cooking", "Other"
];

const CreateGig = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('EFT');
  
  // Enhanced form fields
  const [timeline, setTimeline] = useState({
    startDate: '',
    expectedDuration: '',
    milestones: []
  });
  const [budget, setBudget] = useState({
    type: 'fixed',
    amount: '',
    paymentSchedule: 'completion'
  });
  const [locationDetails, setLocationDetails] = useState({
    type: 'remote',
    city: '',
    country: 'South Africa'
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [communicationPrefs, setCommunicationPrefs] = useState({
    method: 'platform',
    availability: 'flexible'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post a gig",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !budget.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const gigData = {
        title,
        description,
        category,
        price: parseFloat(budget.amount),
        location: locationDetails.type === 'remote' ? 'Remote' : `${locationDetails.city}, ${locationDetails.country}`,
        client_id: user?.id,
        status: 'open',
        // Additional fields would be mapped to JSONB or specific columns if they exist
      };
      
      const { data, error } = await supabase
        .from('gigs')
        .insert(gigData)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({ title: "Gig posted!", description: "Your gig is now live." });
      navigate(`/gigs/${data.id}`);
    } catch (error: any) {
        console.error(error); 
        toast({ title: "Error", description: error.message, variant: "destructive", });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <AnimatedPage>
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-8 text-center">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30 mb-4"
                >
                    <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
                <h1 className="text-4xl font-bold font-heading mb-2">Create a Gig</h1>
                <p className="text-muted-foreground">Hire the best talent for your project.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl"
                    >
                         <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><AlignLeft className="w-4 h-4 text-primary" /> Title</Label>
                                <Input 
                                    placeholder="e.g. Need a plumber for leaky faucet" 
                                    className="bg-white/5 border-white/10 text-lg h-12"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-white/5 border-white/10 h-12">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea 
                                    placeholder="Describe your project in detail..." 
                                    className="bg-white/5 border-white/10 min-h-[150px] resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                         </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                         className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6"
                    >
                        <h3 className="text-lg font-semibold flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-400" /> Budget & Timeline</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label>Budget (ZAR)</Label>
                                <div className="relative">
                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                    <Input 
                                        type="number" 
                                        placeholder="5000" 
                                        className="pl-8 bg-white/5 border-white/10 h-12"
                                        value={budget.amount}
                                        onChange={(e) => setBudget({...budget, amount: e.target.value})}
                                    />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input 
                                    type="date" 
                                    className="bg-white/5 border-white/10 h-12"
                                    value={timeline.startDate}
                                    onChange={(e) => setTimeline({...timeline, startDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                         className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6"
                    >
                         <h3 className="text-lg font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" /> Location</h3>
                         
                         <div className="grid grid-cols-2 gap-4 mb-4">
                             <Button 
                                type="button" 
                                variant={locationDetails.type === 'remote' ? 'default' : 'outline'}
                                className={locationDetails.type === 'remote' ? 'border-primary' : 'border-white/10 bg-transparent'}
                                onClick={() => setLocationDetails({...locationDetails, type: 'remote'})}
                            >
                                <Globe className="w-4 h-4 mr-2" /> Remote
                             </Button>
                             <Button 
                                type="button" 
                                variant={locationDetails.type === 'onsite' ? 'default' : 'outline'}
                                className={locationDetails.type === 'onsite' ? 'border-primary' : 'border-white/10 bg-transparent'}
                                onClick={() => setLocationDetails({...locationDetails, type: 'onsite'})}
                            >
                                <MapPin className="w-4 h-4 mr-2" /> On-Site
                             </Button>
                         </div>

                         {locationDetails.type === 'onsite' && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input 
                                        placeholder="Cape Town" 
                                        className="bg-white/5 border-white/10"
                                        value={locationDetails.city}
                                        onChange={(e) => setLocationDetails({...locationDetails, city: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                     <Label>Country</Label>
                                    <Input 
                                        placeholder="South Africa" 
                                        className="bg-white/5 border-white/10"
                                        value={locationDetails.country}
                                        onChange={(e) => setLocationDetails({...locationDetails, country: e.target.value})}
                                    />
                                </div>
                            </div>
                         )}
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="sticky top-24"
                    >
                        <Card className="bg-black/60 backdrop-blur-xl border-white/10 overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-primary to-purple-400" />
                            <CardHeader>
                                <CardTitle>Pro Tips</CardTitle>
                                <CardDescription>How to get the best results</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <p>✨ <strong className="text-white">Be Specific:</strong> Detailed descriptions attract better candidates.</p>
                                <p>💰 <strong className="text-white">Fair Budget:</strong> Realistic budgets get faster responses.</p>
                                <p>🏷️ <strong className="text-white">Tags:</strong> Add relevant tags to help people find your gig.</p>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full shadow-glow" 
                                    size="lg" 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Gig'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    </AnimatedPage>
  );
};

export default CreateGig;
