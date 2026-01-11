import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, Lock, RefreshCw } from 'lucide-react';

const parseHashParams = () => new URLSearchParams(window.location.hash.replace(/^#/, ''));

const ResetPassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'ready' | 'submitting' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const backgroundShape = useMemo(() => Math.random() > 0.5, []);

  useEffect(() => {
    const verifyRecoverySession = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = parseHashParams();
      const code = searchParams.get('code') || hashParams.get('code');
      const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');

      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (accessToken && refreshToken) {
          const { error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setError) throw setError;
        } else {
          throw new Error('Missing recovery token. Please use the reset link sent to your email.');
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUserEmail(userData.user?.email ?? null);
        setStatus('ready');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unable to validate your reset link.';
        setError(message);
        setStatus('error');
      }
    };

    verifyRecoverySession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError(null);
    setStatus('submitting');

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setStatus('success');
      setTimeout(() => navigate('/auth'), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong while updating your password.';
      setError(message);
      setStatus('ready');
    }
  };

  const headline = {
    verifying: 'Verifying your link...',
    ready: 'Set a new password',
    submitting: 'Updating your password...',
    success: 'Password reset!',
    error: 'Link issue',
  }[status];

  return (
    <div className="min-h-screen bg-[#040507] text-white flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-blue-500/20 rounded-full blur-[140px]" />
        <div className={`absolute ${backgroundShape ? 'top-10 right-10' : 'top-16 left-1/3'} w-52 h-52 bg-emerald-500/10 rounded-[32px] rotate-6 blur-[120px]`} />
      </div>

      <Card className="w-full max-w-lg bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium w-fit">
            <Lock className="w-4 h-4" /> Secure reset
          </div>
          <CardTitle className="text-3xl font-semibold text-white">{headline}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {status === 'verifying' && 'Hang tight while we confirm your reset link.'}
            {status === 'ready' && (userEmail ? `Resetting password for ${userEmail}` : 'Choose a strong, unique password.')}
            {status === 'submitting' && 'Applying your new credentials securely.'}
            {status === 'success' && 'Your password was updated. Redirecting you to sign in...'}
            {status === 'error' && (error || 'This reset link is no longer valid. Request a new one from the sign in screen.')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === 'verifying' && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Checking your session...</span>
            </div>
          )}

          {(status === 'ready' || status === 'submitting') && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === 'submitting'}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-sm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={status === 'submitting'}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Saving...' : 'Reset password'}
              </Button>
            </form>
          )}

          {status === 'success' && (
            <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-white">Your password has been updated.</p>
                <p className="text-sm text-muted-foreground">You will be redirected shortly. If not, tap below.</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => navigate('/auth')} variant="secondary">Back to sign in</Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-red-400">{error}</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate('/auth')}>
                  Request a new link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
