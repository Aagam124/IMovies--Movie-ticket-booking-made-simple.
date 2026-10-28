import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Generate a JWT token for the authenticated user
export const signToken = (user) => {
  return jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
    },
    config.jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
    }
  );
};

// Cookie settings for local development and production
const cookieOptions = () => {
  const isProduction = config.isProd || Boolean(process.env.VERCEL);
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

// Store the authentication token in an HTTP-only cookie
export const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    ...cookieOptions(),
    maxAge: SEVEN_DAYS_MS,
  });
};

// Remove the authentication cookie during logout
export const clearAuthCookie = (res) => {
  res.clearCookie('token', cookieOptions());
};