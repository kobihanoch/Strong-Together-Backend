import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import createError from 'http-errors';

const isTestEnv = process.env.NODE_ENV === 'test';

const bypassInTest = (middleware: (req: Request, res: Response, next: NextFunction) => void) => {
  if (isTestEnv) {
    return (_req: Request, _res: Response, next: NextFunction): void => next();
  }

  return middleware;
};

// 50 per minute (IP behind reverse proxy)
// Limits: Can block multiple users on same NAT or CGNAT
export const generalLimiter = bypassInTest(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  standardHeaders: true,
  validate: false,
  legacyHeaders: false,
  message: 'Too many requests.',
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 1 per 45 secs per username (burst)
export const changeVerificationEmailLimiter = bypassInTest(rateLimit({
  windowMs: 45 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'username' }),
  message: "You've reached the maximum amount of requests per minute.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 3 per 24h per username
export const changeVerificationEmailLimiterDaily = bypassInTest(rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'username' }),
  message: "You've reached the maximum amount of requests per day.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 3 per 24h per indentifier
export const restPasswordEmailLimiterDaily = bypassInTest(rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'identifier' }),
  message: "You've reached the maximum amount of requests per day.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 1 per 45 secs per indentifier (burst)
export const resetPasswordEmailLimiter = bypassInTest(rateLimit({
  windowMs: 45 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'identifier' }),
  message: "You've reached the maximum amount of requests per minute.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 3 per 24h per indentifier
export const updateUserLimiterDaily = bypassInTest(rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'email' }),
  message: "You've reached the maximum amount of requests per day.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 1 per 45 secs per auth id (burst)
export const updateUserLimiter = bypassInTest(rateLimit({
  windowMs: 45 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'email' }),
  message: "You've reached the maximum amount of requests per minute.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 5 per 15 mins per auth id (burst)
export const loginLimiter = bypassInTest(rateLimit({
  windowMs: 60 * 1000 * 15,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req, res) => getRateLimitKey(req, { bodyKey: 'identifier' }),
  message: "You've reached the maximum amount of login attempts per 15 minutes.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

// 5 per 15 minutes per IP
export const loginIpLimiter = bypassInTest(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
}));

function getRateLimitKey(req: Request, { bodyKey }: { bodyKey?: string } = {}) {
  // 1. If user is authenticated – prefer user id
  if (req.user && req.user.id) {
    return `user:${req.user.id}`;
  }

  // 2. If a specific body field was requested (identifier / username)
  if (bodyKey) {
    const val = req.body?.[bodyKey];
    if (val && typeof val === 'string') {
      return `body:${bodyKey}:${val}`;
    }
  }

  // 3. If client sent a stable device id header
  const clientId = req.headers['x-client-id'];
  if (clientId) {
    return `client:${clientId}`;
  }

  // 4. Fallback to IP (might be NAT/CGNAT)
  return `ip:${req.ip}`;
}
