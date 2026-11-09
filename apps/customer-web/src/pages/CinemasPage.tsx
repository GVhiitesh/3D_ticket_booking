import React from 'react';
import { Branch, Show } from '../types';
import { Badge } from '../components/ui/Badge';

interface CinemasPageProps {
  branches: Branch[];
  shows: Show[];
  onSelectBranch: (branch: Branch) => void;
  onBookShow: (show: Show) => void;
}

export const CinemasPage: React.FC<CinemasPageProps> = ({
  branches,
  shows,
  onBookShow,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-28 pb-20 px-5 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="text-xs text-[#FF6500] font-semibold tracking-wider uppercase">
            Architectural Venues &amp; Auditoriums
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Our Cinema Locations
          </h1>
          <p className="text-sm text-[#A0A0A0] leading-relaxed">
            Flagship cinematic destinations equipped with Harkness curved silver screens, custom acoustic geometry, and climate-controlled luxury suites.
          </p>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => {
            const branchShows = shows.filter((s) => s.branchId === b.id);

            return (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-[#111111] border border-[#222222] hover:border-white/20 flex flex-col justify-between gap-6 shadow-card-subtle transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm">
                      {b.city}
                    </Badge>
                    <span className="text-xs text-[#707070]">
                      {b.screensCount} Auditoriums
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {b.name}
                  </h3>

                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    {b.address}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {b.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 rounded bg-[#181818] border border-[#222222] text-[#A0A0A0] text-[10px] font-semibold uppercase tracking-wider"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Section */}
                <div className="pt-4 border-t border-[#222222] flex flex-col gap-2.5">
                  <span className="text-[10px] font-semibold text-[#707070] uppercase tracking-wider">
                    Today's Screenings
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {branchShows.slice(0, 3).map((show) => (
                      <button
                        key={show.id}
                        onClick={() => onBookShow(show)}
                        className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#FF6500] hover:text-white border border-[#222222] text-[#FFFFFF] text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <span>{show.startTime}</span>
                        <span className="text-[10px] text-[#FF6500] group-hover:text-white uppercase">
                          {show.screenFormat.includes('IMAX') ? 'IMAX' : '70MM'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
