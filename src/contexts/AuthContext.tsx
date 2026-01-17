import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type OAuthProvider = Provider | 'linkedin_oidc';

type Profile = Database['public']['Tables']['profiles']['Row'];

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  reauthenticatedAt: Date | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Record<string, unknown>) => Promise<void>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reauthenticatedAt, setReauthenticatedAt] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleExpiredSession = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during sign-out after session expiry', error);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      toast({
        title: 'Session expired',
        description: 'Please sign in again to continue.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchUserProfile = React.useCallback(async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Only create a starter profile when we are certain the row is missing.
      // Supabase returns status 406 / code PGRST116 when .single() finds 0 rows.
      const isMissingProfile = (!!error && (status === 406 || error.code === 'PGRST116')) || (!error && !data);

      if (isMissingProfile) {
        const metadata = user?.user_metadata || {};
        const starterProfile = {
          id: userId,
          first_name: typeof metadata.first_name === 'string' ? metadata.first_name : null,
          last_name: typeof metadata.last_name === 'string' ? metadata.last_name : null,
          username: typeof metadata.username === 'string' ? metadata.username : null,
          role: typeof metadata.account_type === 'string' ? metadata.account_type : null,
          skills: Array.isArray(metadata.skills) ? metadata.skills.filter(Boolean) : null,
          onboarding_completed: false,
        } as Partial<Profile>;

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(starterProfile)
          .select('*')
          .single();

        if (insertError) {
          console.error('Error creating starter profile:', insertError);
          return;
        }

        setProfile(insertedProfile);
        return;
      }

      // Any other error means fetch failed (network/RLS/etc). Avoid insert loop and just log.
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // If skills are present in auth metadata but missing in profile, sync them once
      const metadataSkills = Array.isArray(user?.user_metadata?.skills)
        ? (user?.user_metadata?.skills as string[]).filter(Boolean)
        : [];

      if ((!data?.skills || data.skills.length === 0) && metadataSkills.length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ skills: metadataSkills })
          .eq('id', userId);

        if (updateError) {
          console.error('Error syncing metadata skills to profile:', updateError);
        } else {
          setProfile({ ...data, skills: metadataSkills });
          return;
        }
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in profile fetch:', error);
    }
  }, [user?.user_metadata]);

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
  }, [fetchUserProfile, handleExpiredSession]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You've been signed in",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      toast({
        title: "Error signing in",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider: OAuthProvider) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'linkedin_oidc' ? 'openid profile email' : undefined,
        },
      });
      
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      toast({
        title: "Error signing in",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to request magic link.';
      toast({
        title: "Error requesting magic link",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign up.';
      toast({
        title: "Error signing up",
        description: message,
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to sign out.';
      toast({
        title: "Error signing out",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Always redirect to landing page after logout
      window.location.href = '/';
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to change email.';
      toast({
        title: "Error changing email",
        description: message,
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
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to send reset email.';
      toast({
        title: "Error sending reset email",
        description: message,
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to update password.';
      toast({
        title: "Error updating password",
        description: message,
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
    } catch (error: unknown) {
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
        signInWithProvider,
        signInWithMagicLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
