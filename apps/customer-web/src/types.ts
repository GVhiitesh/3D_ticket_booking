export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  director: string;
  musicDirector: string;
  producer?: string;
  cast: string[];
  genre: string;
  language: string;
  durationMins: number;
  certification: string;
  imdbRating: number;
  ratingLabel?: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  bookMyShowUrl?: string;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'UPCOMING';
  badges: string[];
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  screensCount: number;
  formats: string[];
  facilities?: string[];
}

export interface Show {
  id: string;
  branchId: string;
  branchName: string;
  city: string;
  movieId: string;
  movieTitle: string;
  screenId: string;
  screenName: string;
  screenFormat: string;
  date: string;
  startTime: string;
  endTime: string;
  displayTime?: string;
  cancellable?: boolean;
  priceCategories?: string;
  pricing: {
    STANDARD: number;
    PREMIUM: number;
    VIP_SUITE: number;
  };
  audioSpec: string;
  projectionSpec: string;
}

export interface SeatNode {
  rowName: string;
  seatNumber: number;
  seatCode: string;
  section?: 'LEFT' | 'CENTER' | 'RIGHT';
  tier: 'Standard' | 'Premium' | 'VIP Suite';
  category: 'STANDARD' | 'PREMIUM' | 'VIP_SUITE';
  price: number;
  status: 'AVAILABLE' | 'HELD' | 'BOOKED';
  isVipCenter?: boolean;
  isWheelchair?: boolean;
  x: number;
  y: number;
  z: number;
  angleY?: number;
}

export interface Booking {
  id: string;
  bookingReference: string;
  showId: string;
  movieTitle: string;
  moviePosterUrl: string;
  branchName: string;
  city: string;
  screenName: string;
  screenFormat: string;
  showTime: string;
  date: string;
  seatCodes: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  convenienceFee: number;
  taxAmount: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'SUCCESS';
  createdAt: string;
  tickets: Array<{
    ticketNumber: string;
    seatCode: string;
    qrPayload: string;
    qrCodeDataUrl: string;
    status: 'ACTIVE' | 'CHECKED_IN' | 'CANCELLED';
  }>;
}
