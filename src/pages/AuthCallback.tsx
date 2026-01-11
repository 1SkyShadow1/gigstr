import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));

      const code = params.get('code');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      // Handle token-style callbacks (magic link / email OTP) in addition to code flow (OAuth)
      const accessToken = params.get('access_token') || hashParams.get('access_token');
      const refreshToken = params.get('refresh_token') || hashParams.get('refresh_token');
      const redirectTo = params.get('next') || params.get('redirect_to') || '/dashboard';

      if (error) {
        toast({
          title: 'Sign-in failed',
          description: errorDescription || error,
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
        return;
      }

      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
        } else {
          throw new Error('Missing authorization token.');
        }

        navigate(redirectTo, { replace: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unable to complete sign-in. Please try again.';
        toast({
          title: 'Sign-in failed',
          description: message,
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
      }
    };

    run();
  }, [location.search, location.hash, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">Finishing sign-in…</p>
        <p className="text-sm text-gray-400">Please wait while we secure your session.</p>
      </div>
    </div>
  );
};

export default AuthCallback;