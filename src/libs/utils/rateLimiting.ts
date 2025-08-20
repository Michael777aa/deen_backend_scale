import rateLimit from "express-rate-limit";

// max limits each IP to 100 requests
// windowMs it is how long we keep counting requests before resetting 15 minutes here
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
