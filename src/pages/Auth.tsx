import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Chrome, Linkedin, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const magicLinkSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  accountType: z.enum(['client', 'pro', 'both']).optional().default('pro'),
  skills: z.string().max(200).optional(),
  location: z.string().max(120).optional(),
  experience: z.enum(['junior', 'mid', 'senior']).optional(),
});

const Auth = () => {
  const { signIn, signUp, signInWithProvider, signInWithMagicLink, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const magicLinkForm = useForm<z.infer<typeof magicLinkSchema>>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      accountType: 'pro',
      skills: '',
      location: '',
      experience: undefined,
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleMagicLink = async (values: z.infer<typeof magicLinkSchema>) => {
    try {
      await signInWithMagicLink(values.email);
    } catch (error) {
      console.error("Magic Link error:", error);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      const userData = {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
        account_type: values.accountType || 'pro',
        skills: skillsList,
        location: values.location,
        experience_level: values.experience,
        onboarding_completed: false,
      };
      await signUp(values.email, values.password, userData);
      // Don't auto-redirect, wait for auth state change or instruct user to check email
      setActiveTab("login");
      setSkillsList([]);
      setSkillInput("");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  // Redirect if user is already logged in
  if (user) {
    if (user.role === 'pending' || !user.user_metadata?.onboarding_completed) {
         return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black selection:bg-primary/30 text-foreground">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[96px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-500/20 border border-white/10 shadow-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Gigstr</h2>
          <p className="text-muted-foreground">The future of work is here.</p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/5 border border-white/5">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="magic-link" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Magic Link</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0 focus-visible:ring-0">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base shadow-glow-sm hover:shadow-glow transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="magic-link" className="mt-0 focus-visible:ring-0">
              <Form {...magicLinkForm}>
                <form onSubmit={magicLinkForm.handleSubmit(handleMagicLink)} className="space-y-5">
                  <div className="text-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">We'll send you a magic link to sign in instantly.</p>
                  </div>
                  <FormField
                    control={magicLinkForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base shadow-glow-sm hover:shadow-glow transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending Link..." : "Send Magic Link"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0 focus-visible:ring-0">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={signupForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={signupForm.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Account Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 text-white">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pro">Provider</SelectItem>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Experience</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 text-white">
                              <SelectValue placeholder="Pick level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="junior">Junior</SelectItem>
                              <SelectItem value="mid">Mid</SelectItem>
                              <SelectItem value="senior">Senior</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={signupForm.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Top skills (press Enter to add)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {skillsList.map((skill) => (
                                <Badge key={skill} variant="secondary" className="flex items-center gap-1 bg-white/10 text-white border-white/20">
                                  {skill}
                                  <button
                                    type="button"
                                    aria-label={`Remove ${skill}`}
                                    className="inline-flex items-center justify-center rounded-full hover:bg-white/10"
                                    onClick={() => {
                                      const next = skillsList.filter(s => s !== skill);
                                      setSkillsList(next);
                                      signupForm.setValue('skills', next.join(', '));
                                    }}
                                  >
                                    <X size={14} />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <Input
                              placeholder="Domestic work, Plumbing, Tutoring"
                              value={skillInput}
                              className="bg-white/5 border-white/10 focus:border-primary/50 text-white"
                              onChange={(e) => {
                                setSkillInput(e.target.value);
                                field.onChange(e);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault();
                                  const value = skillInput.trim();
                                  if (!value) return;
                                  if (skillsList.includes(value)) {
                                    setSkillInput("");
                                    return;
                                  }
                                  const next = [...skillsList, value];
                                  setSkillsList(next);
                                  signupForm.setValue('skills', next.join(', '));
                                  setSkillInput("");
                                }
                              }}
                              onBlur={() => {
                                const value = skillInput.trim();
                                if (!value) return;
                                if (skillsList.includes(value)) {
                                  setSkillInput("");
                                  return;
                                }
                                const next = [...skillsList, value];
                                setSkillsList(next);
                                signupForm.setValue('skills', next.join(', '));
                                setSkillInput("");
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">City / Region (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Johannesburg, Gauteng" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base shadow-glow-sm hover:shadow-glow transition-all duration-300" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-muted-foreground backdrop-blur-xl">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" onClick={() => signInWithProvider('google')} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white" disabled={isLoading}>
                <Chrome className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline" onClick={() => signInWithProvider('linkedin_oidc')} className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white" disabled={isLoading}>
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>
          </div>
        </div>
        
        <ForgotPasswordModal open={showForgotPassword} onOpenChange={setShowForgotPassword} />
      </motion.div>
    </div>
  );
};

export default Auth;
