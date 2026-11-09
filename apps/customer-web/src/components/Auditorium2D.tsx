import React from 'react';
import { SeatNode } from '../types';

interface Auditorium2DProps {
  seats: SeatNode[];
  selectedSeatCodes: string[];
  onToggleSeat: (seatCode: string) => void;
  theme?: 'light' | 'dark';
}

export const Auditorium2D: React.FC<Auditorium2DProps> = ({
  seats,
  selectedSeatCodes,
  onToggleSeat,
}) => {
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

    let btnStyle =
      'bg-[#181818] text-white hover:border-[#FF6500] hover:text-[#FF6500] border border-[#222222] shadow-xs';

    if (isSelected) {
      btnStyle =
        'bg-[#FF6500] text-white shadow-[0_0_14px_rgba(255,101,0,0.6)] border-transparent scale-110 z-10 font-bold';
    } else if (isBooked) {
      btnStyle =
        'bg-[#0E0E0E] text-[#555555] border border-white/[0.04] cursor-not-allowed opacity-60';
    } else if (isHeld) {
      btnStyle =
        'bg-[#B94700]/30 text-white opacity-80 cursor-not-allowed border-amber-500/40';
    } else if (isWheelchair) {
      btnStyle =
        'bg-[#0284C7]/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/30';
    }

    return (
      <button
        key={seat.seatCode}
        disabled={isBooked || isHeld}
        onClick={() => onToggleSeat(seat.seatCode)}
        title={`${seat.seatCode} (${seat.section || 'Auditorium'}, ${seat.tier}) - £${seat.price}`}
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
    <div className="w-full flex flex-col items-center py-6 px-4 sm:px-8 rounded-3xl border border-[#222222] select-none overflow-x-auto shadow-[0_24px_70px_rgba(0,0,0,0.95)] bg-[#0B0B0B] text-white">
      {/* 1. TOP TIER CATEGORY BADGE (MATCHING USER SCREENSHOT) */}
      <div className="w-full flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#222222] bg-[#141414] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#FF6500]" />
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-white">
            ₹300 ELITE 3D
          </span>
        </div>
        <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#222222] to-transparent mt-3" />
      </div>

      {/* 2. SECTION HEADERS & AISLE GUIDES */}
      <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest mb-4 min-w-[1080px]">
        <span className="w-6 shrink-0" />
        <span className="w-[196px] shrink-0 text-center py-1 px-2 rounded-md border border-[#222222] bg-[#141414] text-[#A0A0A0] font-semibold">
          Left Section (6 Seats)
        </span>
        <span className="w-7 shrink-0 text-[#FF6500] font-bold text-[9px] tracking-normal flex items-center justify-center gap-0.5">
          <span>◀</span>
          <span>▶</span>
        </span>
        <span className="w-[548px] shrink-0 text-center py-1 px-2 rounded-md border border-[#FF6500]/30 bg-[#FF6500]/10 text-[#FF6500] font-bold shadow-xs">
          Center Section (Prime Focal Axis • 17 Seats)
        </span>
        <span className="w-7 shrink-0 text-[#FF6500] font-bold text-[9px] tracking-normal flex items-center justify-center gap-0.5">
          <span>◀</span>
          <span>▶</span>
        </span>
        <span className="w-[228px] shrink-0 text-center py-1 px-2 rounded-md border border-[#222222] bg-[#141414] text-[#A0A0A0] font-semibold">
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
                <div className="w-full flex items-center justify-center my-4 py-2 border-y border-[#222222] bg-[#111111] rounded-lg">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#707070] font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-[#FF6500]">stairs</span>
                    <span>TRANSVERSE CROSS-AISLE WALKWAY &bull; EXECUTIVE &amp; STANDARD ROWS</span>
                    <span className="material-symbols-outlined text-[14px] text-[#FF6500]">stairs</span>
                  </span>
                </div>
              )}

              {/* Individual Row Container */}
              <div className="flex items-center justify-center gap-2">
                {/* Row Letter Left */}
                <span className="w-6 shrink-0 text-xs font-bold text-center text-[#FF6500]">
                  {rowName}
                </span>

                {/* Left Section Seats (Width preserved at 6 slots so indented rows hug the aisle) */}
                <div className="w-[196px] shrink-0 flex items-center justify-end gap-1 p-1 rounded-lg border border-[#222222] bg-[#111111]">
                  {leftSeats.map(renderSeatButton)}
                </div>

                {/* Left Radial Aisle */}
                <div className="w-7 shrink-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-[#FF6500]/20 via-[#FF6500]/80 to-[#FF6500]/20" />
                </div>

                {/* Center Section Seats */}
                <div className="w-[548px] shrink-0 flex items-center justify-center gap-1 p-1 rounded-lg border border-[#222222] bg-[#141414] shadow-inner">
                  {centerSeats.map(renderSeatButton)}
                </div>

                {/* Right Radial Aisle */}
                <div className="w-7 shrink-0 flex items-center justify-center">
                  <div className="h-6 w-0.5 bg-gradient-to-b from-[#FF6500]/20 via-[#FF6500]/80 to-[#FF6500]/20" />
                </div>

                {/* Right Section Seats (Width preserved at 6-7 slots starting from aisle) */}
                <div className="w-[228px] shrink-0 flex items-center justify-start gap-1 p-1 rounded-lg border border-[#222222] bg-[#111111]">
                  {rightSeats.map(renderSeatButton)}
                </div>

                {/* Row Letter Right */}
                <span className="w-6 shrink-0 text-xs font-bold text-center text-[#FF6500]">
                  {rowName}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 4. CINEMA SCREEN AT BOTTOM (MATCHING INDIAN CINEMA / BOOKMYSHOW LAYOUT IN USER IMAGE) */}
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
                <stop offset="0%" stopColor="#ff5500" stopOpacity="0.4" />
                <stop offset="15%" stopColor="#7ba3cc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="85%" stopColor="#7ba3cc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ff5500" stopOpacity="0.4" />
              </linearGradient>

              {/* Ambient Glow */}
              <linearGradient id="screenAuraBtm" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#0284c7" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#ff5500" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#0284c7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>

              {/* Upward Projection Beam Shining onto Row T and Audience */}
              <linearGradient id="beamGradUp" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#ff5500" stopOpacity="0.08" />
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
            <line x1="420" y1="65" x2="160" y2="0" stroke="#ff5500" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
            <line x1="420" y1="65" x2="420" y2="0" stroke="#ff5500" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.8" />
            <line x1="420" y1="65" x2="680" y2="0" stroke="#ff5500" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />

            {/* Screen Bezel Frame (Curving gently upward) */}
            <path
              d="M 45 48 Q 420 88 795 48"
              fill="none"
              stroke="#131926"
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
            <circle cx="420" cy="65" r="5" fill="#ff5500" />
            <line x1="420" y1="54" x2="420" y2="76" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="409" y1="65" x2="431" y2="65" stroke="#ffffff" strokeWidth="1.5" />
          </svg>

          {/* Central Overlay Badge & Typography */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none mt-2">
            <div className="flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-['Space_Grotesk'] font-bold tracking-widest uppercase border border-[#ff5500]/50 bg-[#0c101a]/95 text-white shadow-[0_0_20px_rgba(255,85,0,0.4)]">
              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
              <span>70MM CURVED SILVER SCREEN</span>
            </div>
            <span className="text-[10px] font-['Geist'] tracking-[0.25em] uppercase mt-1 text-slate-300 font-medium">
              ▲ ALL EYES THIS WAY &bull; SCREEN THIS WAY ▲
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
