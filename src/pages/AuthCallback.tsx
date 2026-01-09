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
      const code = params.get('code');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error) {
        toast({
          title: 'Sign-in failed',
          description: errorDescription || error,
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
        return;
      }

      if (!code) {
        toast({
          title: 'Missing authorization code',
          description: 'Unable to complete sign-in. Please try again.',
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        toast({
          title: 'Sign-in failed',
          description: exchangeError.message,
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
        return;
      }

      navigate('/dashboard', { replace: true });
    };

    run();
  }, [location.search, navigate, toast]);

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