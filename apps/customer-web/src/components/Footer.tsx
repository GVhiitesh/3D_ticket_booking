import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#050505] border-t border-[#222222] py-14 mt-auto">
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6500]" />
            <span className="text-lg font-bold tracking-tight text-white uppercase">
              CINEVA
            </span>
          </div>
          <span className="hidden sm:inline text-[#222222]">|</span>
          <span className="text-xs text-[#707070]">
            The 70mm &amp; 3D Theatrical SaaS Platform
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A0A0A0]">
          <button
            onClick={() => onNavigate('movies')}
            className="hover:text-white transition-colors"
          >
            Movies
          </button>
          <button
            onClick={() => onNavigate('cinemas')}
            className="hover:text-white transition-colors"
          >
            Cinemas
          </button>
          <button
            onClick={() => onNavigate('my-bookings')}
            className="hover:text-white transition-colors"
          >
            My Bookings
          </button>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </nav>

        <div className="text-[11px] text-[#707070] tracking-wider uppercase">
          &copy; {new Date().getFullYear()} CINEVA LABS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
