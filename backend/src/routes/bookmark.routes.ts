import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { IdSchema, PaginationSchema } from "../schemas/common";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { pageMeta, toPagination } from "../utils/pagination";

export const bookmarkRouter = Router();

bookmarkRouter.get(
  "/",
  requireAuth,
  validate(PaginationSchema, "query"),
  asyncHandler(async (request, response) => {
    const { page, limit, skip, take } = toPagination(request.query as { page?: number; limit?: number });
    const where = { userId: request.auth!.userId };

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          topic: {
            select: {
              id: true, slug: true, title: true, summary: true,
              category: true, difficulty: true, tags: true, estimatedMinutes: true,
            },
          },
        },
      }),
      prisma.bookmark.count({ where }),
    ]);

    response.json({ items: bookmarks, pagination: pageMeta(page, limit, total) });
  }),
);

bookmarkRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const topicId = request.body?.topicId;
    if (!topicId || typeof topicId !== "string") throw ApiError.badRequest("topicId is required.");

    const topic = await prisma.topic.findUnique({ where: { id: topicId }, select: { id: true } });
    if (!topic) throw ApiError.notFound("Topic");

    const bookmark = await prisma.bookmark.upsert({
      where: { userId_topicId: { userId: request.auth!.userId, topicId } },
      create: { userId: request.auth!.userId, topicId },
      update: {},
      include: { topic: { select: { id: true, slug: true, title: true } } },
    });

    response.status(201).json({ bookmark });
  }),
);

bookmarkRouter.delete(
  "/:topicId",
  requireAuth,
  asyncHandler(async (request, response) => {
    const topicId = request.params.topicId;
    await prisma.bookmark.deleteMany({
      where: { userId: request.auth!.userId, topicId },
    });
    response.json({ message: "Bookmark removed." });
  }),
);
