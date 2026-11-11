import React, { useState, useEffect } from 'react';
import { Branch, Show } from '../types';
import { Badge } from '../components/ui/Badge';
import { AVAILABLE_CITIES, formatCurrency } from '../utils/currency';

interface CinemasPageProps {
  branches: Branch[];
  shows: Show[];
  selectedCity?: string;
  onSelectBranch: (branch: Branch) => void;
  onBookShow: (show: Show) => void;
}

export const CinemasPage: React.FC<CinemasPageProps> = ({
  branches,
  shows,
  selectedCity = 'Trichy',
  onBookShow,
}) => {
  const [activeCity, setActiveCity] = useState<string>(selectedCity);

  useEffect(() => {
    if (selectedCity) setActiveCity(selectedCity);
  }, [selectedCity]);

  const filteredBranches =
    activeCity === 'All'
      ? branches
      : branches.filter((b) => b.city.toLowerCase() === activeCity.toLowerCase());

  return (
    <div className="w-full min-h-screen bg-cv-bg text-cv-primary pt-28 pb-20 px-5 md:px-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header & City Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <span className="text-xs text-cv-accent font-semibold tracking-wider uppercase">
              BookMyShow Verified Venues &amp; Auditoriums
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cv-primary">
              Theatres in {activeCity === 'All' ? 'All Cities' : activeCity}
            </h1>
            <p className="text-sm text-cv-secondary leading-relaxed">
              Explore {filteredBranches.length} cinema properties equipped with 4K RGB Laser, Dolby Atmos, Dolby 7.1, and 3D projection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', ...AVAILABLE_CITIES].map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCity === city
                    ? 'bg-cv-elevated text-cv-primary font-semibold border border-cv-accent/50 shadow-sm'
                    : 'bg-cv-surface text-cv-secondary hover:text-cv-primary border border-cv-border'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((b) => {
            const branchShows = shows.filter((s) => s.branchId === b.id);

            return (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-cv-surface border border-cv-border hover:border-cv-accent/40 flex flex-col justify-between gap-6 shadow-card-subtle transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand" size="sm">
                      {b.city}
                    </Badge>
                    <span className="text-xs text-cv-muted">
                      {b.screensCount} {b.screensCount === 1 ? 'Screen' : 'Screens'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-cv-primary tracking-tight leading-snug">
                    {b.name}
                  </h3>

                  <p className="text-xs text-cv-secondary leading-relaxed">
                    {b.address}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {b.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 rounded bg-cv-elevated border border-cv-border text-cv-secondary text-[10px] font-semibold uppercase tracking-wider"
                      >
                        {fmt}
                      </span>
                    ))}
                    {b.facilities?.slice(0, 3).map((fac) => (
                      <span
                        key={fac}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-600/25 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Section */}
                <div className="pt-4 border-t border-cv-border flex flex-col gap-2.5">
                  <span className="text-[10px] font-semibold text-cv-muted uppercase tracking-wider">
                    {branchShows.length > 0 ? "Today's Screenings (Nov 11)" : 'Showtimes Schedule'}
                  </span>
                  {branchShows.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {branchShows.slice(0, 4).map((show) => (
                        <button
                          key={show.id}
                          onClick={() => onBookShow(show)}
                          className="group px-3 py-1.5 rounded-lg bg-cv-elevated hover:bg-cv-accent hover:text-white border border-cv-border hover:border-transparent text-cv-primary text-xs font-semibold transition-all flex items-center gap-1.5"
                          title={`${show.movieTitle} • ${show.screenName}`}
                        >
                          <span>{show.displayTime || show.startTime}</span>
                          <span className="text-[10px] text-cv-accent group-hover:text-white truncate max-w-[90px]">
                            {show.movieTitle}
                          </span>
                          <span className="text-[10px] text-cv-muted group-hover:text-white/90">
                            ({formatCurrency(show.pricing.STANDARD, show.city)})
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-cv-muted">
                      M-Ticket partner cinema &bull; Check back for upcoming releases.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
