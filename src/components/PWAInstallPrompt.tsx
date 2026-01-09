import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const STORAGE_KEY = 'pwa-install-dismissed';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
      if (!dismissed) setOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setOpen(false);
    if (choice.outcome === 'dismissed') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
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
          <Button onClick={triggerInstall}>Install</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallPrompt;
