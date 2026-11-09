import React, { useState } from 'react';
import { Movie, Show } from '../types';
import { Auditorium3D } from '../components/Auditorium3D';

interface HomePageProps {
  movies: Movie[];
  shows: Show[];
  onSelectMovie: (movie: Movie) => void;
  onBookShow: (show: Show) => void;
  onOpenTrailer: (trailerUrl: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  movies,
  shows,
  onSelectMovie,
  onBookShow,
  onOpenTrailer,
}) => {
  const [formatFilter, setFormatFilter] = useState<string>('All Formats');
  const [previewSeats, setPreviewSeats] = useState<string[]>(['E-9', 'E-10']);

  const premiereMovie: Movie = movies[0] || {
    id: 'movie-chronos',
    title: 'CHRONOS: BEYOND TIME',
    slug: 'chronos-beyond-time',
    director: 'Elias Thorne',
    musicDirector: 'Hans Zimmer',
    cast: ['David Oyelowo', 'Rebecca Ferguson', 'Cillian Murphy'],
    genre: 'Sci-Fi / Thriller',
    language: 'English',
    durationMins: 168,
    certification: '12A',
    imdbRating: 9.8,
    releaseDate: '2026-10-24',
    status: 'NOW_SHOWING',
    badges: ['IMAX 70MM EXCLUSIVE', 'DOLBY ATMOS', '1.43:1 EXPANDED ASPECT RATIO'],
    description:
      "A team of deep-space cartographers enter an uncharted gravitational anomaly, where time dilates and the fabric of reality reveals humanity's origin.",
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    backdropUrl:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  };

  const filteredMovies = movies.filter((m) => {
    if (formatFilter === 'All Formats') return true;
    if (formatFilter === 'IMAX 70mm') return m.badges?.some((b) => b.includes('IMAX'));
    if (formatFilter === 'Dolby Cinema') return m.badges?.some((b) => b.includes('DOLBY'));
    return true;
  });

  return (
    <div className="flex flex-col w-full relative overflow-hidden bg-[#080b12] text-[#f1f5f9]">
      {/* AMBIENT BACKGROUND GLYPHS */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 font-['Space_Grotesk'] text-[260px] md:text-[380px] font-extrabold tracking-[0.25em] text-white/[0.015] leading-none whitespace-nowrap">
          C I N E V A
        </span>
        <span className="absolute top-[1650px] -right-24 font-['Space_Grotesk'] text-[280px] font-extrabold tracking-[0.2em] text-white/[0.012] leading-none whitespace-nowrap">
          I M A X
        </span>
        {/* Anamorphic ember blooms */}
        <div className="absolute top-0 right-1/4 w-[700px] h-[550px] bg-gradient-to-br from-[#ff6500]/20 via-[#b74600]/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[1100px] -left-48 w-[800px] h-[600px] bg-gradient-to-tr from-[#b74600]/15 via-[#ff6500]/5 to-transparent blur-[160px] rounded-full" />
      </div>

      {/* SECTION 1: HERO — MAIN PREMIERE ATTRACTION */}
      <section className="relative z-10 w-full min-h-[90vh] flex flex-col justify-end px-5 md:px-12 pb-12 pt-8 overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            alt={premiereMovie.title}
            src={premiereMovie.backdropUrl || premiereMovie.posterUrl}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-[#080b12]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b12] via-[#080b12]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080b12] to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-5xl flex flex-col gap-4">
          {/* Experiential badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111]/85 backdrop-blur-md text-[#ffb596] font-['Geist'] text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(255,101,0,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6500] animate-pulse" />
              IMAX 70MM EXCLUSIVE
            </span>
            <span className="px-3 py-1 rounded-full bg-[#111111]/70 backdrop-blur-md text-[#e3bfb1] font-['Geist'] text-xs tracking-wider uppercase">
              DOLBY ATMOS
            </span>
            <span className="px-3 py-1 rounded-full bg-[#111111]/70 backdrop-blur-md text-[#e3bfb1] font-['Geist'] text-xs tracking-wider uppercase">
              DIRECTED BY ELIAS THORNE
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-col">
            <span className="font-['Geist'] text-sm text-[#ff6500] tracking-[0.3em] uppercase font-bold">
              Premiere Screening
            </span>
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase max-w-4xl drop-shadow-2xl">
              CHRONOS: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffdbcd] to-[#ff6500]">BEYOND TIME</span>
            </h1>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#e3bfb1] font-['Geist'] text-xs">
            <span className="text-white font-medium">{premiereMovie.genre}</span>
            <span>&bull;</span>
            <span>2h 48m</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-[#201f1f] text-white font-bold">{premiereMovie.certification}</span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-[#ffb596]">
              <span className="material-symbols-outlined text-[16px] text-[#ff6500]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <strong className="text-white font-semibold">9.8</strong> / 10 IMDb Critic Score
            </span>
          </div>

          {/* Synopsis */}
          <p className="font-['Geist'] text-sm md:text-base text-[#e3bfb1] max-w-2xl line-clamp-3">
            {premiereMovie.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectMovie(premiereMovie)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#ff6500] to-[#b74600] hover:from-[#ff771a] hover:to-[#c94f00] text-white font-['Geist'] text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_12px_32px_-6px_rgba(255,101,0,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              Book Tickets
            </button>
            <button
              type="button"
              onClick={() => onOpenTrailer(premiereMovie.trailerUrl)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111111]/80 hover:bg-[#1f1f1f]/90 backdrop-blur-xl text-white font-['Geist'] text-sm tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/10"
            >
              <span className="material-symbols-outlined text-[#ff6500] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Watch 4K Trailer
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE 3D AUDITORIUM FLOATING EXPERIENCE */}
      <section className="relative z-10 w-full px-5 md:px-12 py-12" id="seat-selector">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ff6500] animate-ping" />
              <span className="font-['Geist'] text-xs text-[#ff6500] tracking-[0.25em] uppercase font-bold">
                Live Dimensional Viewport
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white tracking-tight">
              Auditorium 1 — Ultra IMAX Laser
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[#e3bfb1] text-xs font-['Geist']">
            <span className="material-symbols-outlined text-[#ff6500] text-[18px]">view_in_ar</span>
            <span>Interactive 3D Seating &amp; Acoustic Mapping</span>
          </div>
        </div>

        {/* 3D Auditorium Floating Container */}
        <div className="relative w-full rounded-2xl bg-[#0c0c0c]/85 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden">
          {/* Top Specs Bar */}
          <div className="w-full px-4 md:px-6 py-3 bg-[#111111]/90 flex flex-wrap items-center justify-between gap-4 text-xs font-['Geist']">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2a2a2a] text-[#ffb596] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6500]" /> LIVE PREVIEW
              </span>
              <span className="text-white font-medium">Curved 70ft Harkness Silver Screen</span>
            </div>
            <div className="flex items-center gap-4 text-[#e3bfb1]">
              <span className="hidden sm:inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#ff6500]">surround_sound</span> Dolby Atmos 128-channel
              </span>
              <span className="hidden md:inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#ff6500]">airline_seat_recline_extra</span> Italian Saddle Leather
              </span>
              <span className="inline-flex items-center gap-1 text-white">
                <span className="material-symbols-outlined text-[16px] text-[#ff6500]">thermostat</span> 21.5°C Climate Controlled
              </span>
            </div>
          </div>

          {/* Embedded 3D Scene Viewport */}
          <div className="relative w-full h-[480px] md:h-[540px] bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#0c0c0c]">
            <Auditorium3D
              seats={[]}
              selectedSeatCodes={previewSeats}
              onToggleSeat={(seatCode) => {
                setPreviewSeats((prev) =>
                  prev.includes(seatCode) ? prev.filter((s) => s !== seatCode) : [...prev, seatCode]
                );
              }}
              interactive={true}
            />

            {/* Floating Legend Pill */}
            <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 px-4 py-2 rounded-full bg-[#0e1015]/90 backdrop-blur-xl shadow-lg text-xs font-['Geist'] border border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff6e00] shadow-[0_0_8px_#ff6e00]" />
                <span className="text-white font-semibold">Selected (E-9, E-10)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8a92a3]" />
                <span className="text-[#e3bfb1]">Available (£28.00)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#282b33] border border-white/10" />
                <span className="text-[#e3bfb1]/50">Occupied</span>
              </div>
            </div>
          </div>

          {/* Action Confirmation Dock */}
          <div className="w-full px-5 md:px-6 py-4 bg-[#111111] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#ff6500]/15 flex items-center justify-center text-[#ff6500]">
                <span className="material-symbols-outlined text-[22px]">chair</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-['Geist'] font-semibold text-white text-sm">
                    Row E &bull; Seats {previewSeats.join(' & ')}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#b74600]/30 text-[#ffdbcd] text-[10px] font-bold uppercase">
                    VIP Recliner
                  </span>
                </div>
                <span className="text-xs text-[#e3bfb1]">Optimal geometric center &bull; 100% Sightline Purity</span>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className="text-[10px] text-[#e3bfb1] uppercase tracking-wider font-['Geist']">Subtotal</div>
                <div className="font-['Space_Grotesk'] text-xl text-white font-bold">
                  £{(previewSeats.length * 28).toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => {
                  const targetShow = shows.find((s) => s.movieId === premiereMovie.id) || shows[0];
                  if (targetShow) onBookShow(targetShow);
                }}
                className="px-6 py-3 rounded-full bg-[#ff6500] hover:bg-[#b74600] text-white font-['Geist'] text-xs uppercase tracking-wider font-bold transition-all shadow-[0_6px_20px_rgba(255,101,0,0.4)] hover:scale-105 active:scale-95"
              >
                Confirm Seats
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NOW SHOWING FILM REPERTOIRE */}
      <section className="relative z-10 w-full px-5 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="font-['Geist'] text-xs text-[#ff6500] tracking-[0.25em] uppercase font-bold">
              The Repertoire
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white tracking-tight">Now Showing</h2>
            <p className="font-['Geist'] text-sm text-[#e3bfb1]">
              Handpicked for maximum sensory immersion in 70mm and IMAX Laser.
            </p>
          </div>

          {/* Format Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {['All Formats', 'IMAX 70mm', 'Dolby Cinema'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-4 py-2 rounded-full font-['Geist'] text-xs font-semibold transition-all ${
                  formatFilter === fmt
                    ? 'bg-[#ff6500] text-white shadow-[0_0_15px_rgba(255,101,0,0.3)]'
                    : 'bg-[#111111] hover:bg-[#201f1f] text-[#e3bfb1] hover:text-white border border-white/5'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group relative rounded-2xl bg-[#111111] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(255,101,0,0.25)] border border-white/5 cursor-pointer"
              onClick={() => onSelectMovie(movie)}
            >
              {/* Poster */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#201f1f]">
                <img
                  alt={movie.title}
                  src={movie.posterUrl}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#050505]/80 backdrop-blur-md text-[#ffb596] font-['Geist'] text-[10px] tracking-widest uppercase font-bold">
                    {movie.badges?.[0] || '70MM EXPERIENCE'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-[#050505]/80 backdrop-blur-md text-white font-['Geist'] text-xs">
                  <span className="material-symbols-outlined text-[14px] text-[#ff6500]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{movie.imdbRating}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <span className="px-6 py-3 rounded-full bg-[#ff6500] text-white font-['Geist'] text-xs tracking-wider uppercase font-bold shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    Select Seats
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-['Geist'] text-xs text-[#e3bfb1] uppercase tracking-wider">
                    {movie.genre} &bull; {movie.durationMins}m
                  </span>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white group-hover:text-[#ffb596] transition-colors">
                    {movie.title}
                  </h3>
                </div>

                {/* Showtimes */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                  <span className="font-['Geist'] text-[10px] text-[#e3bfb1] uppercase tracking-widest font-semibold">
                    Select Showtime
                  </span>
                  <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {shows
                      .filter((s) => s.movieId === movie.id)
                      .slice(0, 3)
                      .map((show) => (
                        <button
                          key={show.id}
                          onClick={() => onBookShow(show)}
                          className="px-3 py-1.5 rounded-lg bg-[#201f1f] hover:bg-[#ff6500] hover:text-white text-white font-['Geist'] text-xs transition-colors flex items-center gap-1"
                        >
                          <span>{show.startTime}</span>
                          {show.screenFormat.includes('IMAX') && (
                            <span className="text-[9px] uppercase font-bold text-[#ffb596]">IMAX</span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
