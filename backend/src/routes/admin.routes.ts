import { Router } from "express";

import { prisma } from "../lib/prisma";
import { allowRoles, requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AdminUserListSchema, UpdateUserRoleSchema, UserParamsSchema } from "../schemas/user";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { pageMeta, toPagination } from "../utils/pagination";
import { publicUser } from "../utils/serializers";

export const adminRouter = Router();

adminRouter.use(requireAuth, allowRoles("ADMIN"));

adminRouter.get(
  "/analytics",
  asyncHandler(async (_request, response) => {
    const [userCount, topicCount, problemCount, submissionCount, recentSubmissions] = await Promise.all([
      prisma.user.count(),
      prisma.topic.count(),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.submission.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, status: true, language: true, createdAt: true,
          user: { select: { name: true, email: true } },
          problem: { select: { title: true, slug: true } },
        },
      }),
    ]);

    const statusCounts = await prisma.submission.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    response.json({
      analytics: {
        users: userCount,
        topics: topicCount,
        problems: problemCount,
        submissions: submissionCount,
        statusBreakdown: statusCounts.reduce<Record<string, number>>((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {}),
        recentSubmissions,
      },
    });
  }),
);

adminRouter.get(
  "/users",
  validate(AdminUserListSchema, "query"),
  asyncHandler(async (request, response) => {
    const { page, limit, skip, take } = toPagination(request.query as { page?: number; limit?: number });
    const { role, q } = request.query as { role?: string; q?: string };
    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    response.json({
      items: users.map(publicUser),
      pagination: pageMeta(page, limit, total),
    });
  }),
);

adminRouter.patch(
  "/users/:userId/role",
  validate(UserParamsSchema, "params"),
  validate(UpdateUserRoleSchema),
  asyncHandler(async (request, response) => {
    const user = await prisma.user.findUnique({ where: { id: request.params.userId } });
    if (!user) throw ApiError.notFound("User");
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: request.body.role },
    });
    response.json({ user: publicUser(updated) });
  }),
);
