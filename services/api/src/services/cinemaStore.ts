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

export interface BranchItem {
  id: string;
  name: string;
  city: string;
  address: string;
  screensCount: number;
  formats: string[];
  facilities?: string[];
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

// All seats start fully available for user reservation
const DEFAULT_PRE_BOOKED = new Set<string>();

class CinemaStore {
  private movies: MovieItem[] = [
    {
      id: 'movie-ramayana',
      title: 'Ramayana',
      slug: 'ramayana',
      description:
        'The immortal story of Rama and Ravana defined a culture and moved generations. It now arrives as a cinematic landmark of our time. Ramayana is a timeless saga reborn through the lens of modern Indian cinema.',
      director: 'Nitesh Tiwari',
      musicDirector: 'A. R. Rahman & Hans Zimmer',
      producer: 'Namit Malhotra, Yash',
      cast: [
        'Ranbir Kapoor (Rama)',
        'Yash (Ravana)',
        'Sai Pallavi (Sita)',
        'Ravie Dubey (Lakshman)',
        'Sunny Deol (Hanuman)',
        'Kajal Aggarwal (Mandodari)',
        'Vivek Oberoi',
        'Anupam Kher',
        'Lara Dutta',
        'Rakul Preet Singh',
      ],
      genre: 'Action / Adventure / Drama / Mythological',
      language: 'Hindi, Tamil',
      durationMins: 195,
      certification: 'U',
      imdbRating: 9.3,
      ratingLabel: '9.3/10 (254K+ Votes)',
      posterUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/ramayana-et00451914-1793772172.jpg',
      backdropUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/ramayana-et00451914-1793772172.jpg',
      trailerUrl: 'https://in.bookmyshow.com/movies/trichy/ramayana/ET00451914',
      bookMyShowUrl: 'https://in.bookmyshow.com/movies/trichy/ramayana/ET00451914',
      releaseDate: '2026-11-05',
      status: 'NOW_SHOWING',
      badges: ['3D', 'DOLBY ATMOS', '4DX 3D', 'EPIQ 3D'],
    },
    {
      id: 'movie-jailer-2',
      title: 'Jailer 2',
      slug: 'jailer-2',
      description:
        'Jailer 2 follows retired jailer Tiger Muthuvel Pandian (Rajinikanth) as a new threat from the criminal underworld shatters his peaceful life, forcing him to return to his ruthless ways to protect his family and legacy.',
      director: 'Nelson Dilipkumar',
      musicDirector: 'Anirudh Ravichander',
      producer: 'Kalanithi Maran',
      cast: [
        'Rajinikanth (Muthuvel Pandian)',
        'Vidya Balan (Kantha)',
        'Mohanlal (Mathew)',
        'Dr. Shiva Rajkumar (Narasimha)',
        'S. J. Suryah (Bodhi)',
        'Ramya Krishnan',
        'Jackie Shroff',
        'Yogi Babu',
      ],
      genre: 'Action / Thriller',
      language: 'Tamil, Telugu',
      durationMins: 165,
      certification: 'UA16+',
      imdbRating: 9.5,
      ratingLabel: '400K+ Interested',
      posterUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/jailer-2-et00518674-1793799981.jpg',
      backdropUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/jailer-2-et00518674-1793799981.jpg',
      trailerUrl: 'https://in.bookmyshow.com/movies/trichy/jailer-2/ET00518674',
      bookMyShowUrl: 'https://in.bookmyshow.com/movies/trichy/jailer-2/ET00518674',
      releaseDate: '2026-10-15',
      status: 'NOW_SHOWING',
      badges: ['2D', 'DOLBY CINEMA 2D', '4DX', 'HDR BY BARCO'],
    },
    {
      id: 'movie-mookuthi-amman-2',
      title: 'Mookuthi Amman 2',
      slug: 'mookuthi-amman-2',
      description:
        'A queen sacrifices herself to protect her son, the prince, from invading enemies. Mookuthi Amman returns to protect the child and confronts a mysterious woman who embodies a new and dangerous evil.',
      director: 'Sundar C.',
      musicDirector: 'Hiphop Tamizha',
      producer: 'Ishari K Ganesh',
      cast: [
        'Nayanthara',
        'Regina Cassandra',
        'Urvashi',
        'Yogi Babu',
        'Duniya Vijay',
        'Garuda Ram',
      ],
      genre: 'Comedy / Devotional / Fantasy / Thriller',
      language: 'Tamil, Malayalam',
      durationMins: 144,
      certification: 'UA16+',
      imdbRating: 8.8,
      ratingLabel: '69.2K+ Interested',
      posterUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/mookuthi-amman-2-et00517348-1793776148.jpg',
      backdropUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/mookuthi-amman-2-et00517348-1793776148.jpg',
      trailerUrl: 'https://in.bookmyshow.com/movies/trichy/mookuthi-amman-2/ET00517348',
      bookMyShowUrl: 'https://in.bookmyshow.com/movies/trichy/mookuthi-amman-2/ET00517348',
      releaseDate: '2026-11-06',
      status: 'NOW_SHOWING',
      badges: ['2D', 'EPIQ', 'RGB 4K LASER ATMOS'],
    },
    {
      id: 'movie-mandaadi',
      title: 'Mandaadi',
      slug: 'mandaadi',
      description:
        "The story follows a fierce battle between Kaali's and Saattaappuli's teams as they compete in a traditional sailboat race held in South India.",
      director: 'Pugazhendhi Mathimaran',
      musicDirector: 'G. V. Prakash Kumar',
      producer: 'Elred Kumar',
      cast: [
        'Soori',
        'Suhas',
        'Mahima Nambiar',
        'Sathyaraj',
        'Ravindra Vijay',
        'Kritika Balasubramanian',
      ],
      genre: 'Action / Drama / Sports',
      language: 'Tamil, Hindi',
      durationMins: 154,
      certification: 'UA16+',
      imdbRating: 9.4,
      ratingLabel: '9.4/10 (96.8K+ Votes)',
      posterUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/mandaadi-et00442702-1789145092.jpg',
      backdropUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/mandaadi-et00442702-1789145092.jpg',
      trailerUrl: 'https://in.bookmyshow.com/movies/trichy/mandaadi/ET00442702',
      bookMyShowUrl: 'https://in.bookmyshow.com/movies/trichy/mandaadi/ET00442702',
      releaseDate: '2026-09-10',
      status: 'NOW_SHOWING',
      badges: ['2D', 'IMAX 2D', 'DOLBY CINEMA 2D', 'HDR BY BARCO'],
    },
    {
      id: 'movie-scene',
      title: 'Scene',
      slug: 'scene',
      description:
        'A hard-hitting story that follows a series of interconnected events uncovering hidden truths, tested loyalties, and raw emotions.',
      director: 'Karthik',
      musicDirector: 'Karthik',
      cast: ['Natarajan Subramaniam (Natty)', 'Rishi', 'Radha Ravi', 'G. Marimuthu'],
      genre: 'Action / Drama / Thriller',
      language: 'Tamil',
      durationMins: 149,
      certification: 'UA16+',
      imdbRating: 7.7,
      ratingLabel: '7.7/10 (3.1K+ Votes)',
      posterUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/scene-et00516631-1793771165.jpg',
      backdropUrl:
        'https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/xxlarge/scene-et00516631-1793771165.jpg',
      trailerUrl: 'https://in.bookmyshow.com/movies/trichy/scene/ET00516631',
      bookMyShowUrl: 'https://in.bookmyshow.com/movies/trichy/scene/ET00516631',
      releaseDate: '2026-03-06',
      status: 'NOW_SHOWING',
      badges: ['2D', 'RGB LASER 4K ATMOS'],
    },
  ];

