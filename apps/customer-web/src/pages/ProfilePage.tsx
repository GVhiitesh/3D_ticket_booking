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
    <div className="w-full min-h-screen bg-cv-bg text-cv-primary pt-28 pb-20 px-5 md:px-12 flex justify-center transition-colors duration-200">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Profile Card Header */}
        <div className="p-8 rounded-3xl bg-cv-surface border border-cv-border shadow-card-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cv-accent text-white flex items-center justify-center text-3xl font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">
                  Titanium Member
                </Badge>
                <span className="text-xs text-cv-muted">ID: CNV-88219</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-cv-primary tracking-tight">
                {currentUser.name}
              </h1>
              <span className="text-xs text-cv-secondary">
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
          <div className="p-6 rounded-2xl bg-cv-surface border border-cv-border flex flex-col gap-1.5 shadow-sm">
            <span className="text-xs text-cv-muted uppercase font-semibold">Screenings Attended</span>
            <span className="text-3xl font-bold text-cv-primary">14</span>
            <span className="text-[11px] text-cv-secondary">Across 3 CINEVA Flagships</span>
          </div>

          <div className="p-6 rounded-2xl bg-cv-surface border border-cv-border flex flex-col gap-1.5 shadow-sm">
            <span className="text-xs text-cv-muted uppercase font-semibold">Preferred Format</span>
            <span className="text-3xl font-bold text-cv-accent">IMAX 70mm</span>
            <span className="text-[11px] text-cv-secondary">1.43:1 Harkness Silver Screen</span>
          </div>

          <div className="p-6 rounded-2xl bg-cv-surface border border-cv-border flex flex-col gap-1.5 shadow-sm">
            <span className="text-xs text-cv-muted uppercase font-semibold">Patron Privilege</span>
            <span className="text-xl font-bold text-cv-primary">VIP Priority Hold</span>
            <span className="text-[11px] text-cv-secondary">10-Min Extended Lock Window</span>
          </div>
        </div>

        {/* Quick Shortcut Card */}
        <div className="p-6 rounded-2xl bg-cv-surface border border-cv-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card-subtle">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cv-elevated border border-cv-border flex items-center justify-center text-cv-accent">
              <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-cv-primary">
                View Your Digital Passes
              </h3>
              <p className="text-xs text-cv-secondary">
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
