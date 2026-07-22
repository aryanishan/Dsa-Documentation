import { Router } from "express";

import { prisma } from "../lib/prisma";
import { allowRoles, requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateProblemSchema, ProblemListSchema, ProblemSlugParamsSchema, UpdateProblemSchema } from "../schemas/problem";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { pageMeta, toPagination } from "../utils/pagination";

export const problemRouter = Router();

problemRouter.get(
  "/",
  validate(ProblemListSchema, "query"),
  asyncHandler(async (request, response) => {
    const { page, limit, skip, take } = toPagination(request.query as { page?: number; limit?: number });
    const { difficulty, tag, q } = request.query as { difficulty?: string; tag?: string; q?: string };
    const where: Record<string, unknown> = { isPublished: true };
    if (difficulty) where.difficulty = difficulty;
    if (tag) where.tags = { has: tag };
    if (q) where.title = { contains: q, mode: "insensitive" };

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        orderBy: [{ difficulty: "asc" }, { title: "asc" }],
        skip,
        take,
        select: {
          id: true, slug: true, title: true, difficulty: true, tags: true,
          timeLimitMs: true, memoryLimitKb: true, createdAt: true,
        },
      }),
      prisma.problem.count({ where }),
    ]);

    response.json({ items: problems, pagination: pageMeta(page, limit, total) });
  }),
);

problemRouter.get(
  "/:slug",
  validate(ProblemSlugParamsSchema, "params"),
  asyncHandler(async (request, response) => {
    const problem = await prisma.problem.findFirst({
      where: { slug: request.params.slug, isPublished: true },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!problem) throw ApiError.notFound("Problem");
    response.json({ problem });
  }),
);

problemRouter.post(
  "/",
  requireAuth,
  allowRoles("ADMIN"),
  validate(CreateProblemSchema),
  asyncHandler(async (request, response) => {
    const { testCases, ...problemData } = request.body;
    const problem = await prisma.problem.create({
      data: {
        ...problemData,
        testCases: { createMany: { data: testCases } },
      },
      include: { testCases: true },
    });
    response.status(201).json({ problem });
  }),
);

problemRouter.patch(
  "/:slug",
  requireAuth,
  allowRoles("ADMIN"),
  validate(ProblemSlugParamsSchema, "params"),
  validate(UpdateProblemSchema),
  asyncHandler(async (request, response) => {
    const { testCases, ...problemData } = request.body;
    const existing = await prisma.problem.findUnique({ where: { slug: request.params.slug } });
    if (!existing) throw ApiError.notFound("Problem");

    if (testCases) {
      await prisma.problemTestCase.deleteMany({ where: { problemId: existing.id } });
      await prisma.problemTestCase.createMany({
        data: testCases.map((tc: { input: string; expectedOutput: string; isHidden?: boolean; weight?: number }) => ({
          ...tc,
          problemId: existing.id,
        })),
      });
    }

    const problem = await prisma.problem.update({
      where: { id: existing.id },
      data: problemData,
      include: { testCases: true },
    });
    response.json({ problem });
  }),
);
