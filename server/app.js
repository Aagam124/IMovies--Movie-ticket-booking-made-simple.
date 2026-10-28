
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { config } from './config/env.js';
import { dbStatus, isDbConnected } from './config/db.js';
import requireDb from './middleware/requireDb.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Allow the deployed frontend and local development frontend.
  const allowedOrigins = [
    'https://i-movies-movie-ticket-booking-ten.vercel.app',
    'http://localhost:5173',
    ...(Array.isArray(config.clientUrls)
      ? config.clientUrls
      : typeof config.clientUrls === 'string'
        ? config.clientUrls.split(',').map((url) => url.trim())
        : []),
  ].filter(Boolean);

  const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    // Allow any Vercel domain (production, branch preview, etc.)
    if (/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.vercel\.app$/.test(origin)) return true;
    // Allow localhost
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
    return false;
  };

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    })
  );

  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  // Health-check endpoint
  const healthCheckHandler = (req, res) => {
    const connected = isDbConnected();

    res.status(connected ? 200 : 503).json({
      success: connected,
      status: connected ? 'ok' : 'degraded',
      database: {
        status: dbStatus(),
        name: connected ? mongoose.connection.name : null,
      },
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  };

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'IMovies API is running',
      status: 'ok',
      health: '/api/health',
    });
  });
  app.get('/health', healthCheckHandler);
  app.get('/api/health', healthCheckHandler);

  // API router
  const apiRouter = express.Router();
  apiRouter.use(requireDb);
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/movies', movieRoutes);
  apiRouter.use('/theatres', theatreRoutes);
  apiRouter.use('/shows', showRoutes);
  apiRouter.use('/bookings', bookingRoutes);
  apiRouter.use('/favorites', favoriteRoutes);
  apiRouter.use('/reviews', reviewRoutes);
  apiRouter.use('/admin', adminRoutes);

  // Mount API router under both '/api' and '/'
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp();
