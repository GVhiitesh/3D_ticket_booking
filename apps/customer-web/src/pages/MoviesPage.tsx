import React, { useState } from 'react';
import { Movie } from '../types';
import { MovieCard } from '../components/ui/MovieCard';
import { EmptyState } from '../components/ui/EmptyState';

interface MoviesPageProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({ movies, onSelectMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');

  const genres = ['All', 'Action', 'Thriller', 'Drama', 'Mythological', 'Comedy', 'Sports', 'Fantasy'];
  const formats = ['All', '3D', '2D', 'Dolby', '4DX'];

  const filtered = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = selectedGenre === 'All' || m.genre.includes(selectedGenre);
    const matchesFormat =
      selectedFormat === 'All' ||
      m.badges.some((b) => b.toLowerCase().includes(selectedFormat.toLowerCase()));

    return matchesSearch && matchesGenre && matchesFormat;
  });

  return (
    <div className="w-full min-h-screen bg-cv-bg text-cv-primary pt-28 pb-20 px-5 md:px-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="text-xs text-cv-accent font-semibold tracking-wider uppercase">
            Film Discovery &amp; Exhibition Formats
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-cv-primary">
            Discover Cinema
          </h1>
          <p className="text-sm text-cv-secondary leading-relaxed">
            Theatrical catalog projected in authentic 70mm film stock, IMAX Dual Laser, and 64-channel spatial sound.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-cv-surface border border-cv-border shadow-card-subtle">
          {/* Search Field */}
          <div className="relative flex items-center flex-1">
            <span className="material-symbols-outlined text-cv-muted absolute left-3.5 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, or cast..."
              className="w-full bg-cv-bg-subtle text-cv-primary placeholder-cv-muted text-sm pl-10 pr-4 py-2.5 rounded-xl border border-cv-border focus:outline-none focus:border-cv-accent transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-cv-muted hover:text-cv-primary text-xs"
              >
                &times;
              </button>
            )}
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedGenre === g
                    ? 'bg-cv-elevated text-cv-primary font-semibold border border-cv-accent/50 shadow-sm'
                    : 'bg-cv-card text-cv-secondary hover:text-cv-primary border border-cv-border'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-cv-muted">
          <span>Showing {filtered.length} of {movies.length} films</span>
          {(searchQuery || selectedGenre !== 'All' || selectedFormat !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedFormat('All');
              }}
              className="text-cv-accent hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Movies Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="movie"
            title="No Films Found"
            description="No screenings matched your search filters. Try adjusting your query or genre selection."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setSelectedFormat('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
