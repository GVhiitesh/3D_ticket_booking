import React from 'react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface ProfilePageProps {
  currentUser: { name: string; email: string; phone?: string };
  onLogout: () => void;
  onGoToBookings: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onLogout,
  onGoToBookings,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-28 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Profile Card Header */}
        <div className="p-8 rounded-3xl bg-[#111111] border border-[#222222] shadow-card-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#181818] border border-[#222222] text-[#FF6500] flex items-center justify-center text-3xl font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">
                  Titanium Member
                </Badge>
                <span className="text-xs text-[#707070]">ID: CNV-88219</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentUser.name}
              </h1>
              <span className="text-xs text-[#A0A0A0]">
                {currentUser.email} &bull; {currentUser.phone || '+44 7700 900123'}
              </span>
            </div>
          </div>

          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
          >
            Sign Out
          </Button>
        </div>

        {/* Membership Tier & Loyalty Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col gap-1.5 shadow-sm">
            <span className="text-xs text-[#707070] uppercase font-semibold">Screenings Attended</span>
            <span className="text-3xl font-bold text-white">14</span>
            <span className="text-[11px] text-[#A0A0A0]">Across 3 CINEVA Flagships</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col gap-1.5 shadow-sm">
            <span className="text-xs text-[#707070] uppercase font-semibold">Preferred Format</span>
            <span className="text-3xl font-bold text-[#FF6500]">IMAX 70mm</span>
            <span className="text-[11px] text-[#A0A0A0]">1.43:1 Harkness Silver Screen</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col gap-1.5 shadow-sm">
            <span className="text-xs text-[#707070] uppercase font-semibold">Patron Privilege</span>
            <span className="text-xl font-bold text-white">VIP Priority Hold</span>
            <span className="text-[11px] text-[#A0A0A0]">10-Min Extended Lock Window</span>
          </div>
        </div>

        {/* Quick Shortcut Card */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card-subtle">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-[#FF6500]">
              <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                View Your Digital Passes
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Access upcoming QR check-in tickets and your past cinema bookings.
              </p>
            </div>
          </div>
          <Button
            onClick={onGoToBookings}
            variant="primary"
            size="md"
          >
            Open Ticket Wallet &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
};
