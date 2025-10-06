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

// Deterministic sync hash (no PII in plaintext)
const sha256Hex = (s) =>
  s
    ? createHash("sha256")
        .update(String(s).toLowerCase().trim(), "utf8")
        .digest("hex")
    : "";

// 3 per 24h per target (fallback to IP)
export const changeVerificationEmailLimiterDaily = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  /*keyGenerator: (req /*, res*/ /*) => {
    const b = req.body || {};
    const target = b.username || "";
    // Prefer hashed target; if empty, fall back to IP
    return sha256Hex(target) || req.ip;
  },*/
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
