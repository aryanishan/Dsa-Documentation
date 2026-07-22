import { Router } from "express";

import { authRateLimiter } from "../middleware/rate-limit";
import { validate } from "../middleware/validate";
import { LoginSchema, RefreshSchema, RegisterSchema } from "../schemas/auth";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";

export const authRouter = Router();

function sessionMeta(request: Express.Request) {
  const req = request as unknown as import("express").Request;
  return {
    userAgent: req.header("user-agent"),
    ipAddress: req.ip,
  };
}

authRouter.post(
  "/register",
  authRateLimiter,
  validate(RegisterSchema),
  asyncHandler(async (request, response) => {
    const result = await authService.register(request.body, sessionMeta(request));
    response.status(201).json(result);
  }),
);

authRouter.post(
  "/login",
  authRateLimiter,
  validate(LoginSchema),
  asyncHandler(async (request, response) => {
    const result = await authService.login(request.body, sessionMeta(request));
    response.json(result);
  }),
);

authRouter.post(
  "/refresh",
  authRateLimiter,
  validate(RefreshSchema),
  asyncHandler(async (request, response) => {
    const result = await authService.refresh(request.body.refreshToken);
    response.json(result);
  }),
);

authRouter.post(
  "/logout",
  asyncHandler(async (request, response) => {
    const sessionId = request.auth?.sessionId;
    if (sessionId) await authService.logout(sessionId);
    response.json({ message: "Logged out successfully." });
  }),
);
