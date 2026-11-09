import { Request, Response } from 'express';
import { cinemaStore } from '../services/cinemaStore';
import { ticketService } from '../services/ticketService';

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = cinemaStore.getMovies();
    res.json({ success: true, data: movies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = cinemaStore.getMovie(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = cinemaStore.getBranches();
    res.json({ success: true, data: branches });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getShows = async (req: Request, res: Response) => {
  try {
    const { movieId, branchId, date } = req.query as {
      movieId?: string;
      branchId?: string;
      date?: string;
    };
    const shows = cinemaStore.getShows({ movieId, branchId, date });
    res.json({ success: true, data: shows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getShowLayoutAndSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.query.userId as string) || 'guest';
    const data = cinemaStore.getShowLayoutAndSeats(id, userId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const holdSeats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seatCodes, userId = 'guest-session' } = req.body;

    if (!Array.isArray(seatCodes) || seatCodes.length === 0) {
      return res.status(400).json({ success: false, message: 'Select at least one seat' });
    }

    if (seatCodes.length > 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 seats allowed per booking' });
    }

    const result = await cinemaStore.holdSeats(id, seatCodes, userId);
    if (!result.success) {
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats are no longer available',
        failedSeats: result.failedSeats,
      });
    }

    res.json({
      success: true,
      message: 'Seats held successfully for 10 minutes',
      heldSeats: result.heldSeats,
      expiresAt: result.expiresAt,
      holdDurationSeconds: 600,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCheckoutOrder = async (req: Request, res: Response) => {
  try {
    const { showId, seatCodes, customerName, customerEmail, customerPhone } = req.body;

    if (!showId || !Array.isArray(seatCodes) || seatCodes.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid checkout request' });
    }

    const layout = cinemaStore.getShowLayoutAndSeats(showId);
    let subtotal = 0;
    for (const code of seatCodes) {
      const seat = layout.seats.find((s) => s.seatCode === code);
      subtotal += seat?.price || 28.0;
    }

    const convenienceFee = 0.0;
    const taxAmount = +(subtotal * 0.18).toFixed(2);
    const totalAmount = +(subtotal + convenienceFee + taxAmount).toFixed(2);

    const gatewayOrderId = `order_${crypto.randomUUID().substring(0, 14)}`;

    res.json({
      success: true,
      data: {
        gatewayOrderId,
        amount: totalAmount,
        currency: 'GBP', // or INR
        subtotal,
        convenienceFee,
        taxAmount,
        totalAmount,
        seatCodes,
        show: layout.show,
        customer: { customerName, customerEmail, customerPhone },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPaymentAndConfirm = async (req: Request, res: Response) => {
  try {
    const {
      showId,
      seatCodes,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod = 'UPI',
      gatewayPaymentId = `pay_${Date.now()}`,
    } = req.body;

    if (!showId || !Array.isArray(seatCodes) || seatCodes.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid confirmation payload' });
    }

    const booking = await cinemaStore.confirmBooking({
      showId,
      seatCodes,
      customerName: customerName || 'Film Enthusiast',
      customerEmail: customerEmail || 'customer@cineva.com',
      customerPhone: customerPhone || '+44 7700 900077',
      paymentMethod,
      paymentId: gatewayPaymentId,
    });

    res.json({
      success: true,
      message: 'Booking confirmed and tickets generated successfully',
      data: booking,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = cinemaStore.getBooking(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCustomerBookings = async (req: Request, res: Response) => {
  try {
    const emailOrPhone = (req.query.emailOrPhone as string) || 'customer@cineva.com';
    const bookings = cinemaStore.getBookingsByCustomer(emailOrPhone);
    res.json({ success: true, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const validateTicketQR = async (req: Request, res: Response) => {
  try {
    const { qrPayload } = req.body;
    if (!qrPayload) {
      return res.status(400).json({ success: false, message: 'QR payload is required' });
    }

    const validation = ticketService.validateQRToken(qrPayload);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid, forged or expired ticket QR',
        reason: validation.reason,
      });
    }

    res.json({
      success: true,
      message: 'Ticket validated successfully. Entry permitted.',
      ticketId: validation.ticketId,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
