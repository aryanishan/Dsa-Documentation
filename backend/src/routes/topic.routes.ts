import { Router } from "express";

import { prisma } from "../lib/prisma";
import { allowRoles, requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateTopicSchema, TopicListSchema, TopicSlugParamsSchema, UpdateTopicSchema } from "../schemas/topic";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { pageMeta, toPagination } from "../utils/pagination";

export const topicRouter = Router();

topicRouter.get(
  "/",
  validate(TopicListSchema, "query"),
  asyncHandler(async (request, response) => {
    const { page, limit, skip, take } = toPagination(request.query as { page?: number; limit?: number });
    const { category, difficulty, tag } = request.query as { category?: string; difficulty?: string; tag?: string };
    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (tag) where.tags = { has: tag };

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        skip,
        take,
        select: {
          id: true, slug: true, title: true, summary: true, category: true,
          difficulty: true, tags: true, estimatedMinutes: true, sortOrder: true,
          createdAt: true, updatedAt: true,
        },
      }),
      prisma.topic.count({ where }),
    ]);

    response.json({ items: topics, pagination: pageMeta(page, limit, total) });
  }),
);

topicRouter.get(
  "/:slug",
  validate(TopicSlugParamsSchema, "params"),
  asyncHandler(async (request, response) => {
    const topic = await prisma.topic.findFirst({
      where: { slug: request.params.slug, isPublished: true },
      include: { codeExamples: { orderBy: { language: "asc" } } },
    });
    if (!topic) throw ApiError.notFound("Topic");
    response.json({ topic });
  }),
);

topicRouter.post(
  "/",
  requireAuth,
  allowRoles("ADMIN"),
  validate(CreateTopicSchema),
  asyncHandler(async (request, response) => {
    const { codeExamples, ...topicData } = request.body;
    const topic = await prisma.topic.create({
      data: {
        ...topicData,
        codeExamples: codeExamples?.length
          ? { createMany: { data: codeExamples } }
          : undefined,
      },
      include: { codeExamples: true },
    });
    response.status(201).json({ topic });
  }),
);

topicRouter.patch(
  "/:slug",
  requireAuth,
  allowRoles("ADMIN"),
  validate(TopicSlugParamsSchema, "params"),
  validate(UpdateTopicSchema),
  asyncHandler(async (request, response) => {
    const { codeExamples, ...topicData } = request.body;
    const existing = await prisma.topic.findUnique({ where: { slug: request.params.slug } });
    if (!existing) throw ApiError.notFound("Topic");

    if (codeExamples) {
      await prisma.codeExample.deleteMany({ where: { topicId: existing.id } });
      await prisma.codeExample.createMany({
        data: codeExamples.map((example: { language: string; title: string; code: string; explanation?: string | null }) => ({
          ...example,
          topicId: existing.id,
        })),
      });
    }

    const topic = await prisma.topic.update({
      where: { id: existing.id },
      data: topicData,
      include: { codeExamples: true },
    });
    response.json({ topic });
  }),
);

topicRouter.delete(
  "/:slug",
  requireAuth,
  allowRoles("ADMIN"),
  validate(TopicSlugParamsSchema, "params"),
  asyncHandler(async (request, response) => {
    const existing = await prisma.topic.findUnique({ where: { slug: request.params.slug } });
    if (!existing) throw ApiError.notFound("Topic");
    await prisma.topic.delete({ where: { id: existing.id } });
    response.json({ message: "Topic deleted." });
  }),
);
