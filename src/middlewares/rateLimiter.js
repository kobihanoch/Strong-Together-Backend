import rateLimit from "express-rate-limit";
import createError from "http-errors";

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
});

// 1 per minute per IP (burst)
export const changeVerificationEmailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You've reached the maximum amount of requests per minute.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
});

// 3 per 24h per ip
export const changeVerificationEmailLimiterDaily = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You've reached the maximum amount of requests per day.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
});

// 3 per 24h per ip
export const restPasswordEmailLimiterDaily = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You've reached the maximum amount of requests per day.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
});

// 2 per minute per IP (burst)
export const resetPasswordEmailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You've reached the maximum amount of requests per minute.",
  handler: (req, res, next, options) => {
    next(createError(429, options.message));
  },
});
