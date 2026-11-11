import React, { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string; phone: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess({
      name: name || (isSignUp ? 'New Member' : 'David Miller'),
      email: email || 'david.miller@cineva.com',
      phone: phone || '+44 7700 900123',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSignUp ? 'Join CINEVA Club' : 'Sign In to Your Account'}
      subtitle="Member Access"
      maxWidth="md"
    >
      <div className="flex flex-col gap-5">
        <p className="text-xs text-cv-secondary -mt-2">
          {isSignUp
            ? 'Unlock 3D seat reservation, priority 10-minute locks & exclusive 70mm screenings.'
            : 'Access your saved digital passes and booking history.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Miller"
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@cineva.com"
          />

          {isSignUp && (
            <Input
              label="Mobile Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7700 900123"
            />
          )}

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
          >
            {isSignUp ? 'Create CINEVA Account' : 'Sign In'}
          </Button>
        </form>

        <div className="flex items-center justify-between text-xs text-cv-muted pt-3 border-t border-cv-border">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:text-cv-primary transition-colors"
          >
            {isSignUp ? 'Already a member? Sign In' : 'Need an account? Join Now'}
          </button>
          <a href="#" className="hover:text-cv-accent transition-colors">
            Forgot Password?
          </a>
        </div>
      </div>
    </Modal>
  );
};
