import React from 'react';

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
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-20 px-5 md:px-12 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Profile Header */}
        <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff6500] to-[#b74600] flex items-center justify-center text-white text-3xl font-bold font-['Space_Grotesk'] shadow-[0_0_25px_rgba(255,101,0,0.5)]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff6500]/20 text-[#ff6500] text-[10px] font-bold uppercase tracking-wider font-['Geist']">
                  Titanium Member
                </span>
                <span className="text-xs text-[#aa8a7d] font-['Geist']">Club ID: CNV-88219</span>
              </div>
              <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                {currentUser.name}
              </h1>
              <span className="text-xs text-[#e3bfb1] font-['Geist']">
                {currentUser.email} &bull; {currentUser.phone || '+44 7700 900123'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-full bg-[#1c1b1b] hover:bg-[#2a2a2a] text-xs font-bold font-['Geist'] tracking-wider text-white border border-white/10 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Membership Tier & Loyalty Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col gap-2 shadow-lg">
            <span className="text-xs text-[#aa8a7d] font-['Geist'] uppercase">Screenings Attended</span>
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-white">14</span>
            <span className="text-[10px] text-[#ffb596] font-['Geist']">Across 3 CINEVA Flagships</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col gap-2 shadow-lg">
            <span className="text-xs text-[#aa8a7d] font-['Geist'] uppercase">Preferred Experience</span>
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#ff6500]">IMAX 70mm</span>
            <span className="text-[10px] text-[#e3bfb1] font-['Geist']">1.43:1 Harkness Silver Screen</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col gap-2 shadow-lg">
            <span className="text-xs text-[#aa8a7d] font-['Geist'] uppercase">Patron Privileges</span>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-white">VIP Priority Hold</span>
            <span className="text-[10px] text-[#ffb596] font-['Geist']">10-Min Extended Lock Window</span>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6500]/15 flex items-center justify-center text-[#ff6500]">
              <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white">
                View Your Digital Passes
              </h3>
              <p className="text-xs text-[#e3bfb1] font-['Geist']">
                Access upcoming QR check-in tickets and booking history.
              </p>
            </div>
          </div>
          <button
            onClick={onGoToBookings}
            className="px-5 py-2.5 rounded-full bg-[#ff6500] hover:bg-[#b74600] text-white text-xs font-bold uppercase transition-all shadow-md"
          >
            Open Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
