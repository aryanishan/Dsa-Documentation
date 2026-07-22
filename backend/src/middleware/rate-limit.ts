import rateLimit from "express-rate-limit";

import { env } from "../config/env";

function createRateLimiter(max: number, message: string) {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message, code: "RATE_LIMITED" },
  });
}

export const apiRateLimiter = createRateLimiter(env.RATE_LIMIT_MAX, "Too many requests. Please try again later.");
export const authRateLimiter = createRateLimiter(env.AUTH_RATE_LIMIT_MAX, "Too many authentication attempts. Please try again later.");
export const executionRateLimiter = createRateLimiter(env.EXECUTION_RATE_LIMIT_MAX, "Execution limit reached. Please wait before trying again.");
