import React, { useState } from 'react';
import { Movie, Show } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/currency';

interface MovieDetailsPageProps {
  movie: Movie;
  shows: Show[];
  onSelectShow: (show: Show) => void;
  onOpenTrailer: (url: string) => void;
  onBack: () => void;
  theme?: 'light' | 'dark';
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movie,
  shows,
  onSelectShow,
  onOpenTrailer,
  onBack,
  theme = 'dark',
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-11');
  const [cityFilter, setCityFilter] = useState<string>('Trichy');

  const allMovieShows = shows.filter((s) => s.movieId === movie.id);
  const availableCitiesForMovie = Array.from(new Set(allMovieShows.map((s) => s.city)));

  const effectiveCityFilter =
    availableCitiesForMovie.includes(cityFilter) || cityFilter === 'All'
      ? cityFilter
      : availableCitiesForMovie[0] || 'All';

  const filteredMovieShows = allMovieShows.filter((s) =>
    effectiveCityFilter === 'All' ? true : s.city === effectiveCityFilter
  );

  const branches = Array.from(new Set(filteredMovieShows.map((s) => s.branchName)));

  const dates = [
    { label: 'Today', date: '2026-11-11', day: 'Wed, Nov 11' },
    { label: 'Tomorrow', date: '2026-11-12', day: 'Thu, Nov 12' },
    { label: 'Friday', date: '2026-11-13', day: 'Fri, Nov 13' },
    { label: 'Saturday', date: '2026-11-14', day: 'Sat, Nov 14' },
  ];

  const isLight = theme === 'light';

