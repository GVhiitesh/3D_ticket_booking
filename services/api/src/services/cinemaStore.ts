import crypto from 'crypto';
import { seatLockService } from './seatLockService';
import { ticketService } from './ticketService';

export interface MovieItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  director: string;
  musicDirector: string;
  cast: string[];
  genre: string;
  language: string;
  durationMins: number;
  certification: string;
  imdbRating: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'UPCOMING';
  badges: string[];
}

export interface BranchItem {
  id: string;
  name: string;
  city: string;
  address: string;
  screensCount: number;
  formats: string[];
}

export interface ShowItem {
  id: string;
  branchId: string;
  branchName: string;
  city: string;
  movieId: string;
  movieTitle: string;
  screenId: string;
  screenName: string;
  screenFormat: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
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
  seatCode: string; // "E-9"
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

export interface BookingRecord {
  id: string;
  bookingReference: string; // e.g. "CNM-94821"
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

// 10 Symmetrical Fan-Shaped Curved Rows matching the in70mm Curved Cinema Reference Architecture
export interface FanRowConfig {
  rowName: string;
  radius: number;
  y: number;
  tier: 'VIP Suite' | 'Premium' | 'Standard';
  category: 'VIP_SUITE' | 'PREMIUM' | 'STANDARD';
  price: number;
  leftSeats: number[];
  centerSeats: number[];
  rightSeats: number[];
  wheelchairSeats?: number[];
  isWalkwayBefore?: boolean;
}

export const FAN_ROW_CONFIGS: FanRowConfig[] = [
  // Upper Elite Section (₹300 ELITE 3D / VIP Suite)
  {
    rowName: 'A',
    radius: 41.5,
    y: 15.5,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5],
    centerSeats: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21, 22, 23],
  },
  {
    rowName: 'B',
    radius: 39.8,
    y: 14.3,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'C',
    radius: 38.1,
    y: 13.1,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'D',
    radius: 36.4,
    y: 12.0,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'E',
    radius: 34.7,
    y: 10.9,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'F',
    radius: 33.0,
    y: 9.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'G',
    radius: 31.3,
    y: 8.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'H',
    radius: 29.6,
    y: 7.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'J',
    radius: 27.9,
    y: 6.8,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },
  {
    rowName: 'K',
    radius: 26.2,
    y: 5.9,
    tier: 'VIP Suite',
    category: 'VIP_SUITE',
    price: 35.0,
    leftSeats: [1, 2, 3, 4, 5, 6],
    centerSeats: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    rightSeats: [24, 25, 26, 27, 28, 29],
  },

  // Transverse Walkway Concourse Break between K and L

  // Lower Section (Rows L through T)
  {
    rowName: 'L',
    radius: 23.0,
    y: 4.8,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    isWalkwayBefore: true,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'M',
    radius: 21.5,
    y: 4.0,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    rightSeats: [19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'N',
    radius: 20.0,
    y: 3.3,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'P',
    radius: 18.5,
    y: 2.6,
    tier: 'Premium',
    category: 'PREMIUM',
    price: 28.0,
    leftSeats: [1, 2],
    centerSeats: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22, 23, 24],
  },
  {
    rowName: 'Q',
    radius: 17.0,
    y: 2.0,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [1, 2, 3],
    centerSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22, 23],
  },
  {
    rowName: 'R',
    radius: 15.5,
    y: 1.4,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [1, 2, 3],
    centerSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    rightSeats: [18, 19, 20, 21, 22],
  },
  {
    rowName: 'S',
    radius: 14.0,
    y: 0.9,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [1, 2, 3],
    centerSeats: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    rightSeats: [17, 18, 19, 20],
    wheelchairSeats: [4, 5, 6, 7, 8],
  },
  {
    rowName: 'T',
    radius: 12.5,
    y: 0.5,
    tier: 'Standard',
    category: 'STANDARD',
    price: 21.0,
    leftSeats: [],
    centerSeats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    rightSeats: [],
  },
];

const Z_CENTER = -26.0;

