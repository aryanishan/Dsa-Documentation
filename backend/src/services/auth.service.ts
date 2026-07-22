import { randomUUID } from "node:crypto";

import type { User } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";
import { hashPassword, verifyPassword } from "../utils/password";
import { publicUser } from "../utils/serializers";
import { createAccessToken, createRefreshToken, getRefreshExpiry, verifyRefreshToken } from "../utils/tokens";

type SessionMetadata = { userAgent?: string; ipAddress?: string };
type Credentials = { email: string; password: string };
type RegisterInput = Credentials & { name: string };

export class AuthService {
  async register(input: RegisterInput, metadata: SessionMetadata) {
    const existing = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
    if (existing) throw ApiError.conflict("An account with this email already exists.");

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: await hashPassword(input.password),
        settings: { create: {} },
      },
    });
    return this.issueSession(user, metadata);
  }

  async login(input: Credentials, metadata: SessionMetadata) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw ApiError.unauthorized("Invalid email or password.");
    }
    return this.issueSession(user, metadata);
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const session = await prisma.session.findFirst({
      where: { id: payload.sid, userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!session || !(await verifyPassword(refreshToken, session.refreshTokenHash))) {
      if (session) await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
      throw ApiError.unauthorized("Your session is invalid or has expired.");
    }

    const nextRefreshToken = createRefreshToken({ sub: session.userId, sid: session.id });
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: await hashPassword(nextRefreshToken),
        expiresAt: getRefreshExpiry(nextRefreshToken),
      },
    });

    return this.tokenResponse(session.user, session.id, nextRefreshToken);
  }

  async logout(sessionId: string) {
    await prisma.session.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  async logoutEverywhere(userId: string) {
    await prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  private async issueSession(user: User, metadata: SessionMetadata) {
    const sessionId = randomUUID();
    const refreshToken = createRefreshToken({ sub: user.id, sid: sessionId });
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshTokenHash: await hashPassword(refreshToken),
        expiresAt: getRefreshExpiry(refreshToken),
        userAgent: metadata.userAgent?.slice(0, 512),
        ipAddress: metadata.ipAddress?.slice(0, 128),
      },
    });
    return this.tokenResponse(user, sessionId, refreshToken);
  }

  private tokenResponse(user: User, sessionId: string, refreshToken: string) {
    const accessToken = createAccessToken({ sub: user.id, sid: sessionId, role: user.role });
    return {
      token: accessToken,
      accessToken,
      refreshToken,
      user: publicUser(user),
    };
  }
}

export const authService = new AuthService();
