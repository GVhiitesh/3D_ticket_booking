import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/v1', routes);
app.use('/api', routes); // backwards compatibility

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CINEVA 3D Cinema Platform API',
    version: '1.0.0',
    currency: 'GBP / INR',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    platform: 'CINEVA — Premium 3D Cinema Experience API',
    endpoints: {
      movies: '/api/v1/movies',
      cinemas: '/api/v1/cinemas',
      shows: '/api/v1/shows',
      holdSeats: 'POST /api/v1/shows/:id/hold-seats',
      checkoutOrder: 'POST /api/v1/bookings/checkout-order',
      verifyPayment: 'POST /api/v1/payments/verify',
      customerBookings: '/api/v1/bookings/customer',
      ticketQR: 'POST /api/v1/tickets/validate-qr',
    },
  });
});

// Centralized error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`[CINEVA API] Listening on http://localhost:${PORT}`);
  console.log(`[CINEVA API] Healthcheck available at http://localhost:${PORT}/health`);
});

export default app;
