import React from 'react';
import { SeatNode } from '../types';
import { formatCurrency } from '../utils/currency';

interface Auditorium2DProps {
  seats: SeatNode[];
  selectedSeatCodes: string[];
  onToggleSeat: (seatCode: string) => void;
  theme?: 'light' | 'dark';
  city?: string;
  showFormat?: string;
  topPrice?: number;
}

export const Auditorium2D: React.FC<Auditorium2DProps> = ({
  seats,
  selectedSeatCodes,
  onToggleSeat,
  theme = 'dark',
  city,
  showFormat,
  topPrice,
}) => {
  const isLight = theme === 'light';
  const screenAccent = isLight ? '#B83B08' : '#ff5500';

  // Ordered rows from Top (A) to Bottom (T)
  const rowOrder = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', // Upper Elite Section
    'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T',            // Lower Standard / Executive Section
  ];

  // Group existing seats by row
  const rowsMap = new Map<string, SeatNode[]>();
  seats.forEach((seat) => {
    if (!rowsMap.has(seat.rowName)) {
      rowsMap.set(seat.rowName, []);
    }
    rowsMap.get(seat.rowName)!.push(seat);
  });

  const renderSeatButton = (seat: SeatNode) => {
    const isSelected = selectedSeatCodes.includes(seat.seatCode);
    const isBooked = seat.status === 'BOOKED';
    const isHeld = seat.status === 'HELD';
    const isWheelchair = Boolean(seat.isWheelchair);

    let btnStyle = isLight
      ? 'bg-white text-[#141414] hover:border-[#B83B08] hover:text-[#B83B08] border border-[#D4D0C7] shadow-xs'
      : 'bg-[#181818] text-white hover:border-[#FF6500] hover:text-[#FF6500] border border-[#222222] shadow-xs';

    if (isSelected) {
      btnStyle =
        'bg-cv-accent text-white shadow-[0_0_12px_rgb(var(--cv-accent-rgb)/0.5)] dark:shadow-[0_0_14px_rgba(255,101,0,0.6)] border-transparent scale-110 z-10 font-bold';
    } else if (isBooked) {
      btnStyle = isLight
        ? 'bg-[#E8E5DD] text-[#9E9A90] border border-[#DBD7CD] cursor-not-allowed'
        : 'bg-[#0E0E0E] text-[#555555] border border-white/[0.04] cursor-not-allowed opacity-60';
    } else if (isHeld) {
      btnStyle =
        'bg-amber-500/20 text-amber-800 dark:text-amber-300 opacity-85 cursor-not-allowed border border-amber-500/40';
    } else if (isWheelchair) {
      btnStyle =
        'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/40 hover:bg-sky-500/25';
    }

    return (
      <button
        key={seat.seatCode}
        disabled={isBooked || isHeld}
        onClick={() => onToggleSeat(seat.seatCode)}
        title={`${seat.seatCode} (${seat.section || 'Auditorium'}, ${seat.tier}) - ${formatCurrency(seat.price, city, false)}`}
        className={`w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] shrink-0 rounded-[5px] text-[10px] font-medium flex items-center justify-center transition-all ${btnStyle}`}
      >
        {isWheelchair ? (
          <span className="material-symbols-outlined text-[14px]">accessible</span>
        ) : (
          String(seat.seatNumber).padStart(2, '0')
        )}
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-4 sm:px-8 rounded-3xl border border-cv-border dark:border-[#222222] select-none overflow-x-auto shadow-elevated-xl dark:shadow-[0_24px_70px_rgba(0,0,0,0.95)] bg-cv-surface dark:bg-[#0B0B0B] text-cv-primary transition-colors">
      {/* 1. TOP TIER CATEGORY BADGE */}
      <div className="w-full flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-cv-border bg-cv-elevated dark:bg-[#141414] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cv-accent" />
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-cv-primary">
            {formatCurrency(topPrice ?? (seats[0]?.price || 190), city, false)} ELITE {showFormat || '2D'}
          </span>
        </div>
        <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cv-border to-transparent mt-3" />
      </div>

      {/* 2. SECTION HEADERS & AISLE GUIDES */}
      <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest mb-4 min-w-[1080px]">
        <span className="w-6 shrink-0" />
        <span className="w-[196px] shrink-0 text-center py-1 px-2 rounded-md border border-cv-border bg-cv-elevated dark:bg-[#141414] text-cv-secondary font-semibold">
          Left Section (6 Seats)
        </span>
        <span className="w-7 shrink-0 text-cv-accent font-bold text-[9px] tracking-normal flex items-center justify-center gap-0.5">
          <span>◀</span>
          <span>▶</span>
        </span>
        <span className="w-[548px] shrink-0 text-center py-1 px-2 rounded-md border border-cv-accent/30 bg-cv-accent/10 text-cv-accent font-bold shadow-xs">
          Center Section (Prime Focal Axis • 17 Seats)
        </span>
        <span className="w-7 shrink-0 text-cv-accent font-bold text-[9px] tracking-normal flex items-center justify-center gap-0.5">
          <span>◀</span>
          <span>▶</span>
        </span>
        <span className="w-[228px] shrink-0 text-center py-1 px-2 rounded-md border border-cv-border bg-cv-elevated dark:bg-[#141414] text-cv-secondary font-semibold">
          Right Section (6–7 Seats)
        </span>
        <span className="w-6 shrink-0" />
      </div>

      {/* 3. ROWS LAYOUT (ROWS A TO T) */}
      <div className="flex flex-col gap-2 min-w-[1080px] items-center">
        {rowOrder.map((rowName) => {
          const rowSeats = rowsMap.get(rowName) || [];
          if (rowSeats.length === 0) return null;

          const leftSeats = rowSeats
            .filter((s) => s.section === 'LEFT')
            .sort((a, b) => a.seatNumber - b.seatNumber);
          const centerSeats = rowSeats
            .filter((s) => s.section === 'CENTER')
            .sort((a, b) => a.seatNumber - b.seatNumber);
          const rightSeats = rowSeats
            .filter((s) => s.section === 'RIGHT')
            .sort((a, b) => a.seatNumber - b.seatNumber);

          const isWalkwayBefore = rowName === 'L';

          return (
            <React.Fragment key={rowName}>
              {/* Transverse Cross-Aisle Walkway between Row K and Row L */}
              {isWalkwayBefore && (
                <div className="w-full flex items-center justify-center my-4 py-2 border-y border-cv-border bg-cv-elevated dark:bg-[#111111] rounded-lg">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cv-muted font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-cv-accent">stairs</span>
                    <span>TRANSVERSE CROSS-AISLE WALKWAY &bull; EXECUTIVE &amp; STANDARD ROWS</span>
                    <span className="material-symbols-outlined text-[14px] text-cv-accent">stairs</span>
                  </span>
                </div>
              )}

              {/* Individual Row Container */}
              <div className="flex items-center justify-center gap-2">
                {/* Row Letter Left */}
                <span className="w-6 shrink-0 text-xs font-bold text-center text-cv-accent">
                  {rowName}
                </span>

                {/* Left Section Seats */}
                <div className="w-[196px] shrink-0 flex items-center justify-end gap-1 p-1 rounded-lg border border-cv-border bg-cv-bg-secondary dark:bg-[#111111]">
                  {leftSeats.map(renderSeatButton)}
                </div>

                {/* Left Radial Aisle */}
                <div className="w-7 shrink-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-cv-accent/20 via-cv-accent/80 to-cv-accent/20" />
                </div>

                {/* Center Section Seats */}
                <div className="w-[548px] shrink-0 flex items-center justify-center gap-1 p-1 rounded-lg border border-cv-border bg-cv-elevated dark:bg-[#141414] shadow-inner">
                  {centerSeats.map(renderSeatButton)}
                </div>

                {/* Right Radial Aisle */}
                <div className="w-7 shrink-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-cv-accent/20 via-cv-accent/80 to-cv-accent/20" />
                </div>

                {/* Right Section Seats */}
                <div className="w-[228px] shrink-0 flex items-center justify-start gap-1 p-1 rounded-lg border border-cv-border bg-cv-bg-secondary dark:bg-[#111111]">
                  {rightSeats.map(renderSeatButton)}
                </div>

                {/* Row Letter Right */}
                <span className="w-6 shrink-0 text-xs font-bold text-center text-cv-accent">
                  {rowName}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 4. CINEMA SCREEN AT BOTTOM */}
      <div className="w-full max-w-4xl mt-12 flex flex-col items-center min-w-[1080px]">
        <div className="relative w-full h-28 flex flex-col items-center justify-center">
          <svg
            className="w-full h-28 overflow-visible"
            viewBox="0 0 840 90"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Screen Silver Arc Gradient */}
              <linearGradient id="screenSilverGradBtm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={screenAccent} stopOpacity="0.45" />
                <stop offset="15%" stopColor="#7ba3cc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="85%" stopColor="#7ba3cc" stopOpacity="0.9" />
                <stop offset="100%" stopColor={screenAccent} stopOpacity="0.45" />
              </linearGradient>

              {/* Ambient Glow */}
              <linearGradient id="screenAuraBtm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor={isLight ? '#8C2B05' : '#0284c7'} stopOpacity="0.45" />
                <stop offset="50%" stopColor={screenAccent} stopOpacity="0.9" />
                <stop offset="70%" stopColor={isLight ? '#8C2B05' : '#0284c7'} stopOpacity="0.45" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Upward Projection Beam */}
              <linearGradient id="beamGradUp" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={isLight ? '#B83B08' : '#38bdf8'} stopOpacity={isLight ? '0.16' : '0.25'} />
                <stop offset="60%" stopColor={screenAccent} stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              <filter id="screenGlowBtm" x="-20%" y="-40%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Projection Light Beam Shining Upward toward seats */}
            <path
              d="M 60 48 Q 420 80 780 48 L 830 0 L 10 0 Z"
              fill="url(#beamGradUp)"
            />

            {/* Radial Projection Rays */}
            <line x1="420" y1="65" x2="160" y2="0" stroke={screenAccent} strokeWidth="1" strokeDasharray="4 4" strokeOpacity={isLight ? '0.35' : '0.5'} />
            <line x1="420" y1="65" x2="420" y2="0" stroke={screenAccent} strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity={isLight ? '0.55' : '0.8'} />
            <line x1="420" y1="65" x2="680" y2="0" stroke={screenAccent} strokeWidth="1" strokeDasharray="4 4" strokeOpacity={isLight ? '0.35' : '0.5'} />

            {/* Screen Bezel Frame */}
            <path
              d="M 45 48 Q 420 88 795 48"
              fill="none"
              stroke={isLight ? '#141414' : '#131926'}
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Ambient Halo */}
            <path
              d="M 50 48 Q 420 85 790 48"
              fill="none"
              stroke="url(#screenAuraBtm)"
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#screenGlowBtm)"
            />

            {/* Silver Curved Screen Surface */}
            <path
              d="M 52 48 Q 420 84 788 48"
              fill="none"
              stroke="url(#screenSilverGradBtm)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Center Focal Axis Crosshair */}
            <circle cx="420" cy="65" r="5" fill={screenAccent} />
            <line x1="420" y1="54" x2="420" y2="76" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="409" y1="65" x2="431" y2="65" stroke="#ffffff" strokeWidth="1.5" />
          </svg>

          {/* Central Overlay Badge & Typography */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none mt-2">
            <div className="flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-cv-accent/50 bg-[#141414] dark:bg-[#0c101a]/95 dark:font-['Space_Grotesk'] text-white shadow-elevated-xl dark:shadow-[0_0_20px_rgba(255,85,0,0.4)]">
              <span className="w-2 h-2 rounded-full bg-cv-accent animate-ping" />
              <span>70MM CURVED SILVER SCREEN</span>
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase mt-1.5 text-cv-secondary dark:text-slate-300 font-semibold dark:font-['Geist'] dark:font-medium">
              ▲ ALL EYES THIS WAY &bull; SCREEN THIS WAY ▲
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