  const formatDuration = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`;
  };

  return (
    <div className="w-full min-h-screen bg-cv-bg text-cv-primary pt-16 pb-24 transition-colors">
      {/* Backdrop Hero Header */}
      {isLight ? (
        <div className="w-full bg-cv-bg-secondary border-b border-cv-border px-5 md:px-12 py-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.src =
                  'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ramayana-et00451914-1793772172.jpg';
              }}
              className="w-44 sm:w-52 md:w-56 aspect-[2/3] object-cover rounded-2xl border border-cv-border shadow-elevated-xl shrink-0"
            />
            <div className="flex flex-col gap-4 flex-1 pt-1">
              <button
                onClick={onBack}
                className="self-start flex items-center gap-1.5 text-xs font-medium text-cv-secondary hover:text-cv-primary transition-colors mb-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back to Films</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {movie.badges?.slice(0, 2).map((badge, idx) => (
                  <Badge key={badge} variant={idx === 0 ? 'ink' : 'neutral'} size="sm">
                    {badge}
                  </Badge>
                ))}
                <Badge variant="brand-solid" size="sm">
                  {movie.language}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-cv-primary max-w-3xl">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-cv-secondary">
                <span className="text-cv-primary font-semibold">{movie.genre}</span>
                <span>&bull;</span>
                <span>{formatDuration(movie.durationMins)}</span>
                <span>&bull;</span>
                <span className="px-2 py-0.5 rounded bg-cv-elevated border border-cv-border text-cv-primary font-semibold">
                  {movie.certification}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-cv-primary font-semibold">
                  <span
                    className="material-symbols-outlined text-[16px] text-cv-accent"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>{movie.ratingLabel || `${movie.imdbRating.toFixed(1)} / 10`}</span>
                </span>
                <span>&bull;</span>
                <span>Released {movie.releaseDate}</span>
              </div>

              <p className="text-sm md:text-base text-cv-secondary max-w-2xl leading-relaxed">
                {movie.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  onClick={() => onOpenTrailer(movie.trailerUrl)}
                  variant="primary"
                  size="md"
                  leftIcon={<span className="material-symbols-outlined text-[18px]">play_arrow</span>}
                >
                  Watch Preview
                </Button>
                {movie.bookMyShowUrl && (
                  <a
                    href={movie.bookMyShowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-cv-surface hover:bg-cv-elevated border border-cv-border text-xs font-semibold text-cv-primary transition-colors flex items-center gap-1.5 shadow-card-subtle"
                  >
                    <span>BookMyShow Listing</span>
                    <span className="material-symbols-outlined text-[15px] text-cv-accent">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full min-h-[58vh] flex flex-col justify-end px-5 md:px-12 pb-12 pt-10 overflow-hidden border-b border-cv-border">
          <div className="absolute inset-0 z-0">
            <img
              alt={movie.title}
              src={movie.backdropUrl || movie.posterUrl}
              onError={(e) => {
                e.currentTarget.src =
                  'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ramayana-et00451914-1793772172.jpg';
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 items-start md:items-end">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="hidden md:block w-44 h-64 object-cover rounded-2xl border border-[#222222] shadow-2xl shrink-0"
            />
            <div className="flex flex-col gap-4 flex-1">
              <button
                onClick={onBack}
                className="self-start flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-white transition-colors mb-1"
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
                <Badge variant="neutral" size="sm">
                  {movie.language}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white max-w-3xl">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A0A0A0]">
                <span className="text-white font-medium">{movie.genre}</span>
                <span>&bull;</span>
                <span>{formatDuration(movie.durationMins)}</span>
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
                  <span>{movie.ratingLabel || `${movie.imdbRating.toFixed(1)} / 10`}</span>
                </span>
                <span>&bull;</span>
                <span>Released {movie.releaseDate}</span>
              </div>

              <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
                {movie.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  onClick={() => onOpenTrailer(movie.trailerUrl)}
                  variant="secondary"
                  size="md"
                  leftIcon={<span className="material-symbols-outlined text-[18px]">play_arrow</span>}
                >
                  Watch Preview
                </Button>
                {movie.bookMyShowUrl && (
                  <a
                    href={movie.bookMyShowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#222222] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>BookMyShow Listing</span>
                    <span className="material-symbols-outlined text-[15px] text-[#FF6500]">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cast & Crew Section */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 mt-10 flex flex-col gap-6 pb-10 border-b border-cv-border">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-cv-accent font-semibold tracking-wider uppercase">
            Verified Film Credits
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-cv-primary">Cast &amp; Crew</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cv-surface border border-cv-border shadow-card-subtle flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-cv-muted font-semibold">Director</span>
            <span className="text-sm font-bold text-cv-primary">{movie.director}</span>
          </div>
          <div className="p-4 rounded-2xl bg-cv-surface border border-cv-border shadow-card-subtle flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-cv-muted font-semibold">Music Director</span>
            <span className="text-sm font-bold text-cv-primary">{movie.musicDirector}</span>
          </div>
          <div className="p-4 rounded-2xl bg-cv-surface border border-cv-border shadow-card-subtle flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-cv-muted font-semibold">
              {movie.producer ? 'Producer' : 'Languages'}
            </span>
            <span className="text-sm font-bold text-cv-primary">{movie.producer || movie.language}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-[11px] uppercase tracking-wider text-cv-muted font-semibold">Lead Cast</span>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map((actor) => (
              <span
                key={actor}
                className="px-3.5 py-2 rounded-xl bg-cv-surface border border-cv-border shadow-card-subtle text-xs font-medium text-cv-primary flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-cv-elevated border border-cv-border flex items-center justify-center text-[10px] font-bold text-cv-accent">
                  {actor.charAt(0)}
                </span>
                <span>{actor}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Screenings & Date Selector Section */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 mt-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-cv-accent font-semibold tracking-wider uppercase">
              Curtain Call &amp; Showtimes
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-cv-primary">
              Select Theatre &amp; Showtime
            </h2>
          </div>

          {availableCitiesForMovie.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {['All', ...availableCitiesForMovie].map((c) => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    effectiveCityFilter === c
                      ? 'bg-cv-ink text-white border border-cv-ink font-semibold shadow-sm dark:bg-[#181818] dark:text-white dark:border-[#FF6500]/50'
                      : 'bg-cv-surface dark:bg-[#111111] text-cv-secondary hover:text-cv-primary border border-cv-border'
                  }`}
                >
                  {c === 'All' ? 'All Cities' : c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center px-6 py-3 rounded-2xl min-w-[120px] transition-all border ${
                selectedDate === d.date
                  ? 'bg-cv-ink text-white border-cv-ink shadow-sm dark:bg-[#181818] dark:text-white dark:border-[#FF6500]/50'
                  : 'bg-cv-surface dark:bg-[#111111] text-cv-secondary hover:text-cv-primary border-cv-border'
              }`}
            >
              <span className="text-xs font-semibold">{d.label}</span>
              <span className={`text-[10px] ${selectedDate === d.date ? 'text-white/75' : 'text-cv-muted'}`}>
                {d.day}
              </span>
            </button>
          ))}
        </div>

        {/* Cinema Branch Showtime Cards */}
        <div className="flex flex-col gap-6">
          {branches.length === 0 ? (
            <div className="p-8 rounded-2xl bg-cv-surface border border-cv-border text-center text-sm text-cv-secondary shadow-card-subtle">
              No active showtimes currently scheduled for this selection.
            </div>
          ) : (
            branches.map((branchName) => {
              const branchShows = filteredMovieShows.filter((s) => s.branchName === branchName);
              const branchCity = branchShows[0]?.city || 'Trichy';

              return (
                <div
                  key={branchName}
                  className="p-6 rounded-2xl bg-cv-surface border border-cv-border flex flex-col gap-5 shadow-card-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-cv-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cv-elevated border border-cv-border flex items-center justify-center text-cv-accent">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-cv-primary">{branchName}</h3>
                        <span className="text-xs text-cv-muted">
                          {branchCity} &bull; {branchShows[0]?.cancellable ? 'Ticket Cancellation Available' : 'M-Ticket Enabled'}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" size="sm">
                      2D SEAT MAP + 3D PREVIEW
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {branchShows.map((show) => (
                      <button
                        key={show.id}
                        onClick={() => onSelectShow(show)}
                        className="group p-3.5 rounded-xl bg-cv-elevated hover:bg-cv-accent hover:text-white border border-cv-border hover:border-cv-accent text-left transition-all flex flex-col gap-1 min-w-[175px]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-cv-primary group-hover:text-white">
                            {show.displayTime || show.startTime}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-cv-accent group-hover:text-white">
                            {formatCurrency(show.pricing.STANDARD, show.city)}
                          </span>
                        </div>
                        <span className="text-[11px] text-cv-secondary group-hover:text-white/90 line-clamp-1">
                          {show.screenName}
                        </span>
                        <span className="text-[10px] text-cv-muted group-hover:text-white/80">
                          {show.screenFormat} &bull; {show.audioSpec}
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
