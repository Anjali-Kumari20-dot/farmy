const rateLimit = require("express-rate-limit");

/**
 * Standard API rate limiter to protect against spam / DoS.
 * Allows 100 requests per 15 minutes window.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Strict rate limiter for Authentication & OTP endpoints.
 * Limits login attempts and OTP requests to prevent brute force attacks.
 * Allows 10 attempts per 10 minutes.
 */
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts. Please wait 10 minutes before retrying.",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
