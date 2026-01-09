import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, User, Code, Briefcase, Rocket, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedPage from '@/components/AnimatedPage';

const steps = [
  { id: 1, title: 'Role', icon: User, description: 'How do you plan to use Gigstr?' },
  { id: 2, title: 'Skills', icon: Code, description: 'What are your superpowers?' },
  { id: 3, title: 'Bio', icon: Briefcase, description: 'Tell us about yourself.' },
];

const ROLES = [
  { id: 'freelancer', title: 'Freelancer', description: 'I want to find gigs and work on projects.', icon: Rocket },
  { id: 'client', title: 'Client', description: 'I want to hire talent and manage projects.', icon: Briefcase },
  { id: 'both', title: 'Both', description: 'I want to do both!', icon: Sparkles },
];

const POPULAR_SKILLS = [
  // Trades (Crucial for SA market)
  "Electrician", "Plumber", "Carpenter", "Welder", "Painter", "Tiler", "Bricklayer", "Landscaper", "Handyman", "Locksmith",
  
  // Domestic & Care
  "Domestic Worker", "Cleaner", "Nanny", "Caregiver", "Gardener", "Housekeeper", "Cook", "Driver",
  
  // Education & Tutoring
  "Math Tutor", "English Tutor", "Science Tutor", "Music Teacher", "Coding Tutor", "Language Tutor",
  
  // Tech & Digital
  "Web Developer", "Graphic Designer", "Social Media Manager", "Data Entry", "Virtual Assistant", "Video Editor",
  
  // Events & Hospitality
  "Event Planner", "Server/Waiter", "Bartender", "Catering", "DJ", "Photographer", "Makeup Artist",
  
  // Professional Services
  "Accountant", "Legal Assistant", "Translator", "Writer", "HR Consultant", "Project Manager"
];

const Onboarding = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    skills: [] as string[],
    bio: '',
    portfolio_url: '',
    linkedin_url: ''
  });

  const [customSkill, setCustomSkill] = useState('');

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      }
      if (prev.skills.length >= 10) {
        toast({ title: "Max skills reached", description: "You can select up to 10 skills.", variant: "destructive" });
        return prev;
      }
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const addCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkill.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(customSkill.trim())) {
           if (formData.skills.length >= 10) {
                toast({ title: "Max skills reached", description: "You can select up to 10 skills.", variant: "destructive" });
                return;
           }
           setFormData(prev => ({ ...prev, skills: [...prev.skills, customSkill.trim()] }));
      }
      setCustomSkill('');
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: formData.role,
          skills: formData.skills, // Assuming array or JSONB in DB. If text, join it.
          // Fallback if 'skills' column is text: skills: formData.skills.join(','),
          bio: formData.bio,
          portfolio_url: formData.portfolio_url,
          linkedin_url: formData.linkedin_url,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome aboard!",
        description: "Your profile has been set up successfully.",
      });
      // Force a hard reload to ensure AuthContext picks up the new profile state
      window.location.href = '/'; 
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive"
      });
      // Fallback for demo if column doesn't exist
      window.location.href = '/'; 
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-8 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-0"></div>
        {steps.map((s) => {
            const isActive = s.id === currentStep;
            const isCompleted = s.id < currentStep;
            return (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive ? 'bg-primary border-primary text-black shadow-glow' : 
                            isCompleted ? 'bg-primary/20 border-primary text-primary' : 
                            'bg-black border-white/10 text-muted-foreground'
                        }`}
                    >
                        {isCompleted ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                        {s.title}
                    </span>
                </div>
            )
        })}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-foreground flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"/>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"/>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl relative z-10"
        >
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40">
                    Welcome to Gigstr
                </h1>
                <p className="text-muted-foreground">Let's set up your profile to get you started.</p>
            </div>

            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
                <CardHeader>
                   <StepIndicator /> 
                </CardHeader>
                <CardContent className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {/* Step 1: Role */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold mb-6 text-center">What brings you here?</h2>
                                    <div className="grid gap-4">
                                        {ROLES.map((role) => {
                                            const Icon = role.icon;
                                            const isSelected = formData.role === role.id;
                                            return (
                                                <div
                                                    key={role.id}
                                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group ${
                                                        isSelected 
                                                        ? 'bg-primary/20 border-primary shadow-glow-sm' 
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className={`p-3 rounded-full ${isSelected ? 'bg-primary text-black' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-lg font-medium ${isSelected ? 'text-primary' : 'text-white'}`}>{role.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{role.description}</p>
                                                    </div>
                                                    {isSelected && <Check className="w-6 h-6 text-primary ml-auto" />}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Skills */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-semibold">What are your skills?</h2>
                                        <p className="text-muted-foreground text-sm mt-1">Select up to 10 skills that describe you best.</p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {POPULAR_SKILLS.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className={`cursor-pointer px-4 py-2 text-sm transition-all hover:border-primary/50 ${
                                                    formData.skills.includes(skill) 
                                                    ? 'bg-primary text-black border-primary hover:bg-primary/90' 
                                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                }`}
                                                onClick={() => toggleSkill(skill)}
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Add other skills</Label>
                                        <Input 
                                            placeholder="Type a skill and press Enter..." 
                                            value={customSkill}
                                            onChange={(e) => setCustomSkill(e.target.value)}
                                            onKeyDown={addCustomSkill}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>

                                    {formData.skills.length > 0 && (
                                        <div className="pt-4 border-t border-white/10">
                                            <Label className="mb-2 block text-xs uppercase text-muted-foreground">Selected Skills</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map(skill => (
                                                    <Badge key={skill} className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 gap-1 pl-3 pr-1 py-1">
                                                        {skill}
                                                        <span onClick={(e) => { e.stopPropagation(); toggleSkill(skill); }} className="hover:bg-black/20 rounded-full p-0.5 cursor-pointer"><X className="w-3 h-3" /></span>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Bio */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-semibold">Final Touches</h2>
                                        <p className="text-muted-foreground text-sm mt-1">Let others know who you are.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Bio</Label>
                                            <Textarea 
                                                placeholder="I am a passionate developer..." 
                                                className="min-h-[120px] bg-white/5 border-white/10 text-white resize-none focus:border-primary/50"
                                                value={formData.bio}
                                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Portfolio URL</Label>
                                                <Input 
                                                    placeholder="https://" 
                                                    className="bg-white/5 border-white/10"
                                                    value={formData.portfolio_url}
                                                    onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>LinkedIn URL</Label>
                                                <Input 
                                                    placeholder="https://linkedin.com/in/..." 
                                                    className="bg-white/5 border-white/10"
                                                    value={formData.linkedin_url}
                                                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-white/10 p-6 bg-black/20">
                    <Button 
                        variant="ghost" 
                        onClick={handleBack} 
                        disabled={currentStep === 1 || loading}
                        className="hover:bg-white/10 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button 
                        onClick={handleNext} 
                        disabled={(currentStep === 1 && !formData.role) || loading}
                        className="bg-primary text-black hover:bg-primary/90 shadow-glow-sm"
                    >
                        {loading ? 'Saving...' : currentStep === 3 ? 'Complete Setup' : 'Continue'} 
                        {!loading && currentStep !== 3 && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    </div>
  );
};

export default Onboarding;
