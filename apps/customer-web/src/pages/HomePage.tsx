import React, { useState, useEffect, useRef } from 'react';
import { Movie, Show, Branch } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MovieCard } from '../components/ui/MovieCard';

interface HomePageProps {
  movies: Movie[];
  shows: Show[];
  branches?: Branch[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onBookShow: (show: Show) => void;
  onOpenTrailer: (trailerUrl: string) => void;
}

const fallbackBranches: Branch[] = [
  {
    id: 'branch-west-end',
    name: 'CINEVA IMAX West End',
    city: 'London',
    address: '1 Leicester Square, West End, London WC2H 7NA',
    screensCount: 4,
    formats: ['70MM IMAX Laser', 'Dolby Cinema', 'Laser Grand'],
  },
  {
    id: 'branch-bengaluru',
    name: 'CINEVA Forum South',
    city: 'Bengaluru',
    address: 'Forum South Mall, Konanakunte Cross, Bengaluru, KA 560062',
    screensCount: 6,
    formats: ['IMAX Laser', 'Dolby Atmos', '4DX'],
  },
  {
    id: 'branch-mumbai',
    name: 'CINEVA Palladium',
    city: 'Mumbai',
    address: 'High Street Phoenix, Lower Parel, Mumbai, MH 400013',
    screensCount: 5,
    formats: ['70MM IMAX', 'Dolby Atmos', 'VIP Recliner Lounge'],
  },
  {
    id: 'branch-new-york',
    name: 'CINEVA Lincoln Square',
    city: 'New York',
    address: '1998 Broadway, Lincoln Square, New York, NY 10023',
    screensCount: 5,
    formats: ['70MM IMAX Laser', 'Dolby Cinema', 'Laser Ultra'],
  },
];

const availableCities = ['London', 'Bengaluru', 'Mumbai', 'New York'];

export const HomePage: React.FC<HomePageProps> = ({
  movies,
  shows,
  branches = fallbackBranches,
  selectedCity = 'London',
  onSelectCity,
  onSelectMovie,
  onBookShow,
  onOpenTrailer,
}) => {
  const [formatFilter, setFormatFilter] = useState<string>('All Formats');
  
  // Interactive Selector States
  const [activeCity, setActiveCity] = useState<string>(selectedCity);
  const [activeBranchId, setActiveBranchId] = useState<string>('branch-west-end');
  const [activeMovieId, setActiveMovieId] = useState<string>('movie-chronos');

  // Dropdown States
  const [cityOpen, setCityOpen] = useState(false);
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const [movieOpen, setMovieOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);
  const movieDropdownRef = useRef<HTMLDivElement>(null);

  // All branches available
  const allBranches = branches && branches.length > 0 ? branches : fallbackBranches;

  // Sync when selectedCity prop changes from universal Header
  useEffect(() => {
    if (selectedCity && selectedCity !== activeCity) {
      setActiveCity(selectedCity);
      const inCity = allBranches.filter(
        (b) => b.city.toLowerCase() === selectedCity.toLowerCase()
      );
      if (inCity.length > 0) {
        setActiveBranchId(inCity[0].id);
      }
    }
  }, [selectedCity, allBranches]);

  // Handle outside click for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(target)) {
        setCityOpen(false);
      }
      if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(target)) {
        setCinemaOpen(false);
      }
      if (movieDropdownRef.current && !movieDropdownRef.current.contains(target)) {
        setMovieOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter branches by current active city
  const cityBranches = allBranches.filter(
    (b) => b.city.toLowerCase() === activeCity.toLowerCase()
  );

  // Resolve currently active branch
  const activeBranch =
    cityBranches.find((b) => b.id === activeBranchId) ||
    cityBranches[0] ||
    allBranches[0];

  // Resolve currently active movie
  const activeMovie =
    movies.find((m) => m.id === activeMovieId) || movies[0] || {
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

  // Find matching shows for current (Branch + Movie)
  const matchingShows = shows.filter((s) => {
    const branchMatches = s.branchId === activeBranch?.id;
    const movieMatches = s.movieId === activeMovie?.id;
    return branchMatches && movieMatches;
  });

  // Handle City Change
  const handleCitySelect = (city: string) => {
    setActiveCity(city);
    setCityOpen(false);
    if (onSelectCity) onSelectCity(city);

    // Pick first branch of newly selected city
    const matchedBranches = allBranches.filter(
      (b) => b.city.toLowerCase() === city.toLowerCase()
    );
    if (matchedBranches.length > 0) {
      setActiveBranchId(matchedBranches[0].id);
    }
  };

  // Handle Cinema Change
  const handleBranchSelect = (branchId: string) => {
    setActiveBranchId(branchId);
    setCinemaOpen(false);
  };

  // Handle Movie Change
  const handleMovieSelect = (movieId: string) => {
    setActiveMovieId(movieId);
    setMovieOpen(false);
  };

  const premiereMovie: Movie = activeMovie || movies[0];

  const filteredMovies = movies.filter((m) => {
    if (formatFilter === 'All Formats') return true;
    if (formatFilter === 'IMAX 70mm') return m.badges?.some((b) => b.includes('IMAX'));
    if (formatFilter === 'Dolby Cinema') return m.badges?.some((b) => b.includes('DOLBY'));
    return true;
  });

  return (
    <div className="flex flex-col w-full bg-[#050505] text-[#FFFFFF] min-h-screen">
      {/* SECTION 1: CINEMATIC HERO PREMIERE */}
      <section className="relative w-full min-h-[80vh] flex flex-col justify-end px-5 md:px-12 pb-16 pt-24 overflow-hidden border-b border-[#222222]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/65 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-5">
          {/* Format Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" pulse>
              FEATURED ENGAGEMENT
            </Badge>
            <Badge variant="neutral">DOLBY ATMOS 64CH</Badge>
            <Badge variant="outline">DIR. {premiereMovie.director?.toUpperCase() || 'ELIAS THORNE'}</Badge>
          </div>

          {/* Title & Headline */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#FF6500] uppercase tracking-widest">
              Now Exhibiting &bull; {activeCity.toUpperCase()}
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white max-w-4xl">
              {premiereMovie.title}
            </h1>
          </div>

          {/* Metadata String */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A0A0A0]">
            <span className="text-white font-medium">{premiereMovie.genre}</span>
            <span>&bull;</span>
            <span>{premiereMovie.durationMins || 168} mins</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#222222] text-white font-semibold">
              {premiereMovie.certification || '12A'}
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

      {/* SECTION 2: INTERACTIVE THEATER, CITY & MOVIE SELECTOR CONSOLE */}
      <section className="w-full py-14 px-5 md:px-12 border-b border-[#222222] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6500] animate-pulse" />
                <span className="text-xs font-semibold text-[#FF6500] uppercase tracking-wider">
                  Fast Booking Console
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Find Screenings &amp; Reserve Seats
              </h2>
              <p className="text-sm text-[#A0A0A0]">
                Select your city, choose your premier cinema auditorium, and pick or change your film to view live sessions.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#707070]">
              <span className="material-symbols-outlined text-[#FF6500] text-[18px]">bolt</span>
              <span>Instant 3D Seat View &bull; 10-Min Reserved Hold</span>
            </div>
          </div>

          {/* 3 Step Interactive Selector Deck */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* STEP 1: CITY SELECTOR */}
            <div className="relative" ref={cityDropdownRef}>
              <div
                onClick={() => {
                  setCityOpen(!cityOpen);
                  setCinemaOpen(false);
                  setMovieOpen(false);
                }}
                className={`p-5 rounded-2xl bg-[#111111] border cursor-pointer transition-all hover:bg-[#151515] ${
                  cityOpen ? 'border-[#FF6500] ring-1 ring-[#FF6500]/50' : 'border-[#222222] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF6500]">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>Step 1 &bull; City</span>
                  </div>
                  <span className="material-symbols-outlined text-[#707070] text-[18px]">
                    {cityOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <div className="text-lg font-bold text-white tracking-tight">{activeCity}</div>
                <div className="text-xs text-[#707070] mt-1">
                  {cityBranches.length} {cityBranches.length === 1 ? 'Cinema' : 'Cinemas'} available
                </div>
              </div>

              {/* City Dropdown Menu */}
              {cityOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#111111] border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-30 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
                    Select Metropole
                  </div>
                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        activeCity.toLowerCase() === city.toLowerCase()
                          ? 'bg-[#181818] text-[#FF6500] font-semibold border border-[#FF6500]/30'
                          : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#FF6500]">location_city</span>
                        <span>{city}</span>
                      </span>
                      {activeCity.toLowerCase() === city.toLowerCase() && (
                        <span className="material-symbols-outlined text-[16px] text-[#FF6500]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 2: CINEMA / THEATER SELECTOR */}
            <div className="relative" ref={cinemaDropdownRef}>
              <div
                onClick={() => {
                  setCinemaOpen(!cinemaOpen);
                  setCityOpen(false);
                  setMovieOpen(false);
                }}
                className={`p-5 rounded-2xl bg-[#111111] border cursor-pointer transition-all hover:bg-[#151515] ${
                  cinemaOpen ? 'border-[#FF6500] ring-1 ring-[#FF6500]/50' : 'border-[#222222] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF6500]">
                    <span className="material-symbols-outlined text-[18px]">theaters</span>
                    <span>Step 2 &bull; Cinema</span>
                  </div>
                  <span className="material-symbols-outlined text-[#707070] text-[18px]">
                    {cinemaOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <div className="text-lg font-bold text-white tracking-tight truncate">
                  {activeBranch?.name || 'Select Cinema'}
                </div>
                <div className="text-xs text-[#707070] mt-1 truncate">
                  {activeBranch?.address || `${activeCity} Venue`}
                </div>
              </div>

              {/* Cinema Dropdown Menu */}
              {cinemaOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#111111] border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-30 animate-fade-in max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
                    Cinemas in {activeCity}
                  </div>
                  {cityBranches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => handleBranchSelect(branch.id)}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-all flex flex-col gap-1 mb-1 ${
                        activeBranch?.id === branch.id
                          ? 'bg-[#181818] text-[#FF6500] font-semibold border border-[#FF6500]/30'
                          : 'text-[#A0A0A0] hover:bg-[#181818] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{branch.name}</span>
                        {activeBranch?.id === branch.id && (
                          <span className="material-symbols-outlined text-[16px] text-[#FF6500]">check</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#707070] truncate">{branch.address}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#111111] border border-[#222222] text-[#A0A0A0]">
                          {branch.screensCount} Auditoriums
                        </span>
                        {branch.formats && branch.formats[0] && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF6500]/10 text-[#FF6500] border border-[#FF6500]/20 font-medium">
                            {branch.formats[0]}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 3: MOVIE SELECTOR (WITH CHANGE MOVIE ACTION) */}
            <div className="relative" ref={movieDropdownRef}>
              <div
                onClick={() => {
                  setMovieOpen(!movieOpen);
                  setCityOpen(false);
                  setCinemaOpen(false);
                }}
                className={`p-5 rounded-2xl bg-[#111111] border cursor-pointer transition-all hover:bg-[#151515] ${
                  movieOpen ? 'border-[#FF6500] ring-1 ring-[#FF6500]/50' : 'border-[#222222] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF6500]">
                    <span className="material-symbols-outlined text-[18px]">movie</span>
                    <span>Step 3 &bull; Movie</span>
                  </div>
                  <span className="text-[11px] text-[#FF6500] font-semibold underline underline-offset-2">
                    Change Movie
                  </span>
                </div>
                <div className="text-lg font-bold text-white tracking-tight truncate">
                  {activeMovie?.title || 'Select Movie'}
                </div>
                <div className="text-xs text-[#707070] mt-1 flex items-center gap-2">
                  <span>{activeMovie?.genre || 'Sci-Fi'}</span>
                  <span>&bull;</span>
                  <span className="text-[#FF6500] font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {activeMovie?.imdbRating}
                  </span>
                </div>
              </div>

              {/* Movie Dropdown Menu */}
              {movieOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#111111] border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-30 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
                    Select Movie to Change
                  </div>
                  {movies.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleMovieSelect(m.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 mb-1 ${
                        activeMovie?.id === m.id
                          ? 'bg-[#181818] border border-[#FF6500]/30'
                          : 'hover:bg-[#181818]'
                      }`}
                    >
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded-lg border border-[#222222] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold truncate ${
                              activeMovie?.id === m.id ? 'text-[#FF6500]' : 'text-white'
                            }`}
                          >
                            {m.title}
                          </span>
                          {activeMovie?.id === m.id && (
                            <span className="material-symbols-outlined text-[16px] text-[#FF6500]">check</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#707070] truncate mt-0.5">{m.genre}</span>
                        <div className="flex items-center gap-2 text-[10px] text-[#A0A0A0] mt-1">
                          <span>{m.durationMins} mins</span>
                          <span>&bull;</span>
                          <span className="text-[#FF6500] font-semibold">{m.imdbRating} Score</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE SHOWTIMES & 3D BOOKING TRAY */}
          <div className="rounded-3xl bg-[#111111] border border-[#222222] p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Movie Vignette */}
            <div className="w-full lg:w-80 flex-shrink-0 flex sm:flex-row lg:flex-col gap-5 items-start">
              <img
                src={activeMovie.posterUrl}
                alt={activeMovie.title}
                className="w-28 sm:w-36 lg:w-full h-auto max-h-56 lg:max-h-80 object-cover rounded-2xl border border-[#222222] shadow-md flex-shrink-0"
              />
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="brand" size="sm">
                    {activeMovie.certification || '12A'}
                  </Badge>
                  <span className="text-xs text-[#707070]">{activeMovie.durationMins} mins</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight uppercase">
                  {activeMovie.title}
                </h3>
                <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed">
                  {activeMovie.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <Button
                    onClick={() => onSelectMovie(activeMovie)}
                    variant="outline"
                    size="sm"
                    leftIcon={<span className="material-symbols-outlined text-[16px]">info</span>}
                  >
                    Movie Details
                  </Button>
                  <Button
                    onClick={() => onOpenTrailer(activeMovie.trailerUrl)}
                    variant="secondary"
                    size="sm"
                    leftIcon={<span className="material-symbols-outlined text-[16px]">play_arrow</span>}
                  >
                    Trailer
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Available Showtimes List */}
            <div className="flex-1 w-full flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#222222] gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Available Showtimes &bull; {activeBranch?.name}
                  </h4>
                  <span className="text-xs text-[#707070]">
                    Select any time slot to configure your seats in the 3D auditorium view
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#FF6500] px-3 py-1 rounded-full bg-[#FF6500]/10 border border-[#FF6500]/20 self-start sm:self-auto">
                  Today &bull; 2026-11-05
                </span>
              </div>

              {/* Showtimes Grid */}
              {matchingShows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingShows.map((show) => (
                    <div
                      key={show.id}
                      className="p-5 rounded-2xl bg-[#161616] border border-[#222222] hover:border-[#FF6500]/50 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-extrabold text-white group-hover:text-[#FF6500] transition-colors">
                            {show.startTime}
                          </span>
                          <span className="text-xs text-[#707070]">Ends {show.endTime}</span>
                        </div>
                        <Badge variant="brand" size="sm">
                          {show.screenFormat}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-white font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#FF6500]">chair</span>
                          {show.screenName}
                        </span>
                        <span className="text-[#707070] truncate">{show.audioSpec}</span>
                      </div>

                      <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#707070] uppercase tracking-wider block">
                            Starting from
                          </span>
                          <span className="text-sm font-bold text-white">
                            £{show.pricing.STANDARD.toFixed(2)}
                          </span>
                        </div>
                        <Button
                          onClick={() => onBookShow(show)}
                          variant="primary"
                          size="sm"
                          rightIcon={<span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                        >
                          Select Seats in 3D
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state for combination with helpful alternatives */
                <div className="py-12 px-6 rounded-2xl bg-[#161616] border border-[#222222] flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#181818] border border-[#222222] flex items-center justify-center text-[#FF6500]">
                    <span className="material-symbols-outlined text-[24px]">schedule</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-base font-bold text-white">
                      No sessions currently scheduled for {activeMovie.title} at this cinema
                    </h5>
                    <p className="text-xs text-[#A0A0A0] max-w-md">
                      Try selecting another movie from the dropdown above, or choose another cinema in {activeCity}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {movies
                      .filter((m) => m.id !== activeMovie.id)
                      .slice(0, 2)
                      .map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleMovieSelect(m.id)}
                          className="px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#222222] text-xs font-semibold text-white transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#FF6500]">movie</span>
                          <span>Switch to {m.title}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
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
