import React from 'react';
import { Movie, Show } from '../../types';
import { Badge } from './Badge';

export interface MovieCardProps {
  movie: Movie;
  shows?: Show[];
  onSelectMovie: (movie: Movie) => void;
  onBookShow?: (show: Show) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  shows = [],
  onSelectMovie,
  onBookShow,
}) => {
  const movieShows = shows.filter((s) => s.movieId === movie.id);

  return (
    <div
      onClick={() => onSelectMovie(movie)}
      className="group relative rounded-2xl bg-cv-surface border border-cv-border hover:border-cv-accent/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 shadow-card-subtle hover:shadow-[0_20px_40px_-10px_rgb(var(--cv-accent-rgb)/0.22)] cursor-pointer"
    >
      {/* Poster Media (Standard 3:4 Aspect Ratio) */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#181818]">
        <img
          alt={movie.title}
          src={movie.posterUrl}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <Badge variant="ink" size="sm">
            {movie.badges?.[0] || '70MM EXPERIENCE'}
          </Badge>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#141414]/90 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
          <span
            className="material-symbols-outlined text-[14px] text-cv-accent"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span>{movie.ratingLabel || movie.imdbRating.toFixed(1)}</span>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
          <span className="px-5 py-2.5 rounded-full bg-cv-accent hover:bg-cv-accent-hover text-white text-xs font-semibold uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            Select Seats &rarr;
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-cv-secondary">
            <span>{movie.genre}</span>
            <span>{movie.durationMins}m</span>
          </div>
          <h3 className="text-lg font-bold text-cv-primary group-hover:text-cv-accent transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-cv-muted line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Showtimes Pill Row if available */}
        {movieShows.length > 0 && onBookShow && (
          <div className="pt-3 border-t border-cv-border flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-cv-muted">
              Available Showtimes
            </span>
            <div
              className="flex flex-wrap items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {movieShows.slice(0, 3).map((show) => (
                <button
                  key={show.id}
                  onClick={() => onBookShow(show)}
                  className="group/btn px-2.5 py-1 rounded-md bg-cv-elevated hover:bg-cv-accent hover:text-white text-cv-secondary text-xs font-medium border border-cv-border hover:border-transparent transition-colors flex items-center gap-1"
                >
                  <span>{show.displayTime || show.startTime}</span>
                  {(show.screenFormat.includes('3D') || show.screenFormat.includes('IMAX') || show.screenFormat.includes('PLF')) && (
                    <span className="text-[9px] font-bold text-cv-accent group-hover/btn:text-white">
                      {show.screenFormat.includes('3D') ? '3D' : show.screenFormat.includes('IMAX') ? 'IMAX' : 'PLF'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
