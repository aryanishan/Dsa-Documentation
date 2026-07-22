import type { RequestHandler } from "express";

import { prisma } from "../lib/prisma";
import type { AppRole } from "../types/auth";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/tokens";

function bearerToken(value: string | undefined) {
  if (!value) return undefined;
  const [scheme, token] = value.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) throw ApiError.unauthorized("Use a Bearer access token.");
  return token;
}

export const requireAuth: RequestHandler = asyncHandler(async (request, _response, next) => {
  const token = bearerToken(request.header("authorization"));
  if (!token) throw ApiError.unauthorized();

  const payload = verifyAccessToken(token);
  const session = await prisma.session.findFirst({
    where: {
      id: payload.sid,
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: { select: { id: true, email: true, role: true } } },
  });

  if (!session) throw ApiError.unauthorized("This session is no longer active.");

  request.auth = {
    userId: session.user.id,
    sessionId: session.id,
    role: session.user.role as AppRole,
    email: session.user.email,
  };
  next();
});

export function allowRoles(...roles: AppRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) return next(ApiError.unauthorized());
    if (!roles.includes(request.auth.role)) return next(ApiError.forbidden());
    next();
  };
}
