import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { UpdateProfileSchema, UpdateSettingsSchema } from "../schemas/user";
import { asyncHandler } from "../utils/async-handler";
import { publicUser } from "../utils/serializers";

export const userRouter = Router();

userRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (request, response) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.auth!.userId },
    });
    response.json({ user: publicUser(user) });
  }),
);

userRouter.patch(
  "/me",
  requireAuth,
  validate(UpdateProfileSchema),
  asyncHandler(async (request, response) => {
    const user = await prisma.user.update({
      where: { id: request.auth!.userId },
      data: request.body,
    });
    response.json({ user: publicUser(user) });
  }),
);

userRouter.get(
  "/me/settings",
  requireAuth,
  asyncHandler(async (request, response) => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId: request.auth!.userId },
    });
    response.json({ settings: settings ?? { theme: "system", editorFontSize: 14, showMinimap: true } });
  }),
);

userRouter.patch(
  "/me/settings",
  requireAuth,
  validate(UpdateSettingsSchema),
  asyncHandler(async (request, response) => {
    const settings = await prisma.userSettings.upsert({
      where: { userId: request.auth!.userId },
      create: { userId: request.auth!.userId, ...request.body },
      update: request.body,
    });
    response.json({ settings });
  }),
);
