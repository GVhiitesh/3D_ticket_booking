import React, { useState } from 'react';
import { Movie, Show } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface MovieDetailsPageProps {
  movie: Movie;
  shows: Show[];
  onSelectShow: (show: Show) => void;
  onOpenTrailer: (url: string) => void;
  onBack: () => void;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movie,
  shows,
  onSelectShow,
  onOpenTrailer,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-05');

  const movieShows = shows.filter((s) => s.movieId === movie.id);
  const branches = Array.from(new Set(movieShows.map((s) => s.branchName)));

  const dates = [
    { label: 'Today', date: '2026-11-05', day: 'Thu, Nov 5' },
    { label: 'Tomorrow', date: '2026-11-06', day: 'Fri, Nov 6' },
    { label: 'Saturday', date: '2026-11-07', day: 'Sat, Nov 7' },
    { label: 'Sunday', date: '2026-11-08', day: 'Sun, Nov 8' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-20 pb-24">
      {/* Backdrop Hero Header */}
      <div className="relative w-full min-h-[55vh] flex flex-col justify-end px-5 md:px-12 pb-12 overflow-hidden border-b border-[#222222]">
        <div className="absolute inset-0 z-0">
          <img
            alt={movie.title}
            src={movie.backdropUrl || movie.posterUrl}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-4">
          <button
            onClick={onBack}
            className="self-start flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-white transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Films</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {movie.badges?.map((badge) => (
              <Badge key={badge} variant="brand" size="sm">
                {badge}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white max-w-3xl">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A0A0A0]">
            <span className="text-white font-medium">{movie.genre}</span>
            <span>&bull;</span>
            <span>{movie.durationMins}m</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#222222] text-white font-semibold">
              {movie.certification}
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-white font-semibold">
              <span
                className="material-symbols-outlined text-[16px] text-[#FF6500]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>{movie.imdbRating.toFixed(1)} / 10</span>
            </span>
            <span>&bull;</span>
            <span>Dir. {movie.director}</span>
          </div>

          <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
            {movie.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Button
              onClick={() => onOpenTrailer(movie.trailerUrl)}
              variant="secondary"
              size="md"
              leftIcon={<span className="material-symbols-outlined text-[18px]">play_arrow</span>}
            >
              Watch Official Trailer
            </Button>
          </div>
        </div>
      </div>

      {/* Screenings & Date Selector Section */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 mt-12 flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#FF6500] font-semibold tracking-wider uppercase">
            Curtain Call &amp; Showtimes
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Select Date &amp; Showtime
          </h2>
        </div>

        {/* Date Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center px-6 py-3 rounded-2xl min-w-[120px] transition-all border ${
                selectedDate === d.date
                  ? 'bg-[#181818] text-white border-[#FF6500]/50 shadow-sm'
                  : 'bg-[#111111] text-[#A0A0A0] hover:text-white border-[#222222]'
              }`}
            >
              <span className="text-xs font-semibold">{d.label}</span>
              <span className="text-[10px] text-[#707070]">{d.day}</span>
            </button>
          ))}
        </div>

        {/* Cinema Branch Showtime Cards */}
        <div className="flex flex-col gap-6">
          {branches.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] text-center text-sm text-[#A0A0A0]">
              No active showtimes currently scheduled for this date.
            </div>
          ) : (
            branches.map((branchName) => {
              const branchShows = movieShows.filter((s) => s.branchName === branchName);
              const branchCity = branchShows[0]?.city || 'London';

              return (
                <div
                  key={branchName}
                  className="p-6 rounded-2xl bg-[#111111] border border-[#222222] flex flex-col gap-5 shadow-card-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#222222]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-[#FF6500]">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{branchName}</h3>
                        <span className="text-xs text-[#707070]">{branchCity} &bull; Flagship Laser Venue</span>
                      </div>
                    </div>
                    <Badge variant="outline" size="sm">
                      E-TICKETS &amp; 3D SEAT VIEW
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {branchShows.map((show) => (
                      <button
                        key={show.id}
                        onClick={() => onSelectShow(show)}
                        className="group p-3 rounded-xl bg-[#181818] hover:bg-[#FF6500] hover:text-white border border-[#222222] hover:border-[#FF6500] text-left transition-all flex flex-col gap-1 min-w-[150px]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-white">
                            {show.startTime}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#FF6500] group-hover:text-white">
                            {show.screenFormat.includes('IMAX') ? 'IMAX' : '70MM'}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#707070] group-hover:text-white/80 line-clamp-1">
                          {show.screenName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
