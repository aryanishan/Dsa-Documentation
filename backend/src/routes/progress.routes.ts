import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { TopicIdParamsSchema } from "../schemas/topic";
import { ProgressStatusSchema } from "../schemas/common";
import { asyncHandler } from "../utils/async-handler";
import { z } from "zod";

export const progressRouter = Router();

const UpdateProgressSchema = z.object({
  percent: z.number().int().min(0).max(100).optional(),
  status: ProgressStatusSchema.optional(),
}).refine((v) => Object.keys(v).length > 0, "At least one field is required.");

progressRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const progress = await prisma.topicProgress.findMany({
      where: { userId: request.auth!.userId },
      orderBy: { lastReadAt: "desc" },
      include: {
        topic: {
          select: { id: true, slug: true, title: true, category: true, difficulty: true },
        },
      },
    });
    response.json({ items: progress });
  }),
);

progressRouter.patch(
  "/:topicId",
  requireAuth,
  validate(TopicIdParamsSchema, "params"),
  validate(UpdateProgressSchema),
  asyncHandler(async (request, response) => {
    const { topicId } = request.params;
    const { percent, status } = request.body;
    const data: Record<string, unknown> = { lastReadAt: new Date() };
    if (percent !== undefined) data.percent = percent;
    if (status !== undefined) {
      data.status = status;
      if (status === "COMPLETED") data.completedAt = new Date();
    }

    const progress = await prisma.topicProgress.upsert({
      where: { userId_topicId: { userId: request.auth!.userId, topicId } },
      create: { userId: request.auth!.userId, topicId, ...data },
      update: data,
      include: {
        topic: { select: { id: true, slug: true, title: true } },
      },
    });
    response.json({ progress });
  }),
);
