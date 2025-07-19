
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  reauthenticatedAt: Date | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  changeEmail: (newEmail: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  reauthenticate: (password: string) => Promise<boolean>;
  isReauthenticationRequired: () => boolean;
  clearReauthentication: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reauthenticatedAt, setReauthenticatedAt] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user && event !== 'SIGNED_OUT') {
          // Fetch user profile using setTimeout to avoid potential deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in profile fetch:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You've been signed in",
      });
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      setReauthenticatedAt(null);
      if (error && !error.message.includes('auth session missing')) throw error;
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changeEmail = async (newEmail: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First verify the current password
      if (!user?.email) throw new Error('No current user found');
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Now update the email
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email change initiated",
        description: "Please check both your old and new email addresses to confirm the change",
      });
    } catch (error: any) {
      toast({
        title: "Error changing email",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?tab=reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password",
      });
    } catch (error: any) {
      toast({
        title: "Error sending reset email",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      
      // First verify the current password
      if (!user?.email) throw new Error('No current user found');
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Now update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reauthenticate = async (password: string): Promise<boolean> => {
    try {
      if (!user?.email) throw new Error('No current user found');
      
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });
      
      if (error) throw error;
      
      setReauthenticatedAt(new Date());
      return true;
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: "The password you entered is incorrect",
        variant: "destructive",
      });
      return false;
    }
  };

  const isReauthenticationRequired = (): boolean => {
    if (!reauthenticatedAt) return true;
    
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    return reauthenticatedAt < tenMinutesAgo;
  };

  const clearReauthentication = () => {
    setReauthenticatedAt(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        reauthenticatedAt,
        signIn,
        signUp,
        signOut,
        changeEmail,
        resetPassword,
        updatePassword,
        reauthenticate,
        isReauthenticationRequired,
        clearReauthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
