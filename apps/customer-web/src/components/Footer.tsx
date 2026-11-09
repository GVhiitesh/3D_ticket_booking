import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0e0e0e] border-t border-[#1c1b1b] py-12">
      <div className="w-full px-5 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-['Space_Grotesk'] text-xl font-bold tracking-wider text-white uppercase">
            CINEVA
          </span>
          <span className="hidden md:inline text-[#5a4136]">|</span>
          <span className="font-['Geist'] text-xs text-[#e3bfb1]">
            The Ultimate 70mm &amp; 3D Cinema Experience
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          <button
            onClick={() => onNavigate('movies')}
            className="font-['Geist'] text-xs text-[#e3bfb1] hover:text-white transition-colors"
          >
            Movies
          </button>
          <button
            onClick={() => onNavigate('cinemas')}
            className="font-['Geist'] text-xs text-[#e3bfb1] hover:text-white transition-colors"
          >
            Cinemas
          </button>
          <button
            onClick={() => onNavigate('my-bookings')}
            className="font-['Geist'] text-xs text-[#e3bfb1] hover:text-white transition-colors"
          >
            My Bookings
          </button>
          <a href="#" className="font-['Geist'] text-xs text-[#e3bfb1] hover:text-white transition-colors">
            Terms &amp; Conditions
          </a>
          <a href="#" className="font-['Geist'] text-xs text-[#e3bfb1] hover:text-white transition-colors">
            Privacy Policy
          </a>
        </nav>

        <div className="font-['Geist'] text-[10px] text-[#aa8a7d] tracking-widest uppercase">
          &copy; 2026 CINEVA ENTERTAINMENT LTD. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