  private branches: BranchItem[] = [
    // TRICHY (TIRUCHIRAPPALLI) CINEMAS FROM BOOKMYSHOW
    {
      id: 'branch-trichy-la-maris',
      name: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      address: 'Fort Station Road, Tiruchirappalli, Tamil Nadu 620002',
      screensCount: 2,
      formats: ['RGB Laser 4K Atmos', '4K Laser Dolby Atmos', 'Dolby 7.1', '3D'],
      facilities: ['M-Ticket', 'F&B', 'Parking', 'Ticket Cancellation'],
    },
    {
      id: 'branch-trichy-mariyam',
      name: 'Mariyam Cinemas A/C 4K: Trichy',
      city: 'Trichy',
      address: 'Trichy Main Road, Samayapuram, Tiruchirappalli, Tamil Nadu 621112',
      screensCount: 2,
      formats: ['RGB 4K Laser Atmos', 'Dolby 7.1'],
      facilities: ['M-Ticket', 'F&B', 'Parking', 'Non-cancellable'],
    },
    {
      id: 'branch-trichy-la-thiruverumbur',
      name: 'LA Cinema: Thiruverumbur',
      city: 'Trichy',
      address: 'Trichy - Thanjavur Main Road, Thiruverumbur, Tiruchirappalli 620013',
      screensCount: 2,
      formats: ['Dolby Atmos', 'Dolby 7.1'],
      facilities: ['M-Ticket', 'F&B', 'Ticket Cancellation'],
    },
    {
      id: 'branch-trichy-la-sona-mina',
      name: 'LA Cinema: Sona Mina, Trichy',
      city: 'Trichy',
      address: 'Madurai Road, Tiruchirappalli, Tamil Nadu 620008',
      screensCount: 3,
      formats: ['4K Laser', 'Dolby Atmos', 'Dolby 7.1', '3D'],
      facilities: ['M-Ticket', 'F&B', 'Ticket Cancellation'],
    },
    {
      id: 'branch-trichy-megastar',
      name: 'Megastar Cinemas: Premium Large Format ATMOS LASER',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 2,
      formats: ['PLF 1.85 Flat', 'Dolby Atmos Laser'],
      facilities: ['M-Ticket', 'F&B', 'Premium Large Format'],
    },
    {
      id: 'branch-trichy-cauvery',
      name: 'Cauvery Cinemas 4K RGB LASER: Trichy',
      city: 'Trichy',
      address: 'Heber Road, Palakarai, Near Corporation Park, Tiruchirappalli 620001',
      screensCount: 1,
      formats: ['4K RGB Laser', 'Dolby Atmos'],
      facilities: ['M-Ticket', 'Parking'],
    },
    {
      id: 'branch-trichy-star',
      name: 'STAR CINEMAS A/C RGB LASER: TRICHY',
      city: 'Trichy',
      address: 'Karur Bypass Road, Tiruchirappalli, Tamil Nadu 620002',
      screensCount: 1,
      formats: ['RGB Laser'],
      facilities: ['M-Ticket', 'Ticket Cancellation'],
    },
    {
      id: 'branch-trichy-bhelec',
      name: 'BHELEC Cinema A/C Dolby 7.1: Trichy',
      city: 'Trichy',
      address: 'BHEL Township, Kailasapuram, Tiruchirappalli, Tamil Nadu 620014',
      screensCount: 1,
      formats: ['Dolby 7.1'],
      facilities: ['M-Ticket', 'Ticket Cancellation'],
    },
    {
      id: 'branch-trichy-venkatesa',
      name: 'SRI VENKATESA CINEMAS RGB LASER: TRICHY',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['RGB Laser', 'Dolby Atmos'],
      facilities: ['M-Ticket', 'Ticket Cancellation'],
    },
    {
      id: 'branch-trichy-shanthi',
      name: 'Shanthi Cinemas A/C 4K DOLBY ATMOS: Thiruverumbur',
      city: 'Trichy',
      address: 'Thiruverumbur, Tiruchirappalli, Tamil Nadu 620013',
      screensCount: 1,
      formats: ['4K Dolby Atmos'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-palace',
      name: 'Palace Theatre: Tiruchirappalli',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['2D Digital'],
      facilities: ['M-Ticket', 'Non-cancellable'],
    },
    {
      id: 'branch-trichy-rengaraj',
      name: 'Sri Rengaraj Talkies: Tiruchirappalli',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['2D Digital'],
      facilities: ['M-Ticket', 'Non-cancellable'],
    },
    {
      id: 'branch-trichy-saroja',
      name: 'Saroja Cinemas 2K A/C, Ariyamangalam: Trichy',
      city: 'Trichy',
      address: 'Ariyamangalam, Tiruchirappalli, Tamil Nadu 620010',
      screensCount: 1,
      formats: ['2K Digital'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-moorthys',
      name: 'A-Moorthys Drive-In Theatre: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['Drive-In 2D'],
      facilities: ['M-Ticket', 'Drive-In Parking'],
    },
    {
      id: 'branch-trichy-maala',
      name: 'Maala Cinemas A/C 4K RGB LASER: Thirukaatupalli',
      city: 'Trichy',
      address: 'Thirukaatupalli, Trichy District, Tamil Nadu',
      screensCount: 1,
      formats: ['4K RGB Laser', 'Dolby Atmos'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-jothi',
      name: 'JOTHI CINEMAS -1 RSR-2 DOLBY ATMOS RGB LASER',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 2,
      formats: ['RGB Laser', 'Dolby Atmos'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-ramba',
      name: 'Ramba A/C RGB Laser Dolby Atmos: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['RGB Laser', 'Dolby Atmos'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-urvasy',
      name: 'Urvasy A/C RGB Laser: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['RGB Laser'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-menaka',
      name: 'Menaka A/C RGB Laser: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['RGB Laser'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-vasanth',
      name: 'Vasanth A/C 2K Dolby Atmos: Manapparai',
      city: 'Trichy',
      address: 'Manapparai, Trichy District, Tamil Nadu 621306',
      screensCount: 1,
      formats: ['2K Projection', 'Dolby Atmos'],
      facilities: ['M-Ticket'],
    },
    {
      id: 'branch-trichy-gsquare',
      name: 'G-Square Cinema: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['2D Digital'],
      facilities: ['M-Ticket', 'F&B'],
    },
    {
      id: 'branch-trichy-sona',
      name: 'Sona Cinema A/C: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['2D Digital'],
      facilities: ['M-Ticket', 'F&B'],
    },
    {
      id: 'branch-trichy-mina',
      name: 'Mina Cinema A/C: Trichy',
      city: 'Trichy',
      address: 'Tiruchirappalli, Tamil Nadu',
      screensCount: 1,
      formats: ['2D Digital'],
      facilities: ['M-Ticket', 'F&B'],
    },

    // MULTI-CITY FLAGSHIP VENUES
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

  private shows: ShowItem[] = [
    // =====================================================
    // TRICHY SHOWTIMES (BOOKMYSHOW VERIFIED SCHEDULE)
    // =====================================================

    // --- 1. RAMAYANA (3D Tamil) ---
    {
      id: 'show-ramayana-maris-1830',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'maris-scr-2',
      screenName: 'Screen 2: 4K Laser Dolby Atmos',
      screenFormat: '3D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '21:45',
      displayTime: '06:30 PM',
      cancellable: true,
      priceCategories: 'POSH +3D: ₹240 | ELITE+3D: ₹240',
      pricing: { STANDARD: 240, PREMIUM: 240, VIP_SUITE: 240 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '4K Laser 3D',
    },
    {
      id: 'show-ramayana-maris-2230',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'maris-scr-1',
      screenName: 'Screen 1: RGB Laser 4K Atmos',
      screenFormat: '3D Tamil',
      date: '2026-11-11',
      startTime: '22:30',
      endTime: '01:45',
      displayTime: '10:30 PM',
      cancellable: true,
      priceCategories: 'POSH +3D: ₹240 | ELITE+3D: ₹240',
      pricing: { STANDARD: 240, PREMIUM: 240, VIP_SUITE: 240 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: 'RGB Laser 4K 3D',
    },
    {
      id: 'show-ramayana-sonamina-1830',
      branchId: 'branch-trichy-la-sona-mina',
      branchName: 'LA Cinema: Sona Mina, Trichy',
      city: 'Trichy',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'sonamina-scr-1',
      screenName: 'Audi 1 — Dolby 7.1 3D',
      screenFormat: '3D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '21:45',
      displayTime: '06:30 PM',
      cancellable: true,
      priceCategories: 'ELITE+3D: ₹240',
      pricing: { STANDARD: 240, PREMIUM: 240, VIP_SUITE: 240 },
      audioSpec: 'Dolby 7.1 Surround',
      projectionSpec: '3D Digital Projection',
    },
    {
      id: 'show-ramayana-sonamina-2230',
      branchId: 'branch-trichy-la-sona-mina',
      branchName: 'LA Cinema: Sona Mina, Trichy',
      city: 'Trichy',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'sonamina-scr-1',
      screenName: 'Audi 1 — Dolby 7.1 3D',
      screenFormat: '3D Tamil',
      date: '2026-11-11',
      startTime: '22:30',
      endTime: '01:45',
      displayTime: '10:30 PM',
      cancellable: true,
      priceCategories: 'ELITE+3D: ₹240',
      pricing: { STANDARD: 240, PREMIUM: 240, VIP_SUITE: 240 },
      audioSpec: 'Dolby 7.1 Surround',
      projectionSpec: '3D Digital Projection',
    },

    // --- 2. JAILER 2 (2D Tamil) ---
    {
      id: 'show-jailer2-maris-1845',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'maris-scr-2',
      screenName: 'Audi 2 — Dolby 7.1 / 4K',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:45',
      endTime: '21:30',
      displayTime: '06:45 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '4K Laser Projection',
    },
    {
      id: 'show-jailer2-maris-2245',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'maris-scr-2',
      screenName: 'Audi 2 — Dolby 7.1 / 4K',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:45',
      endTime: '01:30',
      displayTime: '10:45 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '4K Laser Projection',
    },
    {
      id: 'show-jailer2-thiruverumbur-1830',
      branchId: 'branch-trichy-la-thiruverumbur',
      branchName: 'LA Cinema: Thiruverumbur',
      city: 'Trichy',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'thiruverumbur-scr-1',
      screenName: 'Screen 1 — Dolby 7.1',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '21:15',
      displayTime: '06:30 PM',
      cancellable: true,
      priceCategories: 'STANDARD: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '2K Digital A/C',
    },
    {
      id: 'show-jailer2-thiruverumbur-2230',
      branchId: 'branch-trichy-la-thiruverumbur',
      branchName: 'LA Cinema: Thiruverumbur',
      city: 'Trichy',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'thiruverumbur-scr-1',
      screenName: 'Screen 1 — Dolby 7.1',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:30',
      endTime: '01:15',
      displayTime: '10:30 PM',
      cancellable: true,
      priceCategories: 'STANDARD: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '2K Digital A/C',
    },
    {
      id: 'show-jailer2-megastar-1840',
      branchId: 'branch-trichy-megastar',
      branchName: 'Megastar Cinemas: Premium Large Format ATMOS LASER',
      city: 'Trichy',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'megastar-plf-1',
      screenName: 'Large Format 1.85 Flat (Atmos Laser)',
      screenFormat: '2D PLF Atmos',
      date: '2026-11-11',
      startTime: '18:40',
      endTime: '21:25',
      displayTime: '06:40 PM',
      cancellable: true,
      priceCategories: 'PLF ATMS: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos Laser',
      projectionSpec: 'Premium Large Format 1.85 Flat',
    },
    {
      id: 'show-jailer2-megastar-2240',
      branchId: 'branch-trichy-megastar',
      branchName: 'Megastar Cinemas: Premium Large Format ATMOS LASER',
      city: 'Trichy',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'megastar-plf-1',
      screenName: 'Large Format 1.85 Flat (Atmos Laser)',
      screenFormat: '2D PLF Atmos',
      date: '2026-11-11',
      startTime: '22:40',
      endTime: '01:25',
      displayTime: '10:40 PM',
      cancellable: true,
      priceCategories: 'PLF ATMS: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos Laser',
      projectionSpec: 'Premium Large Format 1.85 Flat',
    },

    // --- 3. MOOKUTHI AMMAN 2 (2D Tamil) ---
    {
      id: 'show-ma2-mariyam-1835',
      branchId: 'branch-trichy-mariyam',
      branchName: 'Mariyam Cinemas A/C 4K: Trichy',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'mariyam-scr-1',
      screenName: 'Screen 1: RGB 4K Laser Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:35',
      endTime: '20:59',
      displayTime: '06:35 PM',
      cancellable: false,
      priceCategories: 'VIP: ₹190 | NORMAL: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1 / Atmos',
      projectionSpec: 'RGB 4K Laser',
    },
    {
      id: 'show-ma2-mariyam-2225',
      branchId: 'branch-trichy-mariyam',
      branchName: 'Mariyam Cinemas A/C 4K: Trichy',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'mariyam-scr-1',
      screenName: 'Screen 1: RGB 4K Laser Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:25',
      endTime: '00:49',
      displayTime: '10:25 PM',
      cancellable: false,
      priceCategories: 'VIP: ₹190 | NORMAL: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1 / Atmos',
      projectionSpec: 'RGB 4K Laser',
    },
    {
      id: 'show-ma2-maris-1855',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'maris-scr-2',
      screenName: 'Audi 2 — Dolby 7.1 / 4K',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:55',
      endTime: '21:19',
      displayTime: '06:55 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '4K Laser',
    },
    {
      id: 'show-ma2-maris-2255',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'maris-scr-2',
      screenName: 'Audi 2 — Dolby 7.1 / 4K',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:55',
      endTime: '01:19',
      displayTime: '10:55 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '4K Laser',
    },
    {
      id: 'show-ma2-thiruverumbur-1900',
      branchId: 'branch-trichy-la-thiruverumbur',
      branchName: 'LA Cinema: Thiruverumbur',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'thiruverumbur-scr-2',
      screenName: 'Screen 2 — Dolby 7.1',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '21:24',
      displayTime: '07:00 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '2K Digital',
    },
    {
      id: 'show-ma2-sonamina-1900',
      branchId: 'branch-trichy-la-sona-mina',
      branchName: 'LA Cinema: Sona Mina, Trichy',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'sonamina-scr-2',
      screenName: 'Screen 2 — 4K Laser / Dolby 7.1',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '21:24',
      displayTime: '07:00 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '4K Laser',
    },
    {
      id: 'show-ma2-venkatesa-1830',
      branchId: 'branch-trichy-venkatesa',
      branchName: 'SRI VENKATESA CINEMAS RGB LASER: TRICHY',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'venkatesa-scr-1',
      screenName: 'RGB Laser Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '20:54',
      displayTime: '06:30 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: 'RGB Laser',
    },
    {
      id: 'show-ma2-shanthi-1830',
      branchId: 'branch-trichy-shanthi',
      branchName: 'Shanthi Cinemas A/C 4K DOLBY ATMOS: Thiruverumbur',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'shanthi-scr-1',
      screenName: '4K Dolby Atmos Screen',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '20:54',
      displayTime: '06:30 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '4K Projection',
    },
    {
      id: 'show-ma2-saroja-1830',
      branchId: 'branch-trichy-saroja',
      branchName: 'Saroja Cinemas 2K A/C, Ariyamangalam: Trichy',
      city: 'Trichy',
      movieId: 'movie-mookuthi-amman-2',
      movieTitle: 'Mookuthi Amman 2',
      screenId: 'saroja-scr-1',
      screenName: 'Main 2K A/C Hall',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '20:54',
      displayTime: '06:30 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: '2K Surround A/C',
      projectionSpec: '2K Digital',
    },

    // --- 4. MANDAADI (2D Tamil) ---
    {
      id: 'show-mandaadi-palace-2200',
      branchId: 'branch-trichy-palace',
      branchName: 'Palace Theatre: Tiruchirappalli',
      city: 'Trichy',
      movieId: 'movie-mandaadi',
      movieTitle: 'Mandaadi',
      screenId: 'palace-scr-1',
      screenName: 'Main Heritage Auditorium',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:00',
      endTime: '00:34',
      displayTime: '10:00 PM',
      cancellable: false,
      priceCategories: 'STANDARD: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Digital Surround',
      projectionSpec: '2K Digital',
    },
    {
      id: 'show-mandaadi-rengaraj-2215',
      branchId: 'branch-trichy-rengaraj',
      branchName: 'Sri Rengaraj Talkies: Tiruchirappalli',
      city: 'Trichy',
      movieId: 'movie-mandaadi',
      movieTitle: 'Mandaadi',
      screenId: 'rengaraj-scr-1',
      screenName: 'Main Talkies Auditorium',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:15',
      endTime: '00:49',
      displayTime: '10:15 PM',
      cancellable: false,
      priceCategories: 'STANDARD: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Digital Surround',
      projectionSpec: '2K Digital',
    },

    // --- 5. SCENE (2D Tamil) ---
    {
      id: 'show-scene-maris-1840',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'maris-scr-1',
      screenName: 'RGB Laser 4K Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:40',
      endTime: '21:09',
      displayTime: '06:40 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190 | BUDGET: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: 'RGB Laser 4K',
    },
    {
      id: 'show-scene-maris-1900',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'maris-scr-2',
      screenName: 'Dolby 7.1 / 4K',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '21:29',
      displayTime: '07:00 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190 | BUDGET: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '4K Digital',
    },
    {
      id: 'show-scene-maris-2240',
      branchId: 'branch-trichy-la-maris',
      branchName: 'LA CINEMA: MARIS, TRICHY',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'maris-scr-1',
      screenName: 'RGB Laser 4K Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:40',
      endTime: '01:09',
      displayTime: '10:40 PM',
      cancellable: true,
      priceCategories: 'ELITE: ₹190 | PREMIUM: ₹190 | BUDGET: ₹190',
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: 'RGB Laser 4K',
    },
    {
      id: 'show-scene-thiruverumbur-1840',
      branchId: 'branch-trichy-la-thiruverumbur',
      branchName: 'LA Cinema: Thiruverumbur',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'thiruverumbur-scr-1',
      screenName: 'Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:40',
      endTime: '21:09',
      displayTime: '06:40 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '2K Digital',
    },
    {
      id: 'show-scene-thiruverumbur-2235',
      branchId: 'branch-trichy-la-thiruverumbur',
      branchName: 'LA Cinema: Thiruverumbur',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'thiruverumbur-scr-1',
      screenName: 'Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:35',
      endTime: '01:04',
      displayTime: '10:35 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '2K Digital',
    },
    {
      id: 'show-scene-sonamina-1840',
      branchId: 'branch-trichy-la-sona-mina',
      branchName: 'LA Cinema: Sona Mina, Trichy',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'sonamina-scr-1',
      screenName: 'Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:40',
      endTime: '21:09',
      displayTime: '06:40 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '4K Laser',
    },
    {
      id: 'show-scene-sonamina-2235',
      branchId: 'branch-trichy-la-sona-mina',
      branchName: 'LA Cinema: Sona Mina, Trichy',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'sonamina-scr-2',
      screenName: 'Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:35',
      endTime: '01:04',
      displayTime: '10:35 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '4K Laser',
    },
    {
      id: 'show-scene-cauvery-1900',
      branchId: 'branch-trichy-cauvery',
      branchName: 'Cauvery Cinemas 4K RGB LASER: Trichy',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'cauvery-scr-1',
      screenName: '4K RGB Laser • Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '21:29',
      displayTime: '07:00 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '4K RGB Laser',
    },
    {
      id: 'show-scene-cauvery-2215',
      branchId: 'branch-trichy-cauvery',
      branchName: 'Cauvery Cinemas 4K RGB LASER: Trichy',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'cauvery-scr-1',
      screenName: '4K RGB Laser • Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '22:15',
      endTime: '00:44',
      displayTime: '10:15 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: '4K RGB Laser',
    },
    {
      id: 'show-scene-star-1830',
      branchId: 'branch-trichy-star',
      branchName: 'STAR CINEMAS A/C RGB LASER: TRICHY',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'star-scr-1',
      screenName: 'A/C RGB Laser Hall',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '20:59',
      displayTime: '06:30 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Digital A/C Surround',
      projectionSpec: 'RGB Laser',
    },
    {
      id: 'show-scene-bhelec-1900',
      branchId: 'branch-trichy-bhelec',
      branchName: 'BHELEC Cinema A/C Dolby 7.1: Trichy',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'bhelec-scr-1',
      screenName: 'Dolby 7.1 A/C Auditorium',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '21:29',
      displayTime: '07:00 PM',
      cancellable: true,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby 7.1',
      projectionSpec: '2K Digital',
    },
    {
      id: 'show-scene-moorthys-1900',
      branchId: 'branch-trichy-moorthys',
      branchName: 'A-Moorthys Drive-In Theatre: Trichy',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'moorthys-scr-1',
      screenName: 'Open Air Drive-In Screen',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '21:29',
      displayTime: '07:00 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Drive-In FM + Outdoor Audio',
      projectionSpec: 'Digital Projection',
    },
    {
      id: 'show-scene-maala-1830',
      branchId: 'branch-trichy-maala',
      branchName: 'Maala Cinemas A/C 4K RGB LASER: Thirukaatupalli',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'maala-scr-1',
      screenName: '4K Dolby Atmos Auditorium',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '20:59',
      displayTime: '06:30 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: '4K Dolby Atmos',
      projectionSpec: '4K RGB Laser',
    },
    {
      id: 'show-scene-jothi-1830',
      branchId: 'branch-trichy-jothi',
      branchName: 'JOTHI CINEMAS -1 RSR-2 DOLBY ATMOS RGB LASER',
      city: 'Trichy',
      movieId: 'movie-scene',
      movieTitle: 'Scene',
      screenId: 'jothi-scr-1',
      screenName: 'JOTHI RSR-2 RGB Laser',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '20:59',
      displayTime: '06:30 PM',
      cancellable: false,
      pricing: { STANDARD: 190, PREMIUM: 190, VIP_SUITE: 190 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: 'RGB Laser',
    },

    // =====================================================
    // OTHER CITIES (MULTI-CITY SUPPORT)
    // =====================================================
    {
      id: 'show-ramayana-blr-1830',
      branchId: 'branch-bengaluru',
      branchName: 'CINEVA Forum South',
      city: 'Bengaluru',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'screen-aud-1',
      screenName: 'IMAX Audi 1 — Dual Laser 3D',
      screenFormat: 'IMAX Laser 3D',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '21:45',
      displayTime: '06:30 PM',
      cancellable: true,
      pricing: { STANDARD: 280, PREMIUM: 360, VIP_SUITE: 520 },
      audioSpec: 'Dolby Atmos 64-channel 3D Sound',
      projectionSpec: 'IMAX Dual Laser 4K',
    },
    {
      id: 'show-jailer2-blr-2115',
      branchId: 'branch-bengaluru',
      branchName: 'CINEVA Forum South',
      city: 'Bengaluru',
      movieId: 'movie-jailer-2',
      movieTitle: 'Jailer 2',
      screenId: 'screen-aud-2',
      screenName: 'Audi 2 — Dolby Atmos',
      screenFormat: '2D Tamil',
      date: '2026-11-11',
      startTime: '21:15',
      endTime: '00:00',
      displayTime: '09:15 PM',
      cancellable: true,
      pricing: { STANDARD: 220, PREMIUM: 290, VIP_SUITE: 420 },
      audioSpec: 'Dolby Atmos',
      projectionSpec: 'Christie 4K Laser',
    },
    {
      id: 'show-ramayana-mum-1900',
      branchId: 'branch-mumbai',
      branchName: 'CINEVA Palladium',
      city: 'Mumbai',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'screen-aud-1',
      screenName: 'Grand Audi 1 — 70MM IMAX 3D',
      screenFormat: '70MM IMAX 3D',
      date: '2026-11-11',
      startTime: '19:00',
      endTime: '22:15',
      displayTime: '07:00 PM',
      cancellable: true,
      pricing: { STANDARD: 320, PREMIUM: 450, VIP_SUITE: 650 },
      audioSpec: 'IMAX 12-Channel Immersive Audio',
      projectionSpec: 'IMAX 3D Dual Laser',
    },
    {
      id: 'show-ramayana-ldn-1830',
      branchId: 'branch-west-end',
      branchName: 'CINEVA IMAX West End',
      city: 'London',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'screen-aud-1',
      screenName: 'Auditorium 1 — Ultra IMAX Laser',
      screenFormat: 'IMAX 3D',
      date: '2026-11-11',
      startTime: '18:30',
      endTime: '21:45',
      displayTime: '06:30 PM',
      cancellable: true,
      pricing: { STANDARD: 18.5, PREMIUM: 28.0, VIP_SUITE: 35.0 },
      audioSpec: 'Dolby Atmos 128-channel Spatial Dome',
      projectionSpec: 'Curved 70ft Harkness Silver Screen',
    },
    {
      id: 'show-ramayana-ny-1930',
      branchId: 'branch-new-york',
      branchName: 'CINEVA Lincoln Square',
      city: 'New York',
      movieId: 'movie-ramayana',
      movieTitle: 'Ramayana',
      screenId: 'screen-aud-1',
      screenName: 'Auditorium 1 — 70MM IMAX Laser',
      screenFormat: 'IMAX 3D',
      date: '2026-11-11',
      startTime: '19:30',
      endTime: '22:45',
      displayTime: '07:30 PM',
      cancellable: true,
      pricing: { STANDARD: 21.0, PREMIUM: 29.0, VIP_SUITE: 38.0 },
      audioSpec: 'Dolby Atmos 128-channel Spatial Dome',
      projectionSpec: 'IMAX Dual Laser 3D',
    },
  ];

  // Booked seats per show ID
  private showBookings: Map<string, Set<string>> = new Map();
  // Persistent booking confirmations
  private bookings: Map<string, BookingRecord> = new Map();

  constructor() {
    // Zero pre-booked seats by default: all seats in every auditorium start 100% available
    // Seats are only marked as BOOKED when the customer completes checkout!
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

        const resolvedPrice = show.pricing?.[cfg.category] ?? cfg.price;

        seats.push({
          rowName: cfg.rowName,
          seatNumber,
          seatCode,
          section,
          tier: cfg.tier,
          category: cfg.category,
          price: resolvedPrice,
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
      subtotal += seat?.price || show.pricing.STANDARD;
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
      showTime: show.displayTime || `${show.startTime} ${['Trichy', 'Bengaluru', 'Mumbai'].includes(show.city) ? 'IST' : 'Local'}`,
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