// Pre-reserved seats realistically distributed across the Left, Center, and Right fan sections
const DEFAULT_PRE_BOOKED = new Set([
  'A-23', 'D-22', 'E-25',
  // Center occupied cluster
  'B-10', 'B-11', 'B-12', 'B-13', 'B-14', 'B-15', 'B-16', 'B-17',
  'C-8', 'C-9', 'C-10', 'C-11', 'C-12', 'C-13', 'C-14', 'C-15', 'C-16',
  'D-8', 'D-9', 'D-10', 'D-11', 'D-12', 'D-13', 'D-14', 'D-15', 'D-16', 'D-17', 'D-18',
  'E-8', 'E-9', 'E-10', 'E-11', 'E-12', 'E-13', 'E-14', 'E-15', 'E-16',
  'F-8', 'F-9', 'F-10', 'F-11', 'F-12', 'F-13', 'F-14', 'F-15', 'F-16', 'F-17',
  'G-8', 'G-9', 'G-10', 'G-11', 'G-12', 'G-13', 'G-14', 'G-15', 'G-16',
  'H-8', 'H-9', 'H-10', 'H-11', 'H-12', 'H-13', 'H-14', 'H-15',
  'J-8', 'J-9', 'J-10', 'J-11', 'J-12', 'J-13', 'J-14',
  'K-8', 'K-9', 'K-10', 'K-11', 'K-12', 'K-13',
  'L-7', 'L-8', 'L-9', 'L-10', 'L-11', 'L-12',
  'M-7', 'M-8', 'M-9', 'M-10', 'M-11', 'M-12',
  'N-6', 'N-7', 'N-8', 'N-9', 'N-10',
  'P-6', 'P-7', 'P-8', 'P-9', 'P-10',
]);

class CinemaStore {
  private movies: MovieItem[] = [
    {
      id: 'movie-chronos',
      title: 'CHRONOS: BEYOND TIME',
      slug: 'chronos-beyond-time',
      description:
        "A team of deep-space cartographers enter an uncharted gravitational anomaly, where time dilates and the fabric of reality reveals humanity's origin. Filmed with IMAX 70mm cameras for the ultimate sensory voyage.",
      director: 'Elias Thorne',
      musicDirector: 'Hans Zimmer',
      cast: ['David Oyelowo', 'Rebecca Ferguson', 'Cillian Murphy', 'Florence Pugh'],
      genre: 'Sci-Fi / Thriller',
      language: 'English',
      durationMins: 168,
      certification: '12A',
      imdbRating: 9.8,
      posterUrl:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
      backdropUrl:
        'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      releaseDate: '2026-10-24',
      status: 'NOW_SHOWING',
      badges: ['IMAX 70MM EXCLUSIVE', 'DOLBY ATMOS', '1.43:1 EXPANDED ASPECT RATIO'],
    },
    {
      id: 'movie-solaris',
      title: 'SOLARIS ODYSSEY',
      slug: 'solaris-odyssey',
      description:
        'An ethereal space voyage into the heart of a sentient star system. The crew must decipher an alien consciousness manifested through living cosmic solar winds.',
      director: 'Anya Vaneeva',
      musicDirector: 'Max Richter',
      cast: ['Alexander Skarsgård', 'Noomi Rapace', 'Willem Dafoe'],
      genre: 'Fantasy / Space',
      language: 'English',
      durationMins: 135,
      certification: 'PG-13',
      imdbRating: 9.4,
      posterUrl:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
      backdropUrl:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      releaseDate: '2026-11-01',
      status: 'NOW_SHOWING',
      badges: ['DOLBY 3D', 'DOLBY VISION'],
    },
    {
      id: 'movie-architect',
      title: 'THE ARCHITECT OF SHADOWS',
      slug: 'the-architect-of-shadows',
      description:
        'A dark neo-noir architectural thriller set in a towering brutalist metropolis where towering mega-structures conceal a sinister conspiracy of power and memory.',
      director: 'Julian Sterling',
      musicDirector: 'Trent Reznor & Atticus Ross',
      cast: ['Michael Fassbender', 'Ana de Armas', 'Edward Norton'],
      genre: 'Noir Thriller',
      language: 'English',
      durationMins: 122,
      certification: '15',
      imdbRating: 9.1,
      posterUrl:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
      backdropUrl:
        'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      releaseDate: '2026-11-15',
      status: 'NOW_SHOWING',
      badges: ['70MM PANAVISION', 'ANAMORPHIC SOUND'],
    },
  ];

