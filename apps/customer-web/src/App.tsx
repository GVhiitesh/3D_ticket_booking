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
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>(['E-9', 'E-10']);
  const [checkoutSubtotal, setCheckoutSubtotal] = useState<number>(56.0);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>({
    name: 'David Miller',
    email: 'david.miller@cineva.com',
    phone: '+44 7700 900123',
  });

  const [selectedCity, setSelectedCity] = useState<string>('London');
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
      <div className="w-full min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FF6500] selection:text-white transition-colors duration-200">
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
        />

        {/* Main Screen Content */}
        <main className="flex-1 w-full">
          {currentTab === 'home' && (
            <HomePage
              movies={movies}
              shows={shows}
              onSelectMovie={handleSelectMovie}
              onBookShow={handleBookShow}
              onOpenTrailer={(url) => setTrailerModalUrl(url)}
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
            />
          )}

          {currentTab === 'cinemas' && (
            <CinemasPage
              branches={branches}
              shows={shows}
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

        {/* Trailer Player Modal */}
        {trailerModalUrl && (
          <Modal
            isOpen={Boolean(trailerModalUrl)}
            onClose={() => setTrailerModalUrl(null)}
            title="Theatrical Teaser"
            subtitle="4K Dual Laser Presentation"
            maxWidth="4xl"
          >
            <div className="w-full aspect-video bg-[#050505] rounded-2xl overflow-hidden border border-[#222222] flex flex-col items-center justify-center p-8 text-center gap-4">
              <span className="material-symbols-outlined text-[#FF6500] text-[64px] animate-pulse">
                play_circle
              </span>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
                CHRONOS: BEYOND TIME — 4K Official Trailer
              </h3>
              <p className="text-xs text-[#A0A0A0] max-w-md">
                Experience the official IMAX 70mm theatrical presentation preview in Dolby Atmos 64-channel spatial sound.
              </p>
              <Button
                onClick={() => setTrailerModalUrl(null)}
                variant="primary"
                size="md"
                className="mt-2"
              >
                Close Trailer
              </Button>
            </div>
          </Modal>
        )}

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
                <span className="material-symbols-outlined text-[#707070] absolute left-3.5 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search movies, auditoriums, formats..."
                  className="w-full bg-[#0B0B0B] text-white pl-10 pr-4 py-3 rounded-xl border border-[#222222] focus:border-[#FF6500] focus:outline-none text-sm"
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
                      className="p-3 rounded-xl hover:bg-[#181818] cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-[#222222]"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          alt={m.title}
                          src={m.posterUrl}
                          className="w-9 h-13 object-cover rounded-md border border-white/5"
                        />
                        <div>
                          <div className="text-sm font-semibold text-white">{m.title}</div>
                          <div className="text-xs text-[#707070]">{m.genre} &bull; {m.durationMins}m</div>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#FF6500] text-[18px]">chevron_right</span>
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
