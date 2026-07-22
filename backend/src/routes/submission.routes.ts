import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { executionRateLimiter } from "../middleware/rate-limit";
import { validate } from "../middleware/validate";
import { ProblemSlugParamsSchema, SubmitProblemSchema } from "../schemas/problem";
import { PaginationSchema, SlugSchema } from "../schemas/common";
import { judge0Service, mapJudgeStatus, outputMatches } from "../services/judge0.service";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { pageMeta, toPagination } from "../utils/pagination";

export const submissionRouter = Router();

submissionRouter.post(
  "/",
  requireAuth,
  executionRateLimiter,
  validate(SubmitProblemSchema.extend({
    problemSlug: SlugSchema,
  })),
  asyncHandler(async (request, response) => {
    const { problemSlug, language, sourceCode, stdin } = request.body;
    const problem = await prisma.problem.findFirst({
      where: { slug: problemSlug, isPublished: true },
      include: { testCases: { orderBy: { createdAt: "asc" } } },
    });
    if (!problem) throw ApiError.notFound("Problem");

    const submission = await prisma.submission.create({
      data: {
        userId: request.auth!.userId,
        problemId: problem.id,
        language,
        sourceCode,
        status: "RUNNING",
      },
    });

    let finalStatus: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "MEMORY_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "INTERNAL_ERROR" = "ACCEPTED";
    let lastStdout: string | null = null;
    let lastStderr: string | null = null;
    let lastCompileOutput: string | null = null;
    let maxTime = 0;
    let maxMemory = 0;

    for (const testCase of problem.testCases) {
      const result = await judge0Service.run({
        language,
        sourceCode,
        stdin: testCase.input,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitKb: problem.memoryLimitKb,
      });

      lastStdout = result.stdout;
      lastStderr = result.stderr;
      lastCompileOutput = result.compileOutput;
      if (result.time) maxTime = Math.max(maxTime, parseFloat(result.time) * 1000);
      if (result.memory) maxMemory = Math.max(maxMemory, result.memory);

      const judgeStatus = mapJudgeStatus(result.status.id);
      if (judgeStatus !== "ACCEPTED") {
        finalStatus = judgeStatus as typeof finalStatus;
        break;
      }

      if (!outputMatches(result.stdout, testCase.expectedOutput)) {
        finalStatus = "WRONG_ANSWER";
        break;
      }
    }

    const updated = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: finalStatus,
        stdout: lastStdout,
        stderr: lastStderr,
        compileOutput: lastCompileOutput,
        executionTimeMs: Math.round(maxTime),
        memoryKb: maxMemory,
      },
    });

    response.status(201).json({
      submission: {
        id: updated.id,
        status: updated.status,
        stdout: updated.stdout,
        stderr: updated.stderr,
        compileOutput: updated.compileOutput,
        executionTimeMs: updated.executionTimeMs,
        memoryKb: updated.memoryKb,
        createdAt: updated.createdAt,
      },
    });
  }),
);

submissionRouter.get(
  "/",
  requireAuth,
  validate(PaginationSchema, "query"),
  asyncHandler(async (request, response) => {
    const { page, limit, skip, take } = toPagination(request.query as { page?: number; limit?: number });
    const where = { userId: request.auth!.userId };

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true, language: true, status: true,
          executionTimeMs: true, memoryKb: true, createdAt: true,
          problem: { select: { slug: true, title: true, difficulty: true } },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    response.json({ items: submissions, pagination: pageMeta(page, limit, total) });
  }),
);
