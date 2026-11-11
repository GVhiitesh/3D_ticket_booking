import React, { useState, useEffect } from 'react';
import { Movie, Branch, Show, Booking } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { CinemasPage } from './pages/CinemasPage';
import { SeatSelectionPage } from './pages/SeatSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthModal } from './pages/AuthModal';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { ToastProvider } from './components/ui/Toast';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([]);
  const [checkoutSubtotal, setCheckoutSubtotal] = useState<number>(0);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>({
    name: 'David Miller',
    email: 'david.miller@cineva.com',
    phone: '+44 7700 900123',
  });

  const [selectedCity, setSelectedCity] = useState<string>('Trichy');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('cineva-theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    try {
      localStorage.setItem('cineva-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [trailerModalUrl, setTrailerModalUrl] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch initial data from backend API
  useEffect(() => {
    fetch('/api/v1/movies')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setMovies(res.data);
          setSelectedMovie((prev) => prev || res.data[0]);
        }
      })
      .catch((err) => console.error('Error fetching movies:', err));

    fetch('/api/v1/cinemas')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setBranches(res.data);
      })
      .catch((err) => console.error('Error fetching cinemas:', err));

    fetch('/api/v1/shows')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setShows(res.data);
          setSelectedShow((prev) => prev || res.data[0]);
        }
      })
      .catch((err) => console.error('Error fetching shows:', err));
  }, []);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentTab('movie-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookShow = (show: Show) => {
    setSelectedShow(show);
    setSelectedSeatCodes([]);
    setCheckoutSubtotal(0);
    const movie = movies.find((m) => m.id === show.movieId) || movies[0];
    setSelectedMovie(movie);
    setCurrentTab('seat-selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (seatCodes: string[], subtotal: number) => {
    setSelectedSeatCodes(seatCodes);
    setCheckoutSubtotal(subtotal);
    setCurrentTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCurrentTab('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <div className="w-full min-h-screen bg-cv-bg text-cv-primary flex flex-col font-sans selection:bg-cv-accent selection:text-white transition-colors duration-200">
        {/* Universal Fixed Header */}
        <Header
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAuth={() => setAuthModalOpen(true)}
          currentUser={currentUser}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          onOpenSearch={() => setSearchModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Screen Content */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomePage
              movies={movies}
              shows={shows}
              branches={branches}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              onSelectMovie={handleSelectMovie}
              onBookShow={handleBookShow}
              onOpenTrailer={(url) => setTrailerModalUrl(url)}
              theme={theme}
            />
          )}

          {currentTab === 'movies' && (
            <MoviesPage
              movies={movies}
              onSelectMovie={handleSelectMovie}
            />
          )}

          {currentTab === 'movie-details' && selectedMovie && (
            <MovieDetailsPage
              movie={selectedMovie}
              shows={shows}
              onSelectShow={handleBookShow}
              onOpenTrailer={(url) => setTrailerModalUrl(url)}
              onBack={() => setCurrentTab('movies')}
              theme={theme}
            />
          )}

          {currentTab === 'cinemas' && (
            <CinemasPage
              branches={branches}
              shows={shows}
              selectedCity={selectedCity}
              onSelectBranch={() => setCurrentTab('movies')}
              onBookShow={handleBookShow}
            />
          )}

          {currentTab === 'seat-selection' && selectedShow && selectedMovie && (
            <SeatSelectionPage
              show={selectedShow}
              movie={selectedMovie}
              onProceedToCheckout={handleProceedToCheckout}
              onBack={() => setCurrentTab('movie-details')}
              theme={theme}
            />
          )}

          {currentTab === 'checkout' && selectedShow && selectedMovie && (
            <CheckoutPage
              show={selectedShow}
              movie={selectedMovie}
              selectedSeatCodes={selectedSeatCodes}
              subtotal={checkoutSubtotal}
              currentUser={currentUser}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setCurrentTab('seat-selection')}
            />
          )}

          {currentTab === 'confirmation' && confirmedBooking && (
            <ConfirmationPage
              booking={confirmedBooking}
              onGoToBookings={() => setCurrentTab('my-bookings')}
              onGoHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'my-bookings' && (
            <MyBookingsPage
              currentUser={currentUser}
              onBookMore={() => setCurrentTab('movies')}
            />
          )}

          {currentTab === 'profile' && currentUser && (
            <ProfilePage
              currentUser={currentUser}
              onLogout={() => setCurrentUser(null)}
              onGoToBookings={() => setCurrentTab('my-bookings')}
            />
          )}
        </main>

        {/* Universal Footer */}
        {currentTab !== 'seat-selection' && (
          <Footer onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setAuthModalOpen(false);
          }}
        />

        {/* Trailer / Movie Listing Preview Modal */}
        {trailerModalUrl && (() => {
          const previewMovie =
            movies.find((m) => m.trailerUrl === trailerModalUrl) || selectedMovie || movies[0];
          return (
            <Modal
              isOpen={Boolean(trailerModalUrl)}
              onClose={() => setTrailerModalUrl(null)}
              title={previewMovie ? `${previewMovie.title} — Theatrical Preview` : 'Theatrical Teaser'}
              subtitle={previewMovie ? `${previewMovie.language} • ${previewMovie.certification} • ${previewMovie.genre}` : '4K Dual Laser Presentation'}
              maxWidth="4xl"
            >
              <div className="relative w-full aspect-video bg-[#141414] rounded-2xl overflow-hidden border border-cv-border flex flex-col items-center justify-center p-8 text-center gap-4">
                {previewMovie?.backdropUrl && (
                  <img
                    src={previewMovie.backdropUrl}
                    alt={previewMovie.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-3 max-w-lg">
                  <span className="material-symbols-outlined text-[#FF6500] text-[64px] animate-pulse">
                    play_circle
                  </span>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {previewMovie?.title || 'Featured Film'} — Theatrical Preview
                  </h3>
                  <p className="text-xs text-[#D4D4D4] leading-relaxed">
                    {previewMovie?.description ||
                      'Experience this theatrical presentation in 4K Laser projection and Dolby Atmos sound.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    {previewMovie?.bookMyShowUrl && (
                      <a
                        href={previewMovie.bookMyShowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#FF6500]/40 text-xs font-semibold text-[#FF6500] transition-colors"
                      >
                        View on BookMyShow &nearr;
                      </a>
                    )}
                    <Button
                      onClick={() => setTrailerModalUrl(null)}
                      variant="primary"
                      size="md"
                    >
                      Close Preview
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          );
        })()}

        {/* Quick Search Modal */}
        {searchModalOpen && (
          <Modal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            title="Search Theatrical Catalog"
            subtitle="Instant Screening Lookup"
            maxWidth="xl"
          >
            <div className="flex flex-col gap-4">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-cv-muted absolute left-3.5 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search movies, auditoriums, formats..."
                  className="w-full bg-cv-bg-subtle text-cv-primary placeholder-cv-muted pl-10 pr-4 py-3 rounded-xl border border-cv-border focus:border-cv-accent focus:outline-none text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pt-2">
                {movies
                  .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.genre.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSearchModalOpen(false);
                        handleSelectMovie(m);
                      }}
                      className="p-3 rounded-xl hover:bg-cv-elevated cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-cv-border"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          alt={m.title}
                          src={m.posterUrl}
                          className="w-9 h-13 object-cover rounded-md border border-cv-border"
                        />
                        <div>
                          <div className="text-sm font-semibold text-cv-primary">{m.title}</div>
                          <div className="text-xs text-cv-muted">{m.genre} &bull; {m.durationMins}m</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-cv-accent text-[18px]">chevron_right</span>
                    </div>
                  ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ToastProvider>
  );
}
