import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 hour
  max: 30,
});

export const limiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 hour
  max: 1000,
});
