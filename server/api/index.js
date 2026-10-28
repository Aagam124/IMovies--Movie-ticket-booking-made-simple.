import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB, isDbConnected } from '../config/db.js';
import { assertConfig } from '../config/env.js';

let connectionPromise = null;

async function ensureDatabaseConnection() {
  if (isDbConnected()) {
    return;
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = connectDB().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
}

export default async function handler(req, res) {
  // Validate configuration inside handler so missing env variables don't crash the lambda on cold start
  try {
    assertConfig();
  } catch (configError) {
    console.error('Configuration error:', configError.message);
    return res.status(500).json({
      success: false,
      message: `Backend configuration error: ${configError.message}`,
      hint: 'Please ensure JWT_SECRET is added to your Vercel Environment Variables in the project settings.',
    });
  }

  const isStatusEndpoint =
    req.url === '/' ||
    req.url === '/health' ||
    req.url === '/api/health' ||
    req.originalUrl === '/' ||
    req.originalUrl === '/health' ||
    req.originalUrl === '/api/health';

  try {
    await ensureDatabaseConnection();
  } catch (error) {
    console.error('Database connection failed:', error.message);

    if (!isStatusEndpoint) {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again shortly.',
        error: error.message,
        hint: 'Verify MONGO_URI in Vercel Environment Variables and ensure MongoDB Atlas Network Access allows 0.0.0.0/0 (anywhere).',
      });
    }
  }

  return app(req, res);
}
