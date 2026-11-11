import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_CITIES } from '../utils/currency';

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
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies', activeTabs: ['movies', 'movie-details'] },
    { id: 'cinemas', label: 'Cinemas' },
    { id: 'my-bookings', label: 'My Bookings' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl border-b border-[#222222] bg-[#050505]/90 transition-colors duration-200">
      <div className="h-20 max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => onNavigate('home')}
        >
          <div className="w-9 h-9 rounded-xl bg-[#181818] border border-[#222222] group-hover:border-[#FF6500]/50 flex items-center justify-center transition-all shadow-sm">
            <span className="material-symbols-outlined text-[#FF6500] text-[20px]">theaters</span>
          </div>
          <span className="text-xl font-bold tracking-tight uppercase text-white group-hover:text-[#FF6500] transition-colors">
            CINEVA
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#111111] border border-[#222222] shadow-inner">
          {navItems.map((tab) => {
            const isActive = tab.activeTabs ? tab.activeTabs.includes(currentTab) : currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`text-xs font-medium tracking-wide transition-all px-4 py-2 rounded-full ${
                  isActive
                    ? 'bg-[#181818] text-white font-semibold shadow-sm border border-[#222222]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* City / Location Dropdown */}
          <div className="relative" ref={cityDropdownRef}>
            <button
              type="button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full transition-colors text-xs font-medium bg-[#111111] hover:bg-[#181818] text-[#FFFFFF] border border-[#222222]"
            >
              <span className="material-symbols-outlined text-[#FF6500] text-[16px]">location_on</span>
              <span>{selectedCity}</span>
              <span className="material-symbols-outlined text-[#707070] text-[16px]">expand_more</span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] p-1.5 z-50 border border-[#222222] bg-[#111111] text-white animate-fade-in">
                {AVAILABLE_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors flex items-center justify-between hover:bg-[#181818] ${
                      selectedCity === city ? 'text-[#FF6500] font-semibold' : 'text-[#A0A0A0]'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            aria-label="Search films or screenings"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-[#111111] hover:bg-[#181818] text-[#A0A0A0] hover:text-white border border-[#222222]"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
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
            className="flex items-center gap-2 p-1 pl-2.5 pr-1 rounded-full bg-[#111111] border border-[#222222] hover:border-white/20 transition-all text-xs font-medium text-white"
            title={currentUser ? currentUser.name : 'Sign In'}
          >
            <span className="hidden sm:inline text-xs text-[#A0A0A0]">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
            <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#222222] text-[#FF6500] flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {currentUser ? (
                currentUser.name.charAt(0)
              ) : (
                <span className="material-symbols-outlined text-[16px]">person</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
