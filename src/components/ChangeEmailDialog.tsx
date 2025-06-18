
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface ChangeEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeEmailDialog: React.FC<ChangeEmailDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const { user, changeEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !password.trim()) return;

    setIsChanging(true);
    try {
      await changeEmail(newEmail, password);
      handleClose();
    } catch (error) {
      // Error is handled in the changeEmail function
    }
    setIsChanging(false);
  };

  const handleClose = () => {
    setNewEmail('');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <DialogTitle>Change Email Address</DialogTitle>
          </div>
          <DialogDescription>
            Change your email address. You'll need to verify both your old and new email addresses.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentEmail">Current Email</Label>
            <Input
              id="currentEmail"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              disabled={isChanging}
              autoFocus
            />
          </div>
          
          <div>
            <Label htmlFor="password">Current Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your current password"
              disabled={isChanging}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isChanging}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newEmail.trim() || !password.trim() || isChanging}>
              {isChanging ? "Changing..." : "Change Email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
