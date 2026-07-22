import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import type { AccessTokenPayload, RefreshTokenPayload } from "../types/auth";
import { ApiError } from "./api-error";

function sign(payload: AccessTokenPayload | RefreshTokenPayload, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

function readPayload(token: string, secret: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") throw ApiError.unauthorized("Invalid authentication token.");
    return decoded;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.unauthorized("Your session is invalid or has expired.");
  }
}

export function createAccessToken(input: Omit<AccessTokenPayload, "type">) {
  return sign({ ...input, type: "access" }, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_TTL);
}

export function createRefreshToken(input: Omit<RefreshTokenPayload, "type">) {
  return sign({ ...input, type: "refresh" }, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_TTL);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = readPayload(token, env.JWT_ACCESS_SECRET);
  if (payload.type !== "access" || typeof payload.sub !== "string" || typeof payload.sid !== "string" || (payload.role !== "USER" && payload.role !== "ADMIN")) {
    throw ApiError.unauthorized("Invalid access token.");
  }
  return { sub: payload.sub, sid: payload.sid, role: payload.role, type: "access" };
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = readPayload(token, env.JWT_REFRESH_SECRET);
  if (payload.type !== "refresh" || typeof payload.sub !== "string" || typeof payload.sid !== "string") {
    throw ApiError.unauthorized("Invalid refresh token.");
  }
  return { sub: payload.sub, sid: payload.sid, type: "refresh" };
}

export function getRefreshExpiry(token: string): Date {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string" || typeof decoded.exp !== "number") {
    throw ApiError.unauthorized("Invalid refresh token.");
  }
  return new Date(decoded.exp * 1000);
}
