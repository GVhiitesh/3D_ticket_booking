import React, { useState, useEffect } from 'react';
import { Booking } from '../types';

interface MyBookingsPageProps {
  onBookMore: () => void;
  currentUser?: { name: string; email: string; phone?: string } | null;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onBookMore, currentUser }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicketForQR, setSelectedTicketForQR] = useState<any | null>(null);

  const fetchBookings = () => {
    const email = currentUser?.email || 'customer@cineva.com';
    fetch(`/api/v1/bookings/customer?emailOrPhone=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setBookings(data.data);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs text-[#ff6500] font-['Geist'] tracking-[0.25em] uppercase font-bold">
              Digital Ticket Wallet
            </span>
            <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold tracking-tight text-white">
              My Bookings
            </h1>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#1c1b1b] border border-white/5">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold font-['Geist'] transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#ff6500] text-white shadow-[0_0_12px_rgba(255,101,0,0.3)]'
                  : 'text-[#e3bfb1] hover:text-white'
              }`}
            >
              Upcoming Screenings
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold font-['Geist'] transition-all ${
                activeTab === 'past'
                  ? 'bg-[#ff6500] text-white shadow-[0_0_12px_rgba(255,101,0,0.3)]'
                  : 'text-[#e3bfb1] hover:text-white'
              }`}
            >
              Past Archive
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#111111] border border-white/5 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1c1b1b] flex items-center justify-center text-[#ff6500]">
              <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-[#e3bfb1] font-['Geist'] max-w-sm">
              You haven't reserved any cinema tickets yet. Explore now-showing blockbusters in 70mm and IMAX.
            </p>
            <button
              onClick={onBookMore}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#ff6500] hover:bg-[#b74600] text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-xl"
              >
                {/* Film Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <img
                    alt={booking.movieTitle}
                    src={booking.moviePosterUrl}
                    className="w-16 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#ff6500]/20 text-[#ff6500] text-[10px] font-bold uppercase font-['Geist']">
                        {booking.screenFormat}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#ffb596]">
                        {booking.bookingReference}
                      </span>
                    </div>

                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white">
                      {booking.movieTitle}
                    </h3>

                    <span className="text-xs text-[#e3bfb1] font-['Geist']">
                      {booking.branchName} &bull; {booking.screenName}
                    </span>

                    <span className="text-xs font-semibold text-white font-['Geist']">
                      {booking.date} at {booking.showTime}
                    </span>
                  </div>
                </div>

                {/* Right Side: Seats & Actions */}
                <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                  <div className="flex flex-col md:items-end gap-1">
                    <span className="text-[10px] text-[#aa8a7d] uppercase font-['Geist']">Reserved Seats</span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.seatCodes.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-1 rounded bg-[#1c1b1b] text-white text-xs font-bold font-['Space_Grotesk'] border border-white/5"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedTicketForQR(booking.tickets[0])}
                      className="px-4 py-2 rounded-full bg-[#1c1b1b] hover:bg-[#2a2a2a] text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#ff6500]">qr_code</span>
                      View QR Pass
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-9 h-9 rounded-full bg-[#1c1b1b] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-colors"
                      title="Print Ticket"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Modal Popup */}
        {selectedTicketForQR && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center">
              <span className="text-[10px] text-[#ff6500] font-['Geist'] uppercase tracking-widest font-bold">
                Auditorium Entry Pass
              </span>
              <div className="p-3 bg-white rounded-2xl shadow-2xl">
                <img
                  alt="Ticket QR Code"
                  src={selectedTicketForQR.qrCodeDataUrl}
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="font-mono text-xs text-white font-bold tracking-wider">
                {selectedTicketForQR.ticketNumber}
              </div>
              <p className="text-[10px] text-[#aa8a7d] font-['Geist']">
                Seat {selectedTicketForQR.seatCode} &bull; Present this QR at the turnstile
              </p>
              <button
                onClick={() => setSelectedTicketForQR(null)}
                className="w-full py-2.5 rounded-full bg-[#ff6500] hover:bg-[#b74600] text-white text-xs font-bold uppercase transition-all mt-2"
              >
                Close Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
