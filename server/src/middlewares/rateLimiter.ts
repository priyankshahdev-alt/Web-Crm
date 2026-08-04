import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMinutes * 60 * 1000,
  limit: config.rateLimit.max,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    data: null,
    errors: [{ code: 'RATE_LIMITED', message: 'Too many requests' }],
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    data: null,
    errors: [{ code: 'RATE_LIMITED', message: 'Too many authentication attempts' }],
  },
});

export const donationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many donation attempts, please try again later.',
    data: null,
    errors: [{ code: 'RATE_LIMITED', message: 'Too many donation attempts' }],
  },
});

export const verificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification checks, please try again later.',
    data: null,
    errors: [{ code: 'RATE_LIMITED', message: 'Too many verification checks' }],
  },
});
