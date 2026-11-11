import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/currency';

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
    <div className="w-full min-h-screen bg-[#050505] text-white pt-28 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#FF6500] font-semibold tracking-wider uppercase">
              Digital Ticket Wallet
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Bookings
            </h1>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#111111] border border-[#222222]">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#181818] text-white border border-[#222222] shadow-sm'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Upcoming Screenings
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-[#181818] text-white border border-[#222222] shadow-sm'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Past Archive
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <EmptyState
            icon="confirmation_number"
            title="No Bookings Found"
            description="You haven't reserved any cinema tickets yet. Explore now-showing blockbusters in 70mm and IMAX."
            actionLabel="Explore Movies"
            onAction={onBookMore}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-white/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 shadow-card-subtle transition-all"
              >
                {/* Film Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <img
                    alt={booking.movieTitle}
                    src={booking.moviePosterUrl}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop';
                    }}
                    className="w-16 h-22 object-cover rounded-xl border border-white/5 shrink-0"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand" size="sm">
                        {booking.screenFormat}
                      </Badge>
                      <span className="text-[11px] font-mono text-[#707070]">
                        REF: {booking.bookingReference}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {booking.movieTitle}
                    </h3>
                    <span className="text-xs text-[#A0A0A0]">
                      {booking.branchName} &bull; {booking.screenName}
                    </span>
                    <span className="text-xs text-[#FF6500] font-semibold">
                      {booking.date} at {booking.showTime}
                    </span>
                  </div>
                </div>

                {/* Seats and Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#222222]">
                  <div className="flex flex-col gap-1 sm:text-right md:text-right">
                    <span className="text-[11px] text-[#707070] uppercase font-semibold">
                      Seats ({booking.seatCodes.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:justify-end">
                      {booking.seatCodes.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded bg-[#181818] border border-[#222222] text-xs font-semibold text-white"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-white mt-1">
                      Total: {formatCurrency(booking.totalAmount, booking.city)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setSelectedTicketForQR(booking)}
                      variant="primary"
                      size="sm"
                      leftIcon={<span className="material-symbols-outlined text-[16px]">qr_code_2</span>}
                    >
                      View QR Pass
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QR Code Modal Dialog */}
        {selectedTicketForQR && (
          <Modal
            isOpen={Boolean(selectedTicketForQR)}
            onClose={() => setSelectedTicketForQR(null)}
            title="Auditorium Entry Pass"
            subtitle={selectedTicketForQR.movieTitle}
            maxWidth="sm"
          >
            <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
              <div className="p-4 rounded-2xl bg-white shadow-xl">
                {selectedTicketForQR.tickets?.[0]?.qrCodeDataUrl ? (
                  <img
                    alt="Entry Pass QR"
                    src={selectedTicketForQR.tickets[0].qrCodeDataUrl}
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 bg-black flex items-center justify-center text-white text-xs">
                    QR PASS ACTIVE
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold text-white tracking-widest">
                  {selectedTicketForQR.tickets?.[0]?.ticketNumber || selectedTicketForQR.bookingReference}
                </span>
                <span className="text-xs text-[#A0A0A0]">
                  {selectedTicketForQR.branchName} &bull; {selectedTicketForQR.screenName}
                </span>
                <span className="text-xs text-[#FF6500] font-semibold">
                  Seats: {selectedTicketForQR.seatCodes.join(', ')}
                </span>
              </div>

              <Button
                onClick={() => setSelectedTicketForQR(null)}
                variant="secondary"
                size="md"
                className="w-full mt-2"
              >
                Close Pass
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
