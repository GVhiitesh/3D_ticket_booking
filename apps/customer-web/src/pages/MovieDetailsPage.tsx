import React, { useState } from 'react';
import { Movie, Show } from '../types';

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
    <div className="w-full min-h-screen bg-[#080b12] text-white pt-20 pb-24">
      {/* Backdrop Hero Header */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-end px-5 md:px-12 pb-12 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl flex flex-col gap-4">
          <button
            onClick={onBack}
            className="self-start flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#ff5500] transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Discovery</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {movie.badges?.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full bg-[#111111]/80 backdrop-blur-md text-[#ffb596] font-['Geist'] text-xs font-bold uppercase tracking-wider"
              >
                {badge}
              </span>
            ))}
          </div>

          <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold uppercase tracking-tight text-white">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#e3bfb1] font-['Geist'] text-xs">
            <span>{movie.genre}</span>
            <span>&bull;</span>
            <span>{movie.durationMins}m</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-[#201f1f] text-white font-bold">{movie.certification}</span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-[#ffb596]">
              <span className="material-symbols-outlined text-[16px] text-[#ff6500]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <strong className="text-white font-semibold">{movie.imdbRating}</strong> / 10
            </span>
            <span>&bull;</span>
            <span>Dir. {movie.director}</span>
          </div>

          <p className="font-['Geist'] text-sm md:text-base text-[#e3bfb1] max-w-3xl leading-relaxed">
            {movie.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => onOpenTrailer(movie.trailerUrl)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1c1b1b] hover:bg-[#2a2a2a] text-white text-xs font-bold tracking-wider uppercase transition-all border border-white/10"
            >
              <span className="material-symbols-outlined text-[#ff6500] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Watch Trailer
            </button>
          </div>
        </div>
      </div>

      {/* Screenings & Date Selector Section */}
      <div className="w-full px-5 md:px-12 mt-12">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-xs text-[#ff6500] font-['Geist'] tracking-[0.25em] uppercase font-bold">
            Select Date &amp; Showtime
          </span>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
            Available Auditoriums
          </h2>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center px-6 py-3 rounded-2xl min-w-[120px] transition-all border ${
                selectedDate === d.date
                  ? 'bg-[#ff6500] text-white border-transparent shadow-[0_0_20px_rgba(255,101,0,0.4)]'
                  : 'bg-[#111111] text-[#e3bfb1] hover:text-white border-white/5'
              }`}
            >
              <span className="text-xs font-bold font-['Space_Grotesk']">{d.label}</span>
              <span className="text-[10px] font-['Geist'] opacity-80">{d.day}</span>
            </button>
          ))}
        </div>

        {/* Branch Showtimes List */}
        <div className="flex flex-col gap-6">
          {branches.map((branchName) => {
            const branchShows = movieShows.filter((s) => s.branchName === branchName);

            return (
              <div
                key={branchName}
                className="p-6 rounded-2xl bg-[#111111] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
              >
                <div className="flex flex-col gap-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ff6500] text-[18px]">location_on</span>
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">{branchName}</h3>
                  </div>
                  <span className="text-xs text-[#e3bfb1] font-['Geist'] pl-6">
                    {branchShows[0]?.city} &bull; {branchShows[0]?.audioSpec}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {branchShows.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => onSelectShow(show)}
                      className="group/show p-3 rounded-xl bg-[#1c1b1b] hover:bg-[#ff6500] transition-all duration-200 border border-white/5 hover:border-transparent flex flex-col items-center min-w-[110px] shadow-md"
                    >
                      <span className="text-sm font-bold text-white group-hover/show:text-white font-['Space_Grotesk']">
                        {show.startTime}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-[#ffb596] group-hover/show:text-white font-['Geist'] mt-0.5">
                        {show.screenFormat}
                      </span>
                      <span className="text-[10px] text-[#e3bfb1] group-hover/show:text-white/80 font-['Geist'] mt-1">
                        from £{show.pricing.STANDARD}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
