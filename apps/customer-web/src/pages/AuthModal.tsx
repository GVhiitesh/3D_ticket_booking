import React, { useState } from 'react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#aa8a7d] hover:text-white text-lg"
        >
          &times;
        </button>

        <div className="flex flex-col gap-1 text-center">
          <span className="text-[10px] text-[#ff6500] uppercase font-bold tracking-widest font-['Geist']">
            CINEVA Member Access
          </span>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
            {isSignUp ? 'Join CINEVA Club' : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs text-[#e3bfb1] font-['Geist']">
            {isSignUp
              ? 'Access 3D seat reservation, seamless checkout & exclusive screenings.'
              : 'Welcome back. Access your digital tickets and reservations.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-['Geist'] text-xs">
          {isSignUp && (
            <div>
              <label className="block text-[#e3bfb1] mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="David Miller"
                className="w-full bg-[#1c1b1b] text-white px-4 py-3 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[#e3bfb1] mb-1 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@cineva.com"
              className="w-full bg-[#1c1b1b] text-white px-4 py-3 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[#e3bfb1] mb-1 font-medium">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900123"
                className="w-full bg-[#1c1b1b] text-white px-4 py-3 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[#e3bfb1] mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full bg-[#1c1b1b] text-white px-4 py-3 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#ff6500] to-[#b74600] text-white font-bold uppercase tracking-wider text-xs transition-all shadow-[0_8px_20px_rgba(255,101,0,0.4)] hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            {isSignUp ? 'Create CINEVA Account' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] font-['Geist'] text-[#aa8a7d] pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="hover:text-white transition-colors"
          >
            {isSignUp ? 'Already a member? Sign In' : 'Need an account? Join Now'}
          </button>
          <a href="#" className="hover:text-[#ff6500] transition-colors">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};
