import React, { useState, useEffect } from 'react';
import { Show, SeatNode, Movie } from '../types';
import { Auditorium3D } from '../components/Auditorium3D';
import { Auditorium2D } from '../components/Auditorium2D';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/currency';

interface SeatSelectionPageProps {
  show: Show;
  movie: Movie;
  onProceedToCheckout: (selectedSeatCodes: string[], subtotal: number) => void;
  onBack: () => void;
  theme?: 'light' | 'dark';
}

export const SeatSelectionPage: React.FC<SeatSelectionPageProps> = ({
  show,
  movie,
  onProceedToCheckout,
  onBack,
}) => {
  const [seats, setSeats] = useState<SeatNode[]>([]);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([]);
  const [is2DView, setIs2DView] = useState<boolean>(true);
  const [confirmedFrom2D, setConfirmedFrom2D] = useState<boolean>(false);
  const [holdSeconds, setHoldSeconds] = useState<number>(582); // ~9m 42s
  const [loading, setLoading] = useState<boolean>(true);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Fetch seating layout & availability from backend and always start in 2D selection mode
  useEffect(() => {
    setIs2DView(true);
    setConfirmedFrom2D(false);
    setSelectedSeatCodes([]);
    setHoldError(null);
    setIsDrawerOpen(false);
    setLoading(true);

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
    const fallbackPrice = show.pricing?.STANDARD || 190;
    return selectedSeatCodes.reduce((sum, code) => {
      const seat = seats.find((s) => s.seatCode === code);
      return sum + (seat?.price ?? fallbackPrice);
    }, 0);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const subtotal = calculateSubtotal();

  const handleConfirm2DSeats = () => {
    if (selectedSeatCodes.length === 0) {
      setHoldError('Please select at least one seat in 2D before confirming.');
      return;
    }
    setHoldError(null);
    setIsDrawerOpen(false);
    setConfirmedFrom2D(true);
    setIs2DView(false);
  };

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
    <div className="flex flex-col w-full relative h-[calc(100vh-5rem)] mt-20 overflow-hidden select-none bg-[#050505] text-[#FFFFFF]">
      {/* Main Viewport: 2D Seat Plan First -> Confirmed into 3D Scene */}
      <div className="absolute inset-0 w-full h-full z-10">
        {is2DView ? (
          <div className="w-full h-full overflow-y-auto pt-20 pb-28 px-4 md:px-8">
            <div className="max-w-[1220px] mx-auto">
              {loading && seats.length === 0 ? (
                <div className="w-full py-24 rounded-3xl border border-[#222222] bg-[#0B0B0B] flex flex-col items-center justify-center gap-3 text-sm text-[#A0A0A0]">
                  <span className="w-6 h-6 rounded-full border-2 border-[#FF6500] border-t-transparent animate-spin" />
                  <span>Loading interactive 2D seat layout...</span>
                </div>
              ) : (
                <Auditorium2D
                  seats={seats}
                  selectedSeatCodes={selectedSeatCodes}
                  onToggleSeat={toggleSeat}
                  theme="dark"
                  city={show.city}
                  showFormat={show.screenFormat}
                  topPrice={show.pricing?.STANDARD}
                />
              )}
            </div>
          </div>
        ) : (
          <Auditorium3D
            seats={seats}
            selectedSeatCodes={selectedSeatCodes}
            onToggleSeat={toggleSeat}
            interactive={true}
            theme="dark"
            city={show.city}
          />
        )}
      </div>

      {/* TOP HUD BAR */}
      <div className="relative z-20 w-full px-4 md:px-8 pt-3 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back Button & Screening Info */}
        <div className="pointer-events-auto flex items-center gap-3 backdrop-blur-xl px-4 py-2 rounded-full border border-[#222222] bg-[#111111]/90 shadow-md">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-[#FF6500] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="hidden sm:inline font-medium">Showtimes</span>
          </button>
          <span className="text-[#222222]">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">{movie.title}</span>
            <Badge variant="outline" size="sm">
              {show.displayTime || show.startTime}
            </Badge>
            <Badge variant={is2DView ? 'brand' : 'success'} size="sm">
              {is2DView ? 'Step 1/2 • 2D Plan' : confirmedFrom2D ? 'Step 2/2 • 3D Confirmed' : '3D Auditorium'}
            </Badge>
          </div>
        </div>

        {/* Center: Clean Seat Legend */}
        <div className="pointer-events-auto hidden lg:flex items-center gap-5 backdrop-blur-xl px-5 py-2 rounded-full border border-[#222222] bg-[#111111]/90 shadow-md text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#707070]" />
            <span className="text-[#A0A0A0]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6500] shadow-[0_0_8px_#FF6500]" />
            <span className="text-[#FF6500] font-semibold">Selected ({selectedSeatCodes.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#222222]" />
            <span className="text-[#707070]">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <span className="text-sky-400">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B94700]" />
            <span className="text-amber-400">VIP Suite</span>
          </div>
        </div>

        {/* Right: Technical Spec & Drawer Toggle */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Seat Hold Timer */}
          <div className="flex items-center gap-2 backdrop-blur-xl px-3.5 py-2 rounded-full border border-[#222222] bg-[#111111]/90 text-xs">
            <span className="material-symbols-outlined text-[#FF6500] text-[16px] animate-pulse">lock_clock</span>
            <span className="text-[#A0A0A0] hidden sm:inline">Hold:</span>
            <span className="font-mono font-bold text-white">{formatTimer(holdSeconds)}</span>
          </div>

          {/* Toggle Booking Drawer Button */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl transition-all border text-xs font-semibold ${
              isDrawerOpen
                ? 'bg-[#FF6500] text-white border-[#FF6500] shadow-glow-orange-sm'
                : 'bg-[#111111]/95 text-white hover:bg-[#181818] border-[#222222] hover:border-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDrawerOpen ? 'close' : 'receipt_long'}
            </span>
            <span>{isDrawerOpen ? 'Hide' : `Seats (${selectedSeatCodes.length})`}</span>
            {!isDrawerOpen && selectedSeatCodes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF6500] text-white text-[10px] font-bold">
                {formatCurrency(subtotal, show.city, false)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* BOTTOM ACTION BAR: 2D Confirm Dock -> Automatically Transitions to 3D */}
      {is2DView ? (
        <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 z-20 pointer-events-auto">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-2xl border border-[#222222] bg-[#111111]/95 shadow-[0_20px_50px_rgba(0,0,0,0.92)]">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6500]">
                  Step 1 &bull; 2D Seat Plan
                </span>
                {selectedSeatCodes.length > 0 && (
                  <span className="text-[11px] font-bold text-white">
                    &bull; {formatCurrency(subtotal, show.city)}
                  </span>
                )}
              </div>
              {selectedSeatCodes.length === 0 ? (
                <span className="text-xs text-[#A0A0A0]">
                  Tap available seats on the 2D layout, then press Confirm to enter the 3D auditorium.
                </span>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-white truncate">
                  <span className="text-[#A0A0A0] shrink-0">
                    Selected ({selectedSeatCodes.length}):
                  </span>
                  <span className="font-semibold text-[#FF6500] truncate">
                    {selectedSeatCodes.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                onClick={handleConfirm2DSeats}
                variant="primary"
                size="md"
                rightIcon={<span className="material-symbols-outlined text-[18px]">view_in_ar</span>}
                className={selectedSeatCodes.length === 0 ? 'opacity-75' : ''}
              >
                {selectedSeatCodes.length > 0
                  ? `Confirm Seats (${selectedSeatCodes.length}) • View 3D`
                  : 'Confirm Seats'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute bottom-24 xl:bottom-6 left-4 md:left-8 z-20 pointer-events-auto">
            <button
              onClick={() => setIs2DView(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl text-xs font-semibold tracking-wide transition-all shadow-card-subtle border border-[#222222] bg-[#111111]/90 text-white hover:bg-[#181818] hover:border-[#FF6500]/50"
            >
              <span className="material-symbols-outlined text-[#FF6500] text-[18px]">
                grid_view
              </span>
              <span className="font-semibold">Back to 2D Plan</span>
            </button>
          </div>

          {selectedSeatCodes.length > 0 && (
            <div className="hidden xl:block absolute bottom-6 right-8 z-20 pointer-events-auto">
              <Button
                onClick={handleContinue}
                variant="primary"
                size="md"
                rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              >
                Proceed to Payment ({selectedSeatCodes.length})
              </Button>
            </div>
          )}
        </>
      )}

      {/* Error Message Floating Banner */}
      {holdError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#181818] border border-red-500/50 text-red-400 text-xs font-medium shadow-xl">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{holdError}</span>
            <button
              onClick={() => setHoldError(null)}
              className="ml-2 text-white/50 hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* RIGHT SLIDE-OVER CHECKOUT DRAWER */}
      <aside
        className={`fixed top-20 right-0 bottom-0 z-40 w-full sm:w-[410px] p-4 transition-transform duration-300 ease-in-out pointer-events-auto ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-6 rounded-3xl backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.95)] border border-[#222222] bg-[#111111]/98 text-white overflow-y-auto">
          {/* Top Section */}
          <div className="flex flex-col gap-5">
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FF6500]/15 flex items-center justify-center border border-[#FF6500]/30 text-[#FF6500]">
                  <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Booking Summary
                  </h3>
                  <span className="text-[10px] text-[#707070]">
                    {selectedSeatCodes.length} seat(s) reserved
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#222222] flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors border border-[#222222]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Film Overview */}
            <div className="flex gap-3 p-3.5 rounded-2xl bg-[#181818] border border-[#222222]">
              <img
                alt={movie.title}
                src={movie.posterUrl}
                className="w-12 h-16 object-cover rounded-lg border border-white/5"
              />
              <div className="flex flex-col justify-center gap-0.5">
                <h4 className="text-xs font-bold text-white line-clamp-1">{movie.title}</h4>
                <span className="text-[11px] text-[#A0A0A0]">{show.branchName}</span>
                <span className="text-[10px] text-[#FF6500] font-semibold">{show.screenName}</span>
              </div>
            </div>

            {/* Selected Seats Pills */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-[#707070] uppercase tracking-wider">
                Reserved Seats
              </span>
              {selectedSeatCodes.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#181818] border border-dashed border-[#222222] text-center text-xs text-[#707070]">
                  Click on any seat in the 3D or 2D auditorium to select.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {selectedSeatCodes.map((code) => {
                    const seat = seats.find((s) => s.seatCode === code);
                    return (
                      <div
                        key={code}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#222222] text-xs font-medium text-white"
                      >
                        <span className="font-bold text-[#FF6500]">{code}</span>
                        <span className="text-[10px] text-[#707070]">{seat?.tier || 'Standard'}</span>
                        <span className="text-white/40">&bull;</span>
                        <span className="text-xs font-semibold">{formatCurrency(seat?.price ?? (show.pricing?.STANDARD || 190), show.city)}</span>
                        <button
                          onClick={() => toggleSeat(code)}
                          className="text-[#707070] hover:text-red-400 ml-1 text-xs"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-2 pt-4 border-t border-[#222222] text-xs">
              <div className="flex justify-between text-[#A0A0A0]">
                <span>Tickets ({selectedSeatCodes.length})</span>
                <span className="text-white font-medium">{formatCurrency(subtotal, show.city)}</span>
              </div>
              <div className="flex justify-between text-[#A0A0A0]">
                <span>Convenience Fee</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-[#A0A0A0]">
                <span>Estimated VAT (18%)</span>
                <span className="text-white font-medium">{formatCurrency(subtotal * 0.18, show.city)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#222222] text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-[#FF6500] text-base">{formatCurrency(subtotal * 1.18, show.city)}</span>
              </div>
            </div>
          </div>

          {/* Drawer Bottom CTA */}
          <div className="pt-6 border-t border-[#222222]">
            {is2DView ? (
              <Button
                onClick={handleConfirm2DSeats}
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<span className="material-symbols-outlined text-[18px]">view_in_ar</span>}
              >
                Confirm Seats &amp; View in 3D ({selectedSeatCodes.length})
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                disabled={selectedSeatCodes.length === 0}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Proceed to Payment ({selectedSeatCodes.length} Seats) &rarr;
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
