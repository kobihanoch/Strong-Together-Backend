// middlewares/rateLimiter.js

import rateLimit from "express-rate-limit";
import createError from "http-errors";
import { createHash } from "node:crypto";

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    next(createError(429, options.message || "Too many requests."));
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
    next(
      createError(
        429,
        options.message ||
          "You've reached the maximum amount of requests per minute."
      )
    );
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
    next(
      createError(
        429,
        options.message ||
          "You've reached the maximum amount of requests per day."
      )
    );
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
    next(
      createError(
        429,
        options.message ||
          "You've reached the maximum amount of requests per day."
      )
    );
  },
});

// 3 per minute per IP (burst)
export const resetPasswordEmailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You've reached the maximum amount of requests per minute.",
  handler: (req, res, next, options) => {
    next(
      createError(
        429,
        options.message ||
          "You've reached the maximum amount of requests per minute."
      )
    );
  },
});
