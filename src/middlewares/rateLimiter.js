import rateLimit from "express-rate-limit";
import createError from "http-errors";

export const generalLimiter = rateLimit({
  // Allow max of 100 requests per 1 minute for each IP
  windowMs: 60 * 1000,
  max: 100,
  message:
    "You've reached the maximum amount of requests per minute. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    next(createError(429, options.message)); // Throws error to error handler to inject to the response
  },
});
