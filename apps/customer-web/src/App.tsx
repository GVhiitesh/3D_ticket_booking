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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Luxury Obsidian Slate Cinema Theme

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
    <div
      className="w-full min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-['Geist'] selection:bg-[#ff5500] selection:text-white transition-colors duration-200"
    >
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
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />

      {/* Main Screen Renderer */}
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

      {/* Trailer Video Player Modal */}
      {trailerModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <button
              onClick={() => setTrailerModalUrl(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-lg transition-colors border border-white/20"
            >
              &times;
            </button>
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center gap-4 bg-gradient-to-b from-[#111111] to-[#050505]">
              <span className="material-symbols-outlined text-[#ff6500] text-[64px] animate-pulse">
                play_circle
              </span>
              <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white uppercase tracking-wider">
                CHRONOS: BEYOND TIME — 4K Official Trailer
              </h3>
              <p className="text-xs text-[#aa8a7d] max-w-md font-['Geist']">
                Experience the official IMAX 70mm theatrical presentation teaser.
              </p>
              <button
                onClick={() => setTrailerModalUrl(null)}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#ff6500] hover:bg-[#b74600] text-white text-xs font-bold uppercase transition-all"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#ff6500] font-['Geist'] uppercase tracking-wider">
                Quick Search
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-[#aa8a7d] hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[#aa8a7d] absolute left-3 text-[20px]">
                search
              </span>
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search movies, auditoriums, or formats..."
                className="w-full bg-[#1c1b1b] text-white pl-10 pr-4 py-3 rounded-xl border border-white/5 focus:border-[#ff6500] focus:outline-none text-xs font-['Geist']"
              />
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pt-2">
              {movies
                .filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSearchModalOpen(false);
                      handleSelectMovie(m);
                    }}
                    className="p-3 rounded-xl hover:bg-[#1c1b1b] cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <img alt={m.title} src={m.posterUrl} className="w-8 h-12 object-cover rounded" />
                      <div>
                        <div className="text-sm font-bold text-white font-['Space_Grotesk']">{m.title}</div>
                        <div className="text-[10px] text-[#aa8a7d]">{m.genre} &bull; {m.durationMins}m</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#ff6500] text-[18px]">chevron_right</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
