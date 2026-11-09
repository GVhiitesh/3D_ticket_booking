import { z } from 'zod';

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CINEMA_OWNER: 'CINEMA_OWNER',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  THEATRE_STAFF: 'THEATRE_STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const StaffType = {
  TICKET_CHECKER: 'TICKET_CHECKER',
  BOX_OFFICE_OPERATOR: 'BOX_OFFICE_OPERATOR',
  MANAGER: 'MANAGER',
} as const;
export type StaffTypeType = (typeof StaffType)[keyof typeof StaffType];

export const SeatCategory = {
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  VIP_SUITE: 'VIP_SUITE',
  ACCESSIBLE: 'ACCESSIBLE',
} as const;
export type SeatCategoryType = (typeof SeatCategory)[keyof typeof SeatCategory];

export const SeatStatus = {
  AVAILABLE: 'AVAILABLE',
  HELD: 'HELD',
  BOOKED: 'BOOKED',
  BLOCKED: 'BLOCKED',
} as const;
export type SeatStatusType = (typeof SeatStatus)[keyof typeof SeatStatus];

export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  REQUIRES_REVIEW: 'REQUIRES_REVIEW',
} as const;
export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentMethod = {
  UPI: 'UPI',
  CARD: 'CARD',
  NETBANKING: 'NETBANKING',
  CASH: 'CASH',
} as const;
export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  UNKNOWN: 'UNKNOWN',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const TicketStatus = {
  ACTIVE: 'ACTIVE',
  CHECKED_IN: 'CHECKED_IN',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;
export type TicketStatusType = (typeof TicketStatus)[keyof typeof TicketStatus];

// Zod Validation Schemas
export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  emailOrPhone: z.string().min(3, 'Enter email or phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const seatHoldSchema = z.object({
  showId: z.string().min(1, 'Show ID is required'),
  seatCodes: z.array(z.string()).min(1, 'Select at least one seat').max(10, 'Maximum 10 seats allowed per booking'),
  customerId: z.string().optional(),
});

export const checkoutSchema = z.object({
  showId: z.string().min(1),
  seatCodes: z.array(z.string()).min(1),
  bookingReference: z.string().optional(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'CASH']),
  idempotencyKey: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  bookingId: z.string().min(1),
  gatewayOrderId: z.string().min(1),
  gatewayPaymentId: z.string().min(1),
  gatewaySignature: z.string().min(1),
});

export const qrVerificationSchema = z.object({
  qrPayload: z.string().min(1, 'QR payload required'),
  branchId: z.string().min(1, 'Branch context required'),
});

// Domain Interfaces
export interface SeatLayoutNode {
  rowName: string;
  seatNumber: number;
  seatCode: string; // e.g. "E-9"
  category: SeatCategoryType;
  price: number;
  status: SeatStatusType;
  x: number;
  y: number;
  z: number;
  angleY?: number;
  tier: string;
}

export interface ShowLayoutResponse {
  showId: string;
  movieTitle: string;
  screenName: string;
  screenFormat: string;
  startTime: string;
  pricing: Record<string, number>;
  seats: SeatLayoutNode[];
  summary: {
    totalSeats: number;
    availableSeats: number;
    heldSeats: number;
    bookedSeats: number;
  };
}
