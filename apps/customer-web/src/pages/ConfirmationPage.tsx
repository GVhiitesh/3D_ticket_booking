import React from 'react';
import { Booking } from '../types';

interface ConfirmationPageProps {
  booking: Booking;
  onGoToBookings: () => void;
  onGoHome: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  booking,
  onGoToBookings,
  onGoHome,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        {/* Success Icon & Heading */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-[#ff6500]/20 flex items-center justify-center text-[#ff6500] shadow-[0_0_30px_rgba(255,101,0,0.4)]">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <span className="text-xs text-[#ff6500] font-['Geist'] tracking-[0.25em] uppercase font-bold">
            Reservation Confirmed
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
            You're Going to the Movies!
          </h1>
          <p className="text-xs text-[#e3bfb1] font-['Geist']">
            A confirmation receipt and digital ticket pass have been dispatched to{' '}
            <strong className="text-white">{booking.customerEmail}</strong>.
          </p>
        </div>

        {/* Digital Ticket Stub Card */}
        <div className="w-full rounded-3xl bg-[#111111] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* Left Column: Film & Screening Details */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-dashed border-white/10 relative">
            {/* Upper Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#ff6500]/20 text-[#ff6500] text-[10px] uppercase font-bold tracking-wider font-['Geist']">
                  {booking.screenFormat}
                </span>
                <span className="font-['Space_Grotesk'] text-sm font-mono text-[#ffb596] font-bold">
                  REF: {booking.bookingReference}
                </span>
              </div>

              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
                  {booking.movieTitle}
                </h2>
                <span className="text-xs text-[#e3bfb1] font-['Geist']">
                  {booking.branchName} &bull; {booking.screenName}
                </span>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-[#1c1b1b]">
                  <span className="text-[10px] text-[#aa8a7d] uppercase font-['Geist'] block">Screening Date</span>
                  <strong className="text-xs text-white font-['Geist']">{booking.date}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#1c1b1b]">
                  <span className="text-[10px] text-[#aa8a7d] uppercase font-['Geist'] block">Curtain Call</span>
                  <strong className="text-xs text-[#ff6500] font-['Geist']">{booking.showTime}</strong>
                </div>
              </div>

              {/* Seats Pill Row */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[10px] text-[#aa8a7d] uppercase font-['Geist']">Confirmed Seats</span>
                <div className="flex flex-wrap gap-2">
                  {booking.seatCodes.map((code) => (
                    <span
                      key={code}
                      className="px-3 py-1 rounded-lg bg-[#2a2a2a] text-[#ffb596] text-xs font-bold font-['Space_Grotesk'] border border-white/5"
                    >
                      Seat {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="text-[10px] text-[#aa8a7d] font-['Geist'] pt-4 border-t border-white/5 flex items-center justify-between">
              <span>Gate opens 20 mins prior to showtime</span>
              <span className="text-white font-bold">Total: £{booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Right Column: Scannable QR Code & Stub */}
          <div className="w-full md:w-64 bg-[#0a0a0a] p-6 flex flex-col items-center justify-center text-center gap-4">
            <span className="text-[10px] text-[#ff6500] font-['Geist'] uppercase tracking-widest font-bold">
              Entry Pass QR
            </span>

            {/* QR Code Container */}
            <div className="p-2.5 rounded-2xl bg-white shadow-xl">
              {booking.tickets[0]?.qrCodeDataUrl ? (
                <img
                  alt="Entry Ticket QR"
                  src={booking.tickets[0].qrCodeDataUrl}
                  className="w-40 h-40 object-contain"
                />
              ) : (
                <div className="w-40 h-40 bg-black flex items-center justify-center text-white text-xs">
                  QR Generated
                </div>
              )}
            </div>

            <div className="flex flex-col text-center">
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                {booking.tickets[0]?.ticketNumber || 'TKT-VALID'}
              </span>
              <span className="text-[10px] text-[#aa8a7d] font-['Geist'] mt-0.5">
                Scan at Auditorium Turnstile
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1b1b] hover:bg-[#2a2a2a] text-white text-xs font-bold tracking-wider uppercase transition-all border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Ticket / PDF
          </button>
          <button
            onClick={onGoToBookings}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#ff6500] hover:bg-[#b74600] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_8px_25px_rgba(255,101,0,0.4)]"
          >
            <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
            View in My Bookings
          </button>
          <button
            onClick={onGoHome}
            className="text-xs text-[#e3bfb1] hover:text-white transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
