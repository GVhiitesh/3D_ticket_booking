import React from 'react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: any) => void;
  onOpenAuth: () => void;
  currentUser?: { name: string; email: string } | null;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenSearch: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenAuth,
  currentUser,
  selectedCity,
  onSelectCity,
  onOpenSearch,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-2xl border-b border-white/10 bg-[#080b12]/90 shadow-[0_4px_30px_rgba(0,0,0,0.8)] text-white transition-colors duration-200">
      <div className="h-20 w-full px-5 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#b74600] flex items-center justify-center shadow-[0_0_20px_rgba(255,85,0,0.5)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[22px]">theaters</span>
          </div>
          <span className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight uppercase text-white group-hover:text-[#ff7a00] transition-colors">
            CINEVA
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 p-1 rounded-full bg-[#111726]/80 border border-white/10 backdrop-blur-md">
          {[
            { id: 'home', label: 'Home' },
            { id: 'movies', label: 'Movies', activeTabs: ['movies', 'movie-details'] },
            { id: 'cinemas', label: 'Cinemas' },
            { id: 'my-bookings', label: 'My Bookings' },
          ].map((tab) => {
            const isActive = tab.activeTabs ? tab.activeTabs.includes(currentTab) : currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`font-['Geist'] text-xs font-semibold tracking-wider transition-all px-4 py-2 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff5500] to-[#ff7a00] text-white shadow-[0_2px_15px_rgba(255,85,0,0.45)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Location Selector Pill */}
          <div className="relative group hidden lg:block">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-xs font-semibold tracking-wider bg-[#131926] hover:bg-[#1c2436] text-white border border-white/10"
            >
              <span className="material-symbols-outlined text-[#ff5500] text-[18px]">location_on</span>
              <span>{selectedCity}, IMAX West End</span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50 border border-white/10 bg-[#0e1320] text-white">
              {['London', 'Bengaluru', 'Mumbai', 'New York'].map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between hover:bg-[#1a2336] ${
                    selectedCity === city ? 'text-[#ff5500] font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Trigger */}
          <button
            aria-label="Search films or screenings"
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-[#131926] hover:bg-[#1c2436] text-slate-300 hover:text-white border border-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* User Account / Auth Trigger */}
          <button
            onClick={() => {
              if (currentUser) {
                onNavigate('profile');
              } else {
                onOpenAuth();
              }
            }}
            className="p-0.5 rounded-full ring-2 ring-[#ff5500]/60 hover:ring-[#ff5500] transition-all flex items-center justify-center shadow-[0_0_12px_rgba(255,85,0,0.3)]"
            title={currentUser ? currentUser.name : 'Sign In'}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff5500] to-[#b74600] flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
              {currentUser ? (
                currentUser.name.charAt(0)
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
