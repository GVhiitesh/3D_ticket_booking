import React, { useState, useEffect, useRef } from 'react';
import { Movie, Show, Branch } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MovieCard } from '../components/ui/MovieCard';
import { AVAILABLE_CITIES, formatCurrency } from '../utils/currency';

interface HomePageProps {
  movies: Movie[];
  shows: Show[];
  branches?: Branch[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  onSelectMovie: (movie: Movie) => void;
  onBookShow: (show: Show) => void;
  onOpenTrailer: (trailerUrl: string) => void;
  theme?: 'light' | 'dark';
}

const fallbackBranches: Branch[] = [
  {
    id: 'branch-trichy-la-maris',
    name: 'LA CINEMA: MARIS, TRICHY',
    city: 'Trichy',
    address: 'Fort Station Road, Tiruchirappalli, Tamil Nadu 620002',
    screensCount: 2,
    formats: ['RGB Laser 4K Atmos', '4K Laser Dolby Atmos', '3D'],
  },
  {
    id: 'branch-trichy-mariyam',
    name: 'Mariyam Cinemas A/C 4K: Trichy',
    city: 'Trichy',
    address: 'Trichy Main Road, Samayapuram, Tiruchirappalli, Tamil Nadu 621112',
    screensCount: 2,
    formats: ['RGB 4K Laser Atmos', 'Dolby 7.1'],
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
    id: 'branch-west-end',
    name: 'CINEVA IMAX West End',
    city: 'London',
    address: '1 Leicester Square, West End, London WC2H 7NA',
    screensCount: 4,
    formats: ['70MM IMAX Laser', 'Dolby Cinema', 'Laser Grand'],
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

const fallbackMovie: Movie = {
  id: 'movie-ramayana',
  title: 'Ramayana',
  slug: 'ramayana',
  director: 'Nitesh Tiwari',
  musicDirector: 'A. R. Rahman & Hans Zimmer',
  producer: 'Namit Malhotra, Yash',
  cast: ['Ranbir Kapoor (Rama)', 'Yash (Ravana)', 'Sai Pallavi (Sita)', 'Ravie Dubey (Lakshman)', 'Sunny Deol (Hanuman)'],
  genre: 'Action / Adventure / Drama / Mythological',
  language: 'Hindi, Tamil',
  durationMins: 195,
  certification: 'U',
  imdbRating: 9.3,
  ratingLabel: '9.3/10 (254K+ Votes)',
  releaseDate: '2026-11-05',
  status: 'NOW_SHOWING',
  badges: ['3D', 'DOLBY ATMOS', '4DX 3D', 'EPIQ 3D'],
  description:
    'The immortal story of Rama and Ravana defined a culture and moved generations. It now arrives as a cinematic landmark of our time. Ramayana is a timeless saga reborn through the lens of modern Indian cinema.',
  posterUrl:
    'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/ramayana-et00451914-1793772172.jpg',
  backdropUrl:
    'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ramayana-et00451914-1793772172.jpg',
  trailerUrl: 'https://in.bookmyshow.com/movies/trichy/ramayana/ET00451914',
};

export const HomePage: React.FC<HomePageProps> = ({
  movies,
  shows,
  branches = fallbackBranches,
  selectedCity = 'Trichy',
  onSelectCity,
  onSelectMovie,
  onBookShow,
  onOpenTrailer,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [formatFilter, setFormatFilter] = useState<string>('All Formats');

  // Interactive Selector States
  const [activeCity, setActiveCity] = useState<string>(selectedCity);
  const [activeBranchId, setActiveBranchId] = useState<string>('branch-trichy-la-maris');
  const [activeMovieId, setActiveMovieId] = useState<string>('movie-ramayana');

  // Dropdown States
  const [cityOpen, setCityOpen] = useState(false);
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const [movieOpen, setMovieOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cinemaDropdownRef = useRef<HTMLDivElement>(null);
  const movieDropdownRef = useRef<HTMLDivElement>(null);

  const allBranches = branches && branches.length > 0 ? branches : fallbackBranches;

  // Keep activeCity in sync when header city changes
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

  // Ensure activeMovieId matches loaded movies
  useEffect(() => {
    if (movies.length > 0 && !movies.some((m) => m.id === activeMovieId)) {
      setActiveMovieId(movies[0].id);
    }
  }, [movies, activeMovieId]);

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

  const activeBranch =
    cityBranches.find((b) => b.id === activeBranchId) ||
    cityBranches[0] ||
    allBranches[0];

  const activeMovie =
    movies.find((m) => m.id === activeMovieId) || movies[0] || fallbackMovie;

  // Matching shows for (activeBranch + activeMovie)
  const matchingShows = shows.filter(
    (s) => s.branchId === activeBranch?.id && s.movieId === activeMovie?.id
  );

  // Alternative shows in activeCity if selected cinema isn't screening activeMovie
  const cityMovieAltShows = shows.filter(
    (s) =>
      s.city.toLowerCase() === activeCity.toLowerCase() &&
      s.movieId === activeMovie?.id &&
      s.branchId !== activeBranch?.id
  );

  const altBranchesForMovie = Array.from(
    new Map(cityMovieAltShows.map((s) => [s.branchId, s])).values()
  );

  const handleCitySelect = (city: string) => {
    setActiveCity(city);
    setCityOpen(false);
    if (onSelectCity) onSelectCity(city);

    const matchedBranches = allBranches.filter(
      (b) => b.city.toLowerCase() === city.toLowerCase()
    );
    if (matchedBranches.length > 0) {
      setActiveBranchId(matchedBranches[0].id);
    }
  };

  const handleBranchSelect = (branchId: string) => {
    setActiveBranchId(branchId);
    setCinemaOpen(false);
  };

  const handleMovieSelect = (movieId: string) => {
    setActiveMovieId(movieId);
    setMovieOpen(false);
  };

  const formatRuntime = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`;
  };

  const premiereMovie: Movie = activeMovie || movies[0] || fallbackMovie;

  const filteredMovies = movies.filter((m) => {
    if (formatFilter === 'All Formats') return true;
    return m.badges?.some((b) => b.toUpperCase().includes(formatFilter.toUpperCase()));
  });

  const premiereTitleWords = (premiereMovie.title || '').trim().split(/\s+/);
  const heroPrimaryHeadline = premiereTitleWords[0] || premiereMovie.title;
  const heroSecondaryHeadline = premiereTitleWords.slice(1).join(' ');

  return (
    <div className="flex flex-col w-full bg-cv-bg text-cv-primary min-h-screen transition-colors">
      {/* SECTION 1: EDITORIAL LIGHT HERO / CINEMATIC DARK HERO */}
      {isLight ? (
        <section className="w-full bg-cv-bg border-b border-cv-border px-5 md:px-12 pt-10 pb-14">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Top Editorial Spec Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cv-border text-[11px] font-semibold tracking-[0.12em] uppercase">
              <div className="flex items-center gap-2 text-cv-muted">
                <span className="w-2 h-2 rounded-[2px] bg-cv-accent" />
                <span>CINEVA PREMIERE SERIES &bull; {activeCity.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cv-muted">{premiereMovie.language.toUpperCase()}</span>
                <span className="text-cv-border">&bull;</span>
                <span className="text-cv-accent">
                  {activeBranch?.name?.toUpperCase() || 'NOW SHOWING'}
                </span>
              </div>
            </div>

            {/* Split Editorial Feature Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Badges, Two-Tone Headline, Synopsis, Spec Strip, CTAs */}
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="ink">
                    {premiereMovie.badges?.[0] || '4K LASER PROJECTION'}
                  </Badge>
                  <Badge variant="neutral">
                    {premiereMovie.badges?.[1] || premiereMovie.certification || 'UA16+'}
                  </Badge>
                  <Badge variant="brand-solid">
                    {premiereMovie.ratingLabel || `RATING ${premiereMovie.imdbRating} / 10`}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-cv-muted uppercase tracking-[0.14em]">
                    A FILM BY {premiereMovie.director?.toUpperCase() || 'FEATURED DIRECTOR'}
                  </span>
                  <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight uppercase leading-[1.04]">
                    <span className="text-cv-primary block">{heroPrimaryHeadline}</span>
                    {heroSecondaryHeadline && (
                      <span className="text-cv-subhead block">{heroSecondaryHeadline}</span>
                    )}
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-cv-secondary max-w-xl leading-relaxed line-clamp-3">
                  {premiereMovie.description}
                </p>

                {/* Metadata Strip */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-cv-elevated border border-cv-border">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cv-muted">
                      Principal Cast
                    </span>
                    <span className="text-xs font-semibold text-cv-primary truncate">
                      {premiereMovie.cast?.slice(0, 2).join(', ') || 'Ensemble Cast'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cv-muted">
                      Runtime &amp; Genre
                    </span>
                    <span className="text-xs font-semibold text-cv-primary truncate">
                      {formatRuntime(premiereMovie.durationMins || 165)} &bull; {premiereMovie.genre?.split(',')[0]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cv-muted">
                      Active Venue
                    </span>
                    <span className="text-xs font-semibold text-cv-accent truncate">
                      {activeBranch?.name || `${activeCity} Multiplex`}
                    </span>
                  </div>
                </div>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={() => onSelectMovie(premiereMovie)}
                      variant="primary"
                      size="lg"
                      rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                    >
                      BOOK TICKETS &amp; DETAILS
                    </Button>
                    <Button
                      onClick={() => onOpenTrailer(premiereMovie.trailerUrl)}
                      variant="secondary"
                      size="lg"
                      leftIcon={<span className="material-symbols-outlined text-[18px]">play_circle</span>}
                    >
                      WATCH PREVIEW
                    </Button>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-cv-muted">
                    <span className="material-symbols-outlined text-[16px] text-cv-accent">view_in_ar</span>
                    <span>2D &amp; 3D Seat Engine</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Framed Architectural Screening Card */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden bg-[#141414] border border-cv-border shadow-elevated-xl aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] flex flex-col justify-between">
                  <img
                    alt={premiereMovie.title}
                    src={premiereMovie.backdropUrl || premiereMovie.posterUrl}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ramayana-et00451914-1793772172.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/85 via-transparent to-[#141414]/45" />

                  <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#141414]/85 backdrop-blur-md border border-white/15 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {premiereMovie.certification || 'UA16+'} &bull; {premiereMovie.language}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#141414]/85 backdrop-blur-md border border-white/15 text-[10px] font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B83B08]" />
                      {activeBranch?.name || activeCity} &bull; ACTIVE SHOWS
                    </span>
                  </div>

                  {/* Floating Crisp Gallery Bottom Pill */}
                  <div className="relative z-10 mx-4 mb-4 sm:mx-5 sm:mb-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E5E3DD] shadow-lg flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73716C]">
                        Next Scheduled Session
                      </span>
                      <span className="text-base sm:text-lg font-bold text-[#141414] tracking-tight truncate">
                        {matchingShows[0]
                          ? `TODAY, ${matchingShows[0].displayTime || matchingShows[0].startTime}`
                          : 'MULTIPLE TIMINGS TODAY'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73716C]">
                        Reserved Seating
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#B83B08]">
                        {matchingShows[0]
                          ? `From ${formatCurrency(matchingShows[0].pricing.STANDARD, matchingShows[0].city)}`
                          : 'All Seats Open'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative w-full min-h-[80vh] flex flex-col justify-end px-5 md:px-12 pb-16 pt-24 overflow-hidden border-b border-cv-border">
          <div className="absolute inset-0 z-0">
            <img
              alt={premiereMovie.title}
              src={premiereMovie.backdropUrl || premiereMovie.posterUrl}
              onError={(e) => {
                e.currentTarget.src =
                  'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ramayana-et00451914-1793772172.jpg';
              }}
              className="w-full h-full object-cover object-center scale-[1.01] transform transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/65 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-5">
            {/* Format Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" pulse>
                NOW SHOWING IN {activeCity.toUpperCase()}
              </Badge>
              {premiereMovie.badges?.slice(0, 2).map((badge) => (
                <Badge key={badge} variant="neutral">
                  {badge}
                </Badge>
              ))}
              <Badge variant="outline">DIR. {premiereMovie.director?.toUpperCase()}</Badge>
            </div>

            {/* Title & Headline */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#FF6500] uppercase tracking-widest">
                {premiereMovie.language} &bull; Theatrical Engagement
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-white max-w-4xl">
                {premiereMovie.title}
              </h1>
            </div>

            {/* Metadata String */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A0A0A0]">
              <span className="text-white font-medium">{premiereMovie.genre}</span>
              <span>&bull;</span>
              <span>{formatRuntime(premiereMovie.durationMins || 165)}</span>
              <span>&bull;</span>
              <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#222222] text-white font-semibold">
                {premiereMovie.certification || 'UA16+'}
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center gap-1 text-white font-semibold">
                <span
                  className="material-symbols-outlined text-[16px] text-[#FF6500]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>
                  {premiereMovie.ratingLabel || `${premiereMovie.imdbRating} / 10 Rating`}
                </span>
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
                Book Tickets &amp; Details
              </Button>
              <Button
                onClick={() => onOpenTrailer(premiereMovie.trailerUrl)}
                variant="secondary"
                size="lg"
                leftIcon={<span className="material-symbols-outlined text-[20px]">play_arrow</span>}
              >
                Movie Preview
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: INTERACTIVE CITY, THEATER & MOVIE SELECTOR CONSOLE */}
      <section className="w-full py-14 px-5 md:px-12 border-b border-cv-border bg-cv-bg-secondary transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cv-accent animate-pulse" />
                <span className="text-xs font-semibold text-cv-accent uppercase tracking-wider">
                  Fast Booking Console &bull; {activeCity}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-cv-primary">
                Find Screenings &amp; Reserve Seats
              </h2>
              <p className="text-sm text-cv-secondary">
                Choose your city, select any cinema auditorium, and pick or change your movie to browse live BookMyShow timings.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-cv-muted">
              <span className="material-symbols-outlined text-cv-accent text-[18px]">bolt</span>
              <span>All Seats Open for Booking &bull; Instant 3D Seat View</span>
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
                className={`p-5 rounded-2xl bg-cv-surface border cursor-pointer transition-all hover:bg-cv-elevated shadow-card-subtle ${
                  cityOpen ? 'border-cv-accent ring-1 ring-cv-accent/50' : 'border-cv-border hover:border-cv-muted/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cv-accent">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span>Step 1 &bull; City</span>
                  </div>
                  <span className="material-symbols-outlined text-cv-muted text-[18px]">
                    {cityOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <div className="text-lg font-bold text-cv-primary tracking-tight">{activeCity}</div>
                <div className="text-xs text-cv-muted mt-1">
                  {cityBranches.length} {cityBranches.length === 1 ? 'Cinema' : 'Cinemas'} listed
                </div>
              </div>

              {cityOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-cv-surface border border-cv-border shadow-elevated-xl p-2 z-30 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cv-muted">
                    Select City
                  </div>
                  {AVAILABLE_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        activeCity.toLowerCase() === city.toLowerCase()
                          ? 'bg-cv-elevated text-cv-accent font-semibold border border-cv-accent/30'
                          : 'text-cv-secondary hover:bg-cv-elevated hover:text-cv-primary'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-cv-accent">location_city</span>
                        <span>{city}</span>
                      </span>
                      {activeCity.toLowerCase() === city.toLowerCase() && (
                        <span className="material-symbols-outlined text-[16px] text-cv-accent">check</span>
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
                className={`p-5 rounded-2xl bg-cv-surface border cursor-pointer transition-all hover:bg-cv-elevated shadow-card-subtle ${
                  cinemaOpen ? 'border-cv-accent ring-1 ring-cv-accent/50' : 'border-cv-border hover:border-cv-muted/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cv-accent">
                    <span className="material-symbols-outlined text-[18px]">theaters</span>
                    <span>Step 2 &bull; Theatre</span>
                  </div>
                  <span className="material-symbols-outlined text-cv-muted text-[18px]">
                    {cinemaOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <div className="text-lg font-bold text-cv-primary tracking-tight truncate">
                  {activeBranch?.name || 'Select Theatre'}
                </div>
                <div className="text-xs text-cv-muted mt-1 truncate">
                  {activeBranch?.address || `${activeCity} Venue`}
                </div>
              </div>

              {cinemaOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-cv-surface border border-cv-border shadow-elevated-xl p-2 z-30 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cv-muted">
                    Theatres in {activeCity} ({cityBranches.length})
                  </div>
                  {cityBranches.map((branch) => {
                    const branchShowsCount = shows.filter((s) => s.branchId === branch.id).length;
                    const hasSelectedMovie = shows.some(
                      (s) => s.branchId === branch.id && s.movieId === activeMovie.id
                    );
                    return (
                      <button
                        key={branch.id}
                        onClick={() => handleBranchSelect(branch.id)}
                        className={`w-full text-left p-3 rounded-xl text-xs transition-all flex flex-col gap-1 mb-1 ${
                          activeBranch?.id === branch.id
                            ? 'bg-cv-elevated text-cv-accent font-semibold border border-cv-accent/30'
                            : 'text-cv-secondary hover:bg-cv-elevated hover:text-cv-primary'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-cv-primary truncate">{branch.name}</span>
                          {activeBranch?.id === branch.id && (
                            <span className="material-symbols-outlined text-[16px] text-cv-accent shrink-0">check</span>
                          )}
                        </div>
                        <span className="text-[11px] text-cv-muted truncate">{branch.address}</span>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {branch.formats?.[0] && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cv-accent/10 text-cv-accent border border-cv-accent/20 font-medium">
                              {branch.formats[0]}
                            </span>
                          )}
                          {branchShowsCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cv-surface border border-cv-border text-cv-secondary">
                              {branchShowsCount} {branchShowsCount === 1 ? 'Show' : 'Shows'}
                            </span>
                          )}
                          {hasSelectedMovie && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-medium">
                              Playing {activeMovie.title}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
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
                className={`p-5 rounded-2xl bg-cv-surface border cursor-pointer transition-all hover:bg-cv-elevated shadow-card-subtle ${
                  movieOpen ? 'border-cv-accent ring-1 ring-cv-accent/50' : 'border-cv-border hover:border-cv-muted/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cv-accent">
                    <span className="material-symbols-outlined text-[18px]">movie</span>
                    <span>Step 3 &bull; Movie</span>
                  </div>
                  <span className="text-[11px] text-cv-accent font-semibold underline underline-offset-2">
                    Change Movie
                  </span>
                </div>
                <div className="text-lg font-bold text-cv-primary tracking-tight truncate">
                  {activeMovie?.title || 'Select Movie'}
                </div>
                <div className="text-xs text-cv-muted mt-1 flex items-center gap-2 truncate">
                  <span>{activeMovie?.language}</span>
                  <span>&bull;</span>
                  <span className="text-cv-accent font-medium flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {activeMovie?.ratingLabel || activeMovie?.imdbRating}
                  </span>
                </div>
              </div>

              {movieOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-cv-surface border border-cv-border shadow-elevated-xl p-2 z-30 animate-fade-in max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cv-muted">
                    Now Showing in {activeCity}
                  </div>
                  {movies.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleMovieSelect(m.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 mb-1 ${
                        activeMovie?.id === m.id
                          ? 'bg-cv-elevated border border-cv-accent/30'
                          : 'hover:bg-cv-elevated'
                      }`}
                    >
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded-lg border border-cv-border flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold truncate ${
                              activeMovie?.id === m.id ? 'text-cv-accent' : 'text-cv-primary'
                            }`}
                          >
                            {m.title}
                          </span>
                          {activeMovie?.id === m.id && (
                            <span className="material-symbols-outlined text-[16px] text-cv-accent">check</span>
                          )}
                        </div>
                        <span className="text-[11px] text-cv-muted truncate mt-0.5">
                          {m.genre} &bull; {m.language}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-cv-secondary mt-1">
                          <span>{formatRuntime(m.durationMins)}</span>
                          <span>&bull;</span>
                          <span className="text-cv-accent font-semibold">
                            {m.ratingLabel || `${m.imdbRating}/10`}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE SHOWTIMES & 3D BOOKING TRAY */}
          <div className="rounded-3xl bg-cv-surface border border-cv-border shadow-card-subtle p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Movie Vignette */}
            <div className="w-full lg:w-80 flex-shrink-0 flex sm:flex-row lg:flex-col gap-5 items-start">
              <img
                src={activeMovie.posterUrl}
                alt={activeMovie.title}
                className="w-28 sm:w-36 lg:w-full h-auto max-h-56 lg:max-h-80 object-cover rounded-2xl border border-cv-border shadow-md flex-shrink-0"
              />
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="brand" size="sm">
                    {activeMovie.certification || 'UA16+'}
                  </Badge>
                  <span className="text-xs text-cv-muted">
                    {formatRuntime(activeMovie.durationMins)} &bull; {activeMovie.language}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-cv-primary tracking-tight uppercase">
                  {activeMovie.title}
                </h3>
                <p className="text-xs text-cv-secondary line-clamp-3 leading-relaxed">
                  {activeMovie.description}
                </p>
                <div className="text-[11px] text-cv-muted">
                  <strong className="text-cv-secondary">Dir:</strong> {activeMovie.director} &bull;{' '}
                  <strong className="text-cv-secondary">Cast:</strong> {activeMovie.cast.slice(0, 3).join(', ')}
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <Button
                    onClick={() => onSelectMovie(activeMovie)}
                    variant="outline"
                    size="sm"
                    leftIcon={<span className="material-symbols-outlined text-[16px]">info</span>}
                  >
                    Full Cast &amp; Details
                  </Button>
                  <Button
                    onClick={() => onOpenTrailer(activeMovie.trailerUrl)}
                    variant="secondary"
                    size="sm"
                    leftIcon={<span className="material-symbols-outlined text-[16px]">play_arrow</span>}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Available Showtimes List */}
            <div className="flex-1 w-full flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cv-border gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-cv-primary uppercase tracking-wider">
                    Showtimes &bull; {activeBranch?.name}
                  </h4>
                  <span className="text-xs text-cv-muted">
                    {activeBranch?.address}
                  </span>
                </div>
                <span className="text-xs font-semibold text-cv-accent px-3 py-1 rounded-full bg-cv-accent/10 border border-cv-accent/20 self-start sm:self-auto">
                  Today &bull; Nov 11, 2026
                </span>
              </div>

              {/* Showtimes Grid */}
              {matchingShows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchingShows.map((show) => (
                    <div
                      key={show.id}
                      className="p-5 rounded-2xl bg-cv-elevated dark:bg-[#161616] border border-cv-border hover:border-cv-accent/50 transition-all flex flex-col justify-between gap-4 group shadow-card-subtle"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-2xl font-extrabold text-cv-primary group-hover:text-cv-accent transition-colors">
                            {show.displayTime || show.startTime}
                          </span>
                          <span className="text-xs text-cv-muted">
                            Ends {show.endTime} {show.cancellable !== undefined && (show.cancellable ? '• Cancellable' : '• Non-cancellable')}
                          </span>
                        </div>
                        <Badge variant="brand" size="sm">
                          {show.screenFormat}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-cv-primary font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-cv-accent">chair</span>
                          {show.screenName}
                        </span>
                        <span className="text-cv-muted truncate">
                          {show.priceCategories || `${show.audioSpec} • ${show.projectionSpec}`}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-cv-border flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-cv-muted uppercase tracking-wider block">
                            Ticket Price
                          </span>
                          <span className="text-sm font-bold text-cv-primary">
                            {formatCurrency(show.pricing.STANDARD, show.city)}
                          </span>
                        </div>
                        <Button
                          onClick={() => onBookShow(show)}
                          variant="primary"
                          size="sm"
                          rightIcon={<span className="material-symbols-outlined text-[16px]">arrow_forward</span>}
                        >
                          Book Tickets
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 px-6 rounded-2xl bg-cv-elevated dark:bg-[#161616] border border-cv-border flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cv-surface dark:bg-[#181818] border border-cv-border flex items-center justify-center text-cv-accent">
                    <span className="material-symbols-outlined text-[24px]">schedule</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h5 className="text-base font-bold text-cv-primary">
                      No sessions for {activeMovie.title} at {activeBranch?.name}
                    </h5>
                    <p className="text-xs text-cv-secondary max-w-md">
                      {altBranchesForMovie.length > 0
                        ? `${activeMovie.title} is currently playing at these cinemas in ${activeCity}:`
                        : `Select another movie playing at ${activeBranch?.name}:`}
                    </p>
                  </div>

                  {/* Quick Jump to Cinemas Playing This Movie in Selected City */}
                  {altBranchesForMovie.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                      {altBranchesForMovie.slice(0, 4).map((altShow) => (
                        <button
                          key={altShow.branchId}
                          onClick={() => handleBranchSelect(altShow.branchId)}
                          className="px-3.5 py-2 rounded-xl bg-cv-surface dark:bg-[#181818] hover:bg-cv-accent dark:hover:bg-[#FF6500] hover:text-white border border-cv-border text-xs font-semibold text-cv-primary transition-all flex items-center gap-2 group"
                        >
                          <span className="material-symbols-outlined text-[15px] text-cv-accent group-hover:text-white">theaters</span>
                          <span>{altShow.branchName}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Switch Movie */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-cv-border w-full">
                    {movies
                      .filter((m) => m.id !== activeMovie.id)
                      .slice(0, 3)
                      .map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleMovieSelect(m.id)}
                          className="px-3 py-1.5 rounded-lg bg-cv-surface dark:bg-[#111111] hover:bg-cv-accent/10 border border-cv-border text-[11px] font-medium text-cv-secondary hover:text-cv-primary transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[14px] text-cv-accent">movie</span>
                          <span>{m.title}</span>
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
      <section className="w-full py-16 px-5 md:px-12 bg-cv-bg transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-xl">
              <span className="text-xs font-semibold text-cv-accent uppercase tracking-wider">
                Now Showing &bull; {activeCity}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-cv-primary">The Repertoire</h2>
              <p className="text-sm text-cv-secondary">
                Live theatrical listings sourced for {activeCity} cinemas across 3D, 4K RGB Laser, Dolby Atmos, and PLF screens.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All Formats', '3D', '2D', 'Dolby', '4DX'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormatFilter(fmt)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    formatFilter === fmt
                      ? 'bg-cv-ink text-white font-semibold border border-cv-ink dark:bg-[#181818] dark:text-white dark:border-[#FF6500]/50 shadow-sm'
                      : 'bg-cv-surface dark:bg-[#111111] text-cv-secondary hover:text-cv-primary dark:hover:text-white border border-cv-border'
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
                shows={shows.filter((s) => s.city.toLowerCase() === activeCity.toLowerCase())}
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
