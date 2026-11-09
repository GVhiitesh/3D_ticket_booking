import React from 'react';
import { Branch, Show } from '../types';

interface CinemasPageProps {
  branches: Branch[];
  shows: Show[];
  onSelectBranch: (branch: Branch) => void;
  onBookShow: (show: Show) => void;
}

export const CinemasPage: React.FC<CinemasPageProps> = ({
  branches,
  shows,
  onSelectBranch,
  onBookShow,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-20 px-5 md:px-12">
      <div className="flex flex-col gap-2 mb-8 max-w-4xl">
        <span className="text-xs text-[#ff6500] font-['Geist'] tracking-[0.25em] uppercase font-bold">
          Architectural Auditoriums
        </span>
        <h1 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
          Our Cinema Locations
        </h1>
        <p className="text-sm text-[#e3bfb1] font-['Geist']">
          Flagship multiplex destinations equipped with laser projection, bespoke acoustic tuning, and luxury recliners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {branches.map((b) => {
          const branchShows = shows.filter((s) => s.branchId === b.id);

          return (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col justify-between gap-6 shadow-xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ff6500]/15 text-[#ff6500] text-xs font-bold font-['Geist'] uppercase tracking-wider">
                    {b.city}
                  </span>
                  <span className="text-xs text-[#e3bfb1] font-['Geist']">
                    {b.screensCount} Auditoriums
                  </span>
                </div>

                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                  {b.name}
                </h3>

                <p className="text-xs text-[#e3bfb1] font-['Geist'] leading-relaxed">
                  {b.address}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {b.formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2.5 py-1 rounded-md bg-[#1c1b1b] text-[#ffb596] text-[10px] font-bold uppercase tracking-wider font-['Geist']"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#e3bfb1] uppercase tracking-wider font-['Geist']">
                  Today's Featured Shows
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {branchShows.slice(0, 3).map((show) => (
                    <button
                      key={show.id}
                      onClick={() => onBookShow(show)}
                      className="px-3 py-1.5 rounded-lg bg-[#201f1f] hover:bg-[#ff6500] text-white text-xs font-bold transition-all"
                    >
                      {show.startTime} &bull; {show.screenFormat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
