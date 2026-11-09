import React, { useState } from 'react';
import { Movie } from '../types';

interface MoviesPageProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({ movies, onSelectMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');

  const genres = ['All', 'Sci-Fi / Thriller', 'Fantasy / Space', 'Noir Thriller'];
  const formats = ['All', 'IMAX 70mm', 'Dolby Cinema', '70mm Panavision'];

  const filtered = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || m.genre.includes(selectedGenre);
    const matchesFormat =
      selectedFormat === 'All' || m.badges.some((b) => b.toLowerCase().includes(selectedFormat.toLowerCase()));

    return matchesSearch && matchesGenre && matchesFormat;
  });

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-24 pb-20 px-5 md:px-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8 max-w-4xl">
        <span className="text-xs text-[#ff6500] font-['Geist'] tracking-[0.25em] uppercase font-bold">
          Film Catalog &amp; Formats
        </span>
        <h1 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-white">
          Discover Cinema
        </h1>
        <p className="text-sm text-[#e3bfb1] font-['Geist']">
          Masterpiece films projected in IMAX 70mm, Dolby Vision, and immersive spatial acoustics.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111111] border border-white/5 mb-10 shadow-lg">
        {/* Search Input */}
        <div className="flex-1 relative flex items-center">
          <span className="material-symbols-outlined text-[#aa8a7d] absolute left-3.5 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, director, or cast..."
            className="w-full bg-[#0a0a0a] text-white placeholder-[#aa8a7d] text-xs font-['Geist'] pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6500] transition-colors"
          />
        </div>

        {/* Genre Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-['Geist'] transition-all ${
                selectedGenre === g
                  ? 'bg-[#ff6500] text-white font-bold shadow-[0_0_12px_rgba(255,101,0,0.4)]'
                  : 'bg-[#1c1b1b] text-[#e3bfb1] hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="group rounded-2xl bg-[#111111] border border-white/5 overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,101,0,0.2)]"
          >
            {/* Poster */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#1c1b1b]">
              <img
                alt={movie.title}
                src={movie.posterUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded bg-[#050505]/85 backdrop-blur-md text-[#ffb596] font-['Geist'] text-[10px] uppercase font-bold tracking-wider">
                  {movie.badges?.[0] || 'PREMIERE'}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-[#050505]/85 backdrop-blur-md text-white font-['Geist'] text-xs font-semibold">
                <span className="material-symbols-outlined text-[#ff6500] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {movie.imdbRating}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-[#e3bfb1] font-['Geist']">
                  <span>{movie.genre}</span>
                  <span>{movie.durationMins} mins</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white group-hover:text-[#ffb596] transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-[#e3bfb1] font-['Geist'] line-clamp-2">
                  {movie.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-[#ffdbcd] font-['Geist']">
                  Dir. {movie.director}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff6500] group-hover:underline flex items-center gap-1">
                  View Screenings &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
