import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const STORAGE_KEY = 'pwa-install-dismissed';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const installReady = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCtaVisible(true);
      const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
      if (!dismissed) setOpen(true);
    };

    const installed = () => {
      setCtaVisible(false);
      setOpen(false);
      localStorage.removeItem(STORAGE_KEY);
    };

    const alreadyInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (alreadyInstalled) return;

    window.addEventListener('beforeinstallprompt', installReady);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', installReady);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setOpen(false);
    setCtaVisible(false);
    if (choice.outcome === 'dismissed') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Install Gigstr</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Add Gigstr to your home screen for faster access and an app-like experience.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={dismiss}>Not now</Button>
            <Button onClick={triggerInstall} disabled={!deferredPrompt}>Install</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {ctaVisible && !open && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Button size="sm" className="bg-primary text-black hover:bg-primary/90" onClick={() => setOpen(true)}>
            Download app
          </Button>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
