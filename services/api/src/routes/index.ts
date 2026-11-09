import { Router } from 'express';
import {
  getMovies,
  getMovieById,
  getBranches,
  getShows,
  getShowLayoutAndSeats,
  holdSeats,
  createCheckoutOrder,
  verifyPaymentAndConfirm,
  getBookingById,
  getCustomerBookings,
  validateTicketQR,
} from '../controllers/cinemaController';

const router = Router();

// Movies
router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById);

// Branches / Cinemas
router.get('/branches', getBranches);
router.get('/cinemas', getBranches); // alias for Stitch navigation

// Shows & Schedules
router.get('/shows', getShows);
router.get('/shows/:id/layout-and-seats', getShowLayoutAndSeats);
router.post('/shows/:id/hold-seats', holdSeats);

// Checkout & Payments
router.post('/bookings/checkout-order', createCheckoutOrder);
router.post('/payments/verify', verifyPaymentAndConfirm);

// Bookings & Tickets
router.get('/bookings/customer', getCustomerBookings);
router.get('/bookings/:id', getBookingById);
router.post('/tickets/validate-qr', validateTicketQR);

export default router;
