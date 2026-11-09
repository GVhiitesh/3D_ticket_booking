import React, { useState } from 'react';
import { Movie, Show } from '../types';
import { Auditorium3D } from '../components/Auditorium3D';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MovieCard } from '../components/ui/MovieCard';

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
    <div className="flex flex-col w-full bg-[#050505] text-[#FFFFFF] min-h-screen">
      {/* SECTION 1: CINEMATIC HERO PREMIERE */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-end px-5 md:px-12 pb-16 pt-24 overflow-hidden border-b border-[#222222]">
        {/* Backdrop Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img
            alt={premiereMovie.title}
            src={premiereMovie.backdropUrl || premiereMovie.posterUrl}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop';
            }}
            className="w-full h-full object-cover object-center scale-[1.01] transform transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-5">
          {/* Format Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" pulse>
              IMAX 70MM EXCLUSIVE
            </Badge>
            <Badge variant="neutral">DOLBY ATMOS 64CH</Badge>
            <Badge variant="outline">DIR. {premiereMovie.director.toUpperCase()}</Badge>
          </div>

          {/* Title & Headline */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#FF6500] uppercase tracking-widest">
              Premiere Theatrical Engagement
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white max-w-4xl">
              {premiereMovie.title}
            </h1>
          </div>

          {/* Metadata String */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A0A0A0]">
            <span className="text-white font-medium">{premiereMovie.genre}</span>
            <span>&bull;</span>
            <span>2h 48m</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#222222] text-white font-semibold">
              {premiereMovie.certification}
            </span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1 text-white font-semibold">
              <span
                className="material-symbols-outlined text-[16px] text-[#FF6500]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>{premiereMovie.imdbRating} / 10 IMDb Critic Score</span>
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl line-clamp-3 leading-relaxed">
            {premiereMovie.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Button
              onClick={() => onSelectMovie(premiereMovie)}
              variant="primary"
              size="lg"
              leftIcon={<span className="material-symbols-outlined text-[20px]">confirmation_number</span>}
            >
              Book Tickets
            </Button>
            <Button
              onClick={() => onOpenTrailer(premiereMovie.trailerUrl)}
              variant="secondary"
              size="lg"
              leftIcon={<span className="material-symbols-outlined text-[20px]">play_arrow</span>}
            >
              Watch 4K Trailer
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE 3D AUDITORIUM THEATRICAL SHOWCASE */}
      <section className="w-full py-16 px-5 md:px-12 border-b border-[#222222]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6500] animate-pulse" />
                <span className="text-xs font-semibold text-[#FF6500] uppercase tracking-wider">
                  Theatrical Architecture
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Auditorium 1 — Ultra IMAX Laser
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
              <span className="material-symbols-outlined text-[#FF6500] text-[18px]">view_in_ar</span>
              <span>Full Interactive 3D Stadium Elevation &amp; Sightlines</span>
            </div>
          </div>

          {/* 3D Viewport Frame */}
          <div className="rounded-3xl bg-[#111111] border border-[#222222] overflow-hidden shadow-card-subtle flex flex-col">
            {/* Top Specs Bar */}
            <div className="w-full px-5 py-3.5 bg-[#181818] border-b border-[#222222] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Badge variant="brand" size="sm" pulse>
                  LIVE PREVIEW
                </Badge>
                <span className="text-white font-medium">Curved 70ft Harkness Silver Screen</span>
              </div>
              <div className="flex items-center gap-4 text-[#A0A0A0]">
                <span className="hidden sm:inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#FF6500]">surround_sound</span>
                  <span>Dolby Atmos 128-channel</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-white">
                  <span className="material-symbols-outlined text-[16px] text-[#FF6500]">thermostat</span>
                  <span>21.5°C Climate Controlled</span>
                </span>
              </div>
            </div>

            {/* Embedded Three.js Canvas */}
            <div className="relative w-full h-[460px] md:h-[520px] bg-[#050505]">
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
              <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 px-4 py-2 rounded-full bg-[#111111]/90 backdrop-blur-md border border-[#222222] shadow-lg text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6500] shadow-[0_0_8px_#FF6500]" />
                  <span className="text-white font-medium">Selected ({previewSeats.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#707070]" />
                  <span className="text-[#A0A0A0]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#222222]" />
                  <span className="text-[#707070]">Occupied</span>
                </div>
              </div>
            </div>

            {/* Bottom Dock */}
            <div className="w-full px-6 py-4 bg-[#141414] border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#222222] flex items-center justify-center text-[#FF6500]">
                  <span className="material-symbols-outlined text-[20px]">airline_seat_recline_extra</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    Row E &bull; Seats {previewSeats.join(' & ')}
                  </span>
                  <span className="text-xs text-[#707070]">
                    Prime Optical Focus &bull; 100% Sightline Purity
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-[#707070] uppercase tracking-wider block">
                    Estimated Subtotal
                  </span>
                  <span className="text-lg font-bold text-white">
                    £{(previewSeats.length * 28).toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    const targetShow = shows.find((s) => s.movieId === premiereMovie.id) || shows[0];
                    if (targetShow) onBookShow(targetShow);
                  }}
                  variant="primary"
                  size="md"
                >
                  Confirm Seats &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NOW SHOWING REPERTOIRE */}
      <section className="w-full py-16 px-5 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-xl">
              <span className="text-xs font-semibold text-[#FF6500] uppercase tracking-wider">
                Now Showing
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white">The Repertoire</h2>
              <p className="text-sm text-[#A0A0A0]">
                Curated masterpieces projected in IMAX 70mm, Dolby Vision, and 64-channel spatial sound.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All Formats', 'IMAX 70mm', 'Dolby Cinema'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    formatFilter === fmt
                      ? 'bg-[#181818] text-white font-semibold border border-[#FF6500]/50 shadow-sm'
                      : 'bg-[#111111] text-[#A0A0A0] hover:text-white border border-[#222222]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                shows={shows}
                onSelectMovie={onSelectMovie}
                onBookShow={onBookShow}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
