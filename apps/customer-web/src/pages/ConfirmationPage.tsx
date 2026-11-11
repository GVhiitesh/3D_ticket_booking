import React from 'react';
import { Booking } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/currency';

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
    <div className="w-full min-h-screen bg-cv-bg text-cv-primary pt-28 pb-20 px-5 md:px-12 flex justify-center transition-colors duration-200">
      <div className="w-full max-w-3xl flex flex-col items-center gap-8">
        {/* Success Icon & Heading */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-cv-accent/15 border border-cv-accent/30 flex items-center justify-center text-cv-accent shadow-glow-orange-sm">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <span className="text-xs text-cv-accent font-semibold tracking-wider uppercase">
            Reservation Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-cv-primary">
            You're Going to the Movies
          </h1>
          <p className="text-xs sm:text-sm text-cv-secondary max-w-md">
            A confirmation receipt and digital boarding pass have been dispatched to{' '}
            <strong className="text-cv-primary">{booking.customerEmail}</strong>.
          </p>
        </div>

        {/* Digital Ticket Pass Stub */}
        <div className="w-full rounded-3xl bg-cv-surface border border-cv-border overflow-hidden shadow-elevated-xl flex flex-col md:flex-row">
          {/* Left Column: Film & Screening Details */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6 border-b md:border-b-0 md:border-r border-dashed border-cv-border">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm">
                  {booking.screenFormat}
                </Badge>
                <span className="text-xs font-mono text-cv-secondary font-bold">
                  REF: {booking.bookingReference}
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-cv-primary uppercase tracking-tight">
                  {booking.movieTitle}
                </h2>
                <span className="text-xs text-cv-secondary">
                  {booking.branchName} &bull; {booking.screenName}
                </span>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-cv-elevated border border-cv-border">
                  <span className="text-[10px] text-cv-muted uppercase block">Screening Date</span>
                  <strong className="text-xs text-cv-primary">{booking.date}</strong>
                </div>
                <div className="p-3 rounded-xl bg-cv-elevated border border-cv-border">
                  <span className="text-[10px] text-cv-muted uppercase block">Curtain Call</span>
                  <strong className="text-xs text-cv-accent">{booking.showTime}</strong>
                </div>
              </div>

              {/* Confirmed Seats Pills */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[10px] text-cv-muted uppercase font-semibold">
                  Confirmed Seats ({booking.seatCodes.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {booking.seatCodes.map((code) => (
                    <span
                      key={code}
                      className="px-3 py-1 rounded-lg bg-cv-elevated border border-cv-border text-xs font-semibold text-cv-primary"
                    >
                      Seat {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="text-[11px] text-cv-muted pt-4 border-t border-cv-border flex items-center justify-between">
              <span>Auditorium turnstiles open 20m before showtime</span>
              <span className="text-cv-primary font-bold">Paid: {formatCurrency(booking.totalAmount, booking.city)}</span>
            </div>
          </div>

          {/* Right Column: Scannable QR Code */}
          <div className="w-full md:w-64 bg-cv-bg-subtle p-6 flex flex-col items-center justify-center text-center gap-4 border-t md:border-t-0 md:border-l border-cv-border">
            <span className="text-[10px] text-cv-accent uppercase tracking-wider font-semibold">
              Auditorium Entry Pass
            </span>

            {/* QR Container */}
            <div className="p-3 rounded-2xl bg-white border border-cv-border shadow-md">
              {booking.tickets[0]?.qrCodeDataUrl ? (
                <img
                  alt="Entry Ticket QR"
                  src={booking.tickets[0].qrCodeDataUrl}
                  className="w-36 h-36 object-contain"
                />
              ) : (
                <div className="w-36 h-36 bg-black flex items-center justify-center text-white text-xs">
                  QR GENERATED
                </div>
              )}
            </div>

            <div className="flex flex-col text-center">
              <span className="font-mono text-xs font-bold text-cv-primary tracking-wider">
                {booking.tickets[0]?.ticketNumber || 'TKT-VALID-2026'}
              </span>
              <span className="text-[10px] text-cv-muted mt-0.5">
                Scan at turnstile scanner
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            onClick={() => window.print()}
            variant="secondary"
            size="md"
            leftIcon={<span className="material-symbols-outlined text-[18px]">print</span>}
          >
            Print Ticket / PDF
          </Button>
          <Button
            onClick={onGoToBookings}
            variant="primary"
            size="md"
            leftIcon={<span className="material-symbols-outlined text-[18px]">confirmation_number</span>}
          >
            View in My Bookings
          </Button>
          <Button
            onClick={onGoHome}
            variant="outline"
            size="md"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
