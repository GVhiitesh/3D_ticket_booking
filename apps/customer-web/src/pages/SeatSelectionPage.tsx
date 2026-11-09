import React, { useState, useEffect } from 'react';
import { Show, SeatNode, Movie } from '../types';
import { Auditorium3D } from '../components/Auditorium3D';
import { Auditorium2D } from '../components/Auditorium2D';

interface SeatSelectionPageProps {
  show: Show;
  movie: Movie;
  onProceedToCheckout: (selectedSeatCodes: string[], subtotal: number) => void;
  onBack: () => void;
  theme?: 'light' | 'dark';
}

const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop';

export const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({
  show,
  movie,
  onProceedToCheckout,
  onBack,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [seats, setSeats] = useState<SeatNode[]>([]);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>(['E-9', 'E-10']);
  const [is2DView, setIs2DView] = useState<boolean>(false);
  const [holdSeconds, setHoldSeconds] = useState<number>(582); // 9m 42s initially
  const [loading, setLoading] = useState<boolean>(true);
  const [holdError, setHoldError] = useState<string | null>(null);

  // Toggle state for the side checkout drawer panel
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Fetch 3D seating layout & availability from backend
  useEffect(() => {
    fetch(`/api/v1/shows/${show.id}/layout-and-seats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.seats) {
          setSeats(data.data.seats);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load layout from backend:', err);
        setLoading(false);
      });
  }, [show.id]);

  // Hold Countdown Timer (10-minute hold)
  useEffect(() => {
    if (holdSeconds <= 0) return;
    const timer = setInterval(() => {
      setHoldSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [holdSeconds]);

  const toggleSeat = (seatCode: string) => {
    setHoldError(null);
    setSelectedSeatCodes((prev) => {
      if (prev.includes(seatCode)) {
        return prev.filter((code) => code !== seatCode);
      } else {
        if (prev.length >= 10) {
          setHoldError('Maximum 10 seats allowed per booking.');
          return prev;
        }
        return [...prev, seatCode];
      }
    });
  };

  const calculateSubtotal = () => {
    return selectedSeatCodes.reduce((sum, code) => {
      const seat = seats.find((s) => s.seatCode === code);
      return sum + (seat?.price || 28.0);
    }, 0);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const subtotal = calculateSubtotal();

  const handleContinue = async () => {
    if (selectedSeatCodes.length === 0) {
      setHoldError('Please select at least one seat to proceed.');
      return;
    }

    try {
      const res = await fetch(`/api/v1/shows/${show.id}/hold-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatCodes: selectedSeatCodes,
          userId: 'user-session',
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setHoldError(data.error || 'Failed to hold seats. They may be occupied.');
        return;
      }
      onProceedToCheckout(selectedSeatCodes, subtotal);
    } catch (err) {
      console.error('Error holding seats:', err);
      // Fallback: Proceed even if backend is offline in mock mode
      onProceedToCheckout(selectedSeatCodes, subtotal);
    }
  };

  return (
    <div className="flex flex-col w-full relative h-[calc(100vh-5rem)] mt-20 overflow-hidden select-none bg-[#080b12] text-slate-100">
      {/* Subtle architectural ambient illumination */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[360px] rounded-full blur-[150px] bg-[#ff5500]/10" />
        <div className="absolute bottom-0 left-1/3 w-[650px] h-[280px] rounded-full blur-[130px] bg-[#0284c7]/10" />
      </div>

      {/* Main Viewport: 3D Scene or 2D Blueprint */}
      <div className="absolute inset-0 w-full h-full z-10">
        {is2DView ? (
          <div className="w-full h-full flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <Auditorium2D
              seats={seats}
              selectedSeatCodes={selectedSeatCodes}
              onToggleSeat={toggleSeat}
              theme="dark"
            />
          </div>
        ) : (
          <Auditorium3D
            seats={seats}
            selectedSeatCodes={selectedSeatCodes}
            onToggleSeat={toggleSeat}
            interactive={true}
            theme="dark"
          />
        )}
      </div>

      {/* TOP HEADER HUD BAR (Progression breadcrumb, Seat legend, Audio spec & Drawer toggle) */}
      <div className="relative z-20 w-full px-4 md:px-8 pt-3 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Left: Progression Breadcrumb & Back button */}
        <div className="pointer-events-auto flex items-center gap-2 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 bg-[#0f1422]/90 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-['Geist'] text-xs text-slate-300 hover:text-[#ff5500] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="hidden sm:inline font-medium">Screenings</span>
          </button>
          <span className="text-xs hidden sm:inline text-white/20">/</span>
          <div className="flex items-center gap-2 text-[10px] font-['Geist'] uppercase tracking-wider">
            <span className="hidden sm:inline text-slate-400">01 Film</span>
            <span className="hidden sm:inline text-white/20">&rsaquo;</span>
            <span className="hidden md:inline text-slate-400">02 Cinema</span>
            <span className="hidden md:inline text-white/20">&rsaquo;</span>
            <span className="hidden sm:inline text-slate-400">03 Showtime</span>
            <span className="hidden sm:inline text-white/20">&rsaquo;</span>
            <span className="font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5500]/15 text-[#ff7a00] border border-[#ff5500]/40 shadow-[0_0_15px_rgba(255,85,0,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
              04 3D Auditorium
            </span>
          </div>
        </div>

        {/* Center: Clean Floating Seat Legend */}
        <div className="pointer-events-auto hidden lg:flex items-center gap-5 backdrop-blur-2xl px-5 py-2 rounded-full border border-white/10 bg-[#0f1422]/90 shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-xs font-['Geist']">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-600/70 border border-slate-400/40" />
            <span className="text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5500] shadow-[0_0_8px_#ff5500]" />
            <span className="text-[#ff7a00] font-bold">Selected ({selectedSeatCodes.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1b2230] border border-white/10" />
            <span className="text-slate-500">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0284c7] shadow-[0_0_8px_rgba(2,132,199,0.7)]" />
            <span className="text-sky-300">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#d97706] shadow-[0_0_8px_rgba(217,119,6,0.7)]" />
            <span className="text-amber-300">VIP Suite</span>
          </div>
        </div>

        {/* Right: Technical Spec Pill & Toggle Booking Summary Button */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <div className="hidden xl:flex items-center gap-2.5 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 bg-[#0f1422]/90 shadow-md text-xs font-['Geist'] text-slate-200">
            <span className="material-symbols-outlined text-[#ff5500] text-[16px]">graphic_eq</span>
            <span className="font-semibold text-white">{show.screenFormat}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-300">
              70mm 1.43:1 MASTER RIG
            </span>
          </div>

          {/* Toggle Booking Summary Button */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-2xl transition-all shadow-xl border text-xs font-['Geist'] font-semibold ${
              isDrawerOpen
                ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.4)]'
                : 'bg-[#0f1422]/95 text-white hover:bg-[#182136] border-white/15 hover:border-[#ff5500]/50'
            }`}
            title="Toggle Booking Summary & Checkout Drawer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDrawerOpen ? 'close' : 'receipt_long'}
            </span>
            <span>{isDrawerOpen ? 'Hide Summary' : `Booking (${selectedSeatCodes.length})`}</span>
            {!isDrawerOpen && selectedSeatCodes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#ff5500] text-white text-[10px] font-bold shadow-[0_0_10px_rgba(255,85,0,0.5)]">
                £{subtotal.toFixed(0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2D / 3D SWITCHER BUTTON (Bottom Left Floating Pill) */}
      <div className="absolute bottom-6 left-4 md:left-8 z-20 pointer-events-auto">
        <button
          onClick={() => setIs2DView(!is2DView)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-2xl text-xs font-semibold tracking-wider transition-all shadow-2xl border border-white/15 bg-[#0f1422]/90 text-white hover:bg-[#182136] hover:border-[#ff5500]/50"
        >
          <span className="material-symbols-outlined text-[#ff5500] text-[18px]">
            {is2DView ? 'view_in_ar' : 'grid_view'}
          </span>
          <span className="hidden sm:inline font-bold">
            {is2DView ? 'Switch to 3D Auditorium' : 'Switch to 2D Plan'}
          </span>
        </button>
      </div>

      {/* RIGHT SLIDE-OVER CHECKOUT DRAWER (Smoothly slides in, luxury obsidian glass) */}
      <aside
        className={`fixed top-20 right-0 bottom-0 z-40 w-full sm:w-[410px] p-4 transition-transform duration-300 ease-in-out pointer-events-auto ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-6 rounded-2xl backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.95)] border border-white/10 bg-[#0d121e]/98 text-white overflow-y-auto">
          {/* Drawer Top Content */}
          <div>
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#ff5500]/20 flex items-center justify-center border border-[#ff5500]/40">
                  <span className="material-symbols-outlined text-[#ff5500] text-[18px]">
                    shopping_bag
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-base font-bold tracking-wide uppercase text-white">
                  Booking Summary
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="Close drawer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Film Card with High-Res Poster */}
            <div className="flex items-start gap-3.5 mb-4 p-3 rounded-xl bg-[#131926] border border-white/10">
              <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 relative shadow-lg border border-white/10">
                <img
                  alt={movie.title}
                  src={movie.posterUrl || FALLBACK_POSTER}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_POSTER;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="bg-[#ff5500]/20 text-[#ff7a00] border border-[#ff5500]/40 font-['Geist'] text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {show.screenFormat}
                  </span>
                  <span className="font-['Geist'] text-[10px] text-slate-400">
                    {movie.certification} &bull; {movie.durationMins}m
                  </span>
                </div>
                <h2 className="font-['Space_Grotesk'] text-base font-bold tracking-tight leading-snug text-white truncate">
                  {movie.title}
                </h2>
                <p className="font-['Geist'] text-xs text-slate-400 truncate mt-0.5">
                  Dir. {movie.director}
                </p>
                <p className="font-['Geist'] text-[11px] text-amber-300 font-medium mt-0.5">
                  ★ {movie.imdbRating.toFixed(1)} IMDB Rating
                </p>
              </div>
            </div>

            {/* Venue & Showtime Card */}
            <div className="p-3.5 rounded-xl mb-4 space-y-2.5 bg-[#131926] border border-white/10">
              <div className="flex items-start justify-between text-xs font-['Geist'] gap-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className="material-symbols-outlined text-[#ff5500] text-[16px]">location_on</span>
                  <span>{show.branchName}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                  {show.screenName}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-['Geist'] pt-2 border-t border-white/5 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
                  <span>{show.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#ff7a00]">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>{show.startTime} BST</span>
                </div>
              </div>
            </div>

            {/* Selected Seats Badges */}
            <div className="p-3.5 rounded-xl mb-4 bg-[#131926] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider font-['Geist'] text-slate-300">
                  Selected Seats ({selectedSeatCodes.length})
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Stereoscopic Focus
                </span>
              </div>

              {selectedSeatCodes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {selectedSeatCodes.map((code) => {
                    const seatInfo = seats.find((s) => s.seatCode === code);
                    return (
                      <div
                        key={code}
                        className="px-2.5 py-1 rounded-md text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 bg-[#1b2334] text-white border border-[#ff5500]/40 shadow-xs"
                      >
                        <span className="text-[#ff7a00]">{code}</span>
                        {seatInfo && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            (£{seatInfo.price.toFixed(0)})
                          </span>
                        )}
                        <button
                          onClick={() => toggleSeat(code)}
                          className="text-xs text-slate-400 hover:text-red-400 ml-0.5"
                          title="Remove seat"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs italic py-2 text-slate-400">
                  Click any available seat in the 3D auditorium to select.
                </p>
              )}

              {/* Acoustic Sightline Target Indicator */}
              <div className="rounded-lg p-2.5 flex items-start gap-2 bg-[#090d15] border border-white/5">
                <span className="material-symbols-outlined text-[#ff5500] text-[16px] mt-0.5">adjust</span>
                <div className="text-xs font-['Geist']">
                  <div className="font-semibold text-[11px] text-white">
                    Optimum Reference 1.43:1
                  </div>
                  <div className="text-[10px] leading-tight text-slate-400">
                    0° Keystone Distortion &bull; Center Subwoofer Axis
                  </div>
                </div>
              </div>
            </div>

            {/* Subtotal Itemized Breakdown */}
            <div className="space-y-1.5 text-xs font-['Geist'] px-1 mb-4 text-slate-300">
              <div className="flex items-center justify-between">
                <span>{selectedSeatCodes.length} &times; Auditorium Seats</span>
                <span className="font-semibold text-white">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>IMAX Dual Laser Surcharge</span>
                <span className="font-semibold text-white">Included</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Preservation &amp; Booking Fee</span>
                <span className="font-semibold text-white">£0.00</span>
              </div>
              <div className="pt-2.5 flex items-center justify-between font-['Space_Grotesk'] text-base border-t border-white/10 text-white">
                <span className="font-bold">Total</span>
                <span className="text-[#ff5500] font-bold text-xl drop-shadow-[0_0_12px_rgba(255,85,0,0.5)]">
                  £{subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button & Hold Countdown */}
          <div className="space-y-2.5 pt-3 border-t border-white/10">
            {holdError && (
              <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-lg border border-red-800/50 text-center font-medium">
                {holdError}
              </p>
            )}

            <button
              disabled={selectedSeatCodes.length === 0}
              onClick={handleContinue}
              className={`w-full py-3.5 px-4 rounded-full font-['Geist'] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                selectedSeatCodes.length > 0
                  ? 'bg-gradient-to-r from-[#ff5500] via-[#ff6a00] to-[#ff8000] text-white shadow-[0_4px_25px_rgba(255,85,0,0.4)] hover:shadow-[0_6px_30px_rgba(255,85,0,0.6)] active:scale-[0.98]'
                  : 'bg-[#1a2130] text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>Continue to Checkout</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] font-['Geist'] pt-1 text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px] text-[#ff5500]">lock</span>
                Encrypted Hold: <strong className="font-mono text-white">{formatTimer(holdSeconds)}</strong>
              </span>
              <span>&bull;</span>
              <span>Guaranteed Reserve</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop overlay on smaller screens when drawer is open */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 sm:hidden backdrop-blur-xs pointer-events-auto"
        />
      )}
    </div>
  );
};
