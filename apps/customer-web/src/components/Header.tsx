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
  theme = 'light',
  onToggleTheme,
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
    <header className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl border-b border-cv-border bg-[var(--cv-header-bg)] transition-colors duration-200">
      <div className="h-20 max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          onClick={() => onNavigate('home')}
        >
          <div className="w-9 h-9 rounded-xl bg-cv-elevated dark:bg-[#181818] border border-cv-border group-hover:border-cv-accent/50 flex items-center justify-center transition-all shadow-sm">
            <span className="material-symbols-outlined text-cv-accent text-[20px]">theaters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight uppercase text-cv-primary group-hover:text-cv-accent transition-colors">
              CINEVA
            </span>
            {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-cv-accent" />}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-cv-elevated/90 dark:bg-[#111111] border border-cv-border dark:shadow-inner">
          {navItems.map((tab) => {
            const isActive = tab.activeTabs ? tab.activeTabs.includes(currentTab) : currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`text-xs font-medium tracking-wide transition-all px-4 py-2 rounded-full ${
                  isActive
                    ? 'bg-cv-surface dark:bg-[#181818] text-cv-primary dark:text-white font-semibold shadow-sm border border-cv-border dark:border-[#222222]'
                    : 'text-cv-secondary dark:text-[#A0A0A0] hover:text-cv-primary dark:hover:text-white hover:bg-cv-primary/[0.04] dark:hover:bg-white/[0.04]'
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
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full transition-colors text-xs font-medium bg-cv-elevated dark:bg-[#111111] hover:bg-cv-elevated-hover dark:hover:bg-[#181818] text-cv-primary dark:text-[#A0A0A0] hover:text-cv-primary dark:hover:text-white border border-cv-border"
            >
              <span className="material-symbols-outlined text-cv-accent text-[16px]">location_on</span>
              <span>{selectedCity}</span>
              <span className="material-symbols-outlined text-cv-muted text-[16px]">expand_more</span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-elevated-xl p-1.5 z-50 border border-cv-border bg-cv-surface text-cv-primary animate-fade-in">
                {AVAILABLE_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors flex items-center justify-between hover:bg-cv-elevated ${
                      selectedCity === city ? 'text-cv-accent font-semibold bg-cv-elevated/60' : 'text-cv-secondary'
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

          {/* Light / Dark Theme Toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Light Mode'}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-cv-elevated dark:bg-[#111111] hover:bg-cv-elevated-hover dark:hover:bg-[#181818] border border-cv-border text-xs font-medium text-cv-primary dark:text-[#A0A0A0] hover:dark:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-cv-accent text-[16px]">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
              <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          )}

          {/* Search Trigger */}
          <button
            aria-label="Search films or screenings"
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-cv-elevated dark:bg-[#111111] hover:bg-cv-elevated-hover dark:hover:bg-[#181818] text-cv-secondary dark:text-[#A0A0A0] hover:text-cv-primary dark:hover:text-white border border-cv-border"
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
            className="flex items-center gap-2 p-1 pl-2.5 pr-1 rounded-full bg-cv-elevated dark:bg-[#111111] hover:bg-cv-elevated-hover dark:hover:bg-[#181818] border border-cv-border hover:border-cv-accent/40 dark:hover:border-white/20 transition-all text-xs font-medium text-cv-primary dark:text-white"
            title={currentUser ? currentUser.name : 'Sign In'}
          >
            <span className="hidden sm:inline text-xs text-cv-secondary dark:text-[#A0A0A0]">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
            <div className="w-7 h-7 rounded-full bg-cv-accent text-white dark:bg-[#FF6500]/15 dark:text-[#FF6500] dark:border dark:border-[#FF6500]/30 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
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