  private branches: BranchItem[] = [
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
      address: 'High Street Phoenix, Senapati Bapat Marg, Lower Parel, Mumbai, MH 400013',
      screensCount: 5,
      formats: ['70MM IMAX', 'Dolby Atmos', 'VIP Recliner Lounge'],
    },
  ];

  private shows: ShowItem[] = [
    {
      id: 'show-chronos-1730',
      branchId: 'branch-west-end',
      branchName: 'CINEVA IMAX West End',
      city: 'London',
      movieId: 'movie-chronos',
      movieTitle: 'CHRONOS: BEYOND TIME',
      screenId: 'screen-aud-1',
      screenName: 'Auditorium 1 — Ultra IMAX Laser',
      screenFormat: '70mm IMAX Laser',
      date: '2026-11-05',
      startTime: '17:30',
      endTime: '20:18',
      pricing: { STANDARD: 18.5, PREMIUM: 28.0, VIP_SUITE: 35.0 },
      audioSpec: 'Dolby Atmos 128-channel Spatial Dome',
      projectionSpec: 'Curved 70ft Harkness Silver Screen',
    },
    {
      id: 'show-chronos-2045',
      branchId: 'branch-west-end',
      branchName: 'CINEVA IMAX West End',
      city: 'London',
      movieId: 'movie-chronos',
      movieTitle: 'CHRONOS: BEYOND TIME',
      screenId: 'screen-aud-1',
      screenName: 'Auditorium 1 — Ultra IMAX Laser',
      screenFormat: '70mm IMAX Laser',
      date: '2026-11-05',
      startTime: '20:45',
      endTime: '23:33',
      pricing: { STANDARD: 18.5, PREMIUM: 28.0, VIP_SUITE: 35.0 },
      audioSpec: 'Dolby Atmos 128-channel Spatial Dome',
      projectionSpec: 'Curved 70ft Harkness Silver Screen',
    },
    {
      id: 'show-solaris-1915',
      branchId: 'branch-west-end',
      branchName: 'CINEVA IMAX West End',
      city: 'London',
      movieId: 'movie-solaris',
      movieTitle: 'SOLARIS ODYSSEY',
      screenId: 'screen-aud-2',
      screenName: 'Screen 02 — Dolby Cinema Atmos',
      screenFormat: 'Dolby 3D',
      date: '2026-11-05',
      startTime: '19:15',
      endTime: '21:30',
      pricing: { STANDARD: 16.0, PREMIUM: 24.0, VIP_SUITE: 30.0 },
      audioSpec: 'Dolby Atmos Dual Laser',
      projectionSpec: 'Dolby Vision High Dynamic Range',
    },
    {
      id: 'show-architect-2200',
      branchId: 'branch-west-end',
      branchName: 'CINEVA IMAX West End',
      city: 'London',
      movieId: 'movie-architect',
      movieTitle: 'THE ARCHITECT OF SHADOWS',
      screenId: 'screen-aud-1',
      screenName: 'Auditorium 1 — Ultra IMAX Laser',
      screenFormat: '70MM Panavision',
      date: '2026-11-05',
      startTime: '22:00',
      endTime: '00:02',
      pricing: { STANDARD: 17.5, PREMIUM: 26.0, VIP_SUITE: 32.0 },
      audioSpec: 'Dolby Atmos 128-channel',
      projectionSpec: 'Panavision Anamorphic 70mm',
    },
  ];

  // Booked seats per show ID
  private showBookings: Map<string, Set<string>> = new Map();
  // Persistent booking confirmations
  private bookings: Map<string, BookingRecord> = new Map();

  constructor() {
    // Initialize default booked seats for standard demo shows
    this.showBookings.set('show-chronos-1730', new Set(DEFAULT_PRE_BOOKED));
    this.showBookings.set('show-chronos-2045', new Set(['C-5', 'C-6', 'D-9', 'D-10', 'E-8', 'E-9', 'F-7']));
    this.showBookings.set('show-solaris-1915', new Set(['B-4', 'B-5', 'D-7', 'D-8', 'E-9']));
    this.showBookings.set('show-architect-2200', new Set(['C-8', 'C-9', 'E-10', 'E-11']));
  }

  getMovies(): MovieItem[] {
    return this.movies;
  }

  getMovie(idOrSlug: string): MovieItem | undefined {
    return this.movies.find((m) => m.id === idOrSlug || m.slug === idOrSlug);
  }

  getBranches(): BranchItem[] {
    return this.branches;
  }

  getShows(filters?: { movieId?: string; branchId?: string; date?: string }): ShowItem[] {
    return this.shows.filter((s) => {
      if (filters?.movieId && s.movieId !== filters.movieId) return false;
      if (filters?.branchId && s.branchId !== filters.branchId) return false;
      if (filters?.date && s.date !== filters.date) return false;
      return true;
    });
  }

  getShow(showId: string): ShowItem | undefined {
    return this.shows.find((s) => s.id === showId);
  }

  /**
   * Generates the structured 3D fan-shaped curved seating layout matching the in70mm Curved Cinema Reference Architecture
   */
  getShowLayoutAndSeats(showId: string, currentUserId: string = 'guest'): {
    show: ShowItem;
    seats: SeatNode[];
    summary: { total: number; available: number; held: number; booked: number };
    pricing: Record<string, number>;
  } {
    const show = this.getShow(showId) || this.shows[0];
    const bookedSet = this.showBookings.get(show.id) || new Set();
    const activeHolds = seatLockService.getActiveHolds(show.id);

    const seats: SeatNode[] = [];
    let availableCount = 0;
    let heldCount = 0;
    let bookedCount = 0;

    for (const cfg of FAN_ROW_CONFIGS) {
      const R = cfg.radius;
      const Y = cfg.y;

      interface SeatGenDef {
        seatNumber: number;
        theta: number;
        section: 'LEFT' | 'CENTER' | 'RIGHT';
      }
      const rowSeats: SeatGenDef[] = [];

      // Left Section: aisle seat is at -15.5 deg, stepping outwards
      const tEndL = (-15.5 * Math.PI) / 180;
      const stepAngle = (2.8 * Math.PI) / 180;
      const numL = cfg.leftSeats.length;
      for (let i = 0; i < numL; i++) {
        const theta = tEndL - (numL - 1 - i) * stepAngle;
        rowSeats.push({
          seatNumber: cfg.leftSeats[i],
          theta,
          section: 'LEFT',
        });
      }

      // Center Section: symmetrical curve around theta = 0
      const numC = cfg.centerSeats.length;
      const maxC = 12.0 * (Math.PI / 180);
      const spanC = numC >= 17 ? maxC : (numC / 17) * maxC;
      for (let i = 0; i < numC; i++) {
        const frac = numC > 1 ? i / (numC - 1) : 0.5;
        const theta = -spanC + frac * (2 * spanC);
        rowSeats.push({
          seatNumber: cfg.centerSeats[i],
          theta,
          section: 'CENTER',
        });
      }

      // Right Section: begins at +15.5 deg and steps outwards
      const tStartR = (15.5 * Math.PI) / 180;
      const numR = cfg.rightSeats.length;
      for (let i = 0; i < numR; i++) {
        const theta = tStartR + i * stepAngle;
        rowSeats.push({
          seatNumber: cfg.rightSeats[i],
          theta,
          section: 'RIGHT',
        });
      }

      const wheelchairSet = new Set(cfg.wheelchairSeats || []);

      for (const item of rowSeats) {
        const { seatNumber, theta, section } = item;
        const seatCode = `${cfg.rowName}-${seatNumber}`;
        const posX = Number((R * Math.sin(theta)).toFixed(3));
        const posZ = Number((Z_CENTER + R * Math.cos(theta)).toFixed(3));
        const posY = Number(Y.toFixed(3));
        const angleY = Number((-theta).toFixed(4)); // Direct radial alignment facing central screen

        let status: 'AVAILABLE' | 'HELD' | 'BOOKED' = 'AVAILABLE';
        if (bookedSet.has(seatCode)) {
          status = 'BOOKED';
          bookedCount++;
        } else if (activeHolds.has(seatCode)) {
          status = 'HELD';
          heldCount++;
        } else {
          availableCount++;
        }

        const isVipCenter =
          cfg.rowName === 'E' &&
          section === 'CENTER' &&
          (seatNumber === 15 || seatNumber === 16);

        const isWheelchair = wheelchairSet.has(seatNumber);

        seats.push({
          rowName: cfg.rowName,
          seatNumber,
          seatCode,
          section,
          tier: cfg.tier,
          category: cfg.category,
          price: cfg.price,
          status,
          isVipCenter,
          isWheelchair,
          x: posX,
          y: posY,
          z: posZ,
          angleY,
        });
      }
    }

    return {
      show,
      seats,
      summary: {
        total: seats.length,
        available: availableCount,
        held: heldCount,
        booked: bookedCount,
      },
      pricing: show.pricing,
    };
  }

  /**
   * Atomically hold seats for 10 minutes
   */
  async holdSeats(showId: string, seatCodes: string[], userId: string) {
    const bookedSet = this.showBookings.get(showId) || new Set();
    return await seatLockService.holdSeats(showId, seatCodes, userId, bookedSet);
  }

  /**
   * Complete booking checkout after verified payment
   */
  async confirmBooking(data: {
    showId: string;
    seatCodes: string[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: string;
    paymentId: string;
  }): Promise<BookingRecord> {
    const show = this.getShow(data.showId) || this.shows[0];
    const movie = this.getMovie(show.movieId)!;

    // Allocate seats permanently in store
    let bookedSet = this.showBookings.get(show.id);
    if (!bookedSet) {
      bookedSet = new Set();
      this.showBookings.set(show.id, bookedSet);
    }

    for (const code of data.seatCodes) {
      bookedSet.add(code);
    }

    // Release temporary holds
    await seatLockService.releaseSeats(show.id, data.seatCodes);

    // Calculate totals
    const layout = this.getShowLayoutAndSeats(show.id);
    let subtotal = 0;
    for (const code of data.seatCodes) {
      const seat = layout.seats.find((s) => s.seatCode === code);
      subtotal += seat?.price || 28.0;
    }
    const convenienceFee = 0.0; // Preservation fee included in CINEVA experience
    const taxAmount = +(subtotal * 0.18).toFixed(2);
    const totalAmount = +(subtotal + convenienceFee + taxAmount).toFixed(2);

    const bookingRef = `CNM-${Math.floor(10000 + Math.random() * 90000)}`;
    const bookingId = `book-${crypto.randomUUID().substring(0, 8)}`;

    const tickets = await Promise.all(
      data.seatCodes.map(async (seatCode) => {
        const ticketNumber = `TKT-${bookingRef}-${seatCode}`;
        const qrPayload = ticketService.generateQRToken(ticketNumber, `${show.date}T${show.startTime}:00Z`);
        const qrCodeDataUrl = await ticketService.generateQRCodeDataUrl(qrPayload);
        return {
          ticketNumber,
          seatCode,
          qrPayload,
          qrCodeDataUrl,
          status: 'ACTIVE' as const,
        };
      })
    );

    const record: BookingRecord = {
      id: bookingId,
      bookingReference: bookingRef,
      showId: show.id,
      movieTitle: movie.title,
      moviePosterUrl: movie.posterUrl,
      branchName: show.branchName,
      city: show.city,
      screenName: show.screenName,
      screenFormat: show.screenFormat,
      showTime: `${show.startTime} BST`,
      date: show.date,
      seatCodes: data.seatCodes,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      subtotal,
      convenienceFee,
      taxAmount,
      totalAmount,
      status: 'CONFIRMED',
      paymentMethod: data.paymentMethod,
      paymentStatus: 'SUCCESS',
      createdAt: new Date().toISOString(),
      tickets,
    };

    this.bookings.set(bookingId, record);
    this.bookings.set(bookingRef, record);

    return record;
  }

  getBooking(idOrRef: string): BookingRecord | undefined {
    return this.bookings.get(idOrRef);
  }

  getBookingsByCustomer(emailOrPhone: string): BookingRecord[] {
    const list: BookingRecord[] = [];
    const seen = new Set<string>();
    for (const b of this.bookings.values()) {
      if (
        (b.customerEmail.toLowerCase() === emailOrPhone.toLowerCase() || b.customerPhone === emailOrPhone) &&
        !seen.has(b.id)
      ) {
        seen.add(b.id);
        list.push(b);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const cinemaStore = new CinemaStore();
