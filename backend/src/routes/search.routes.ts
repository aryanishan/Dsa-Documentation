import { Router } from "express";

import { prisma } from "../lib/prisma";
import { validate } from "../middleware/validate";
import { SearchQuerySchema } from "../schemas/search";
import { asyncHandler } from "../utils/async-handler";
import { pageMeta, toPagination } from "../utils/pagination";

export const searchRouter = Router();

searchRouter.get(
  "/",
  validate(SearchQuerySchema, "query"),
  asyncHandler(async (request, response) => {
    const { q, type, page, limit } = request.query as { q: string; type: string; page?: number; limit?: number };
    const { skip, take } = toPagination({ page: Number(page) || 1, limit: Number(limit) || 20 });
    const results: Array<{ kind: string; id: string; slug: string; title: string; summary: string; tags: string[]; category?: string; difficulty?: string }> = [];

    if (type === "all" || type === "topics") {
      const topics = await prisma.topic.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
            { tags: { has: q.toLowerCase() } },
          ],
        },
        take: 20,
        select: { id: true, slug: true, title: true, summary: true, category: true, difficulty: true, tags: true },
        orderBy: { sortOrder: "asc" },
      });
      for (const t of topics) {
        results.push({ kind: "topic", id: t.id, slug: t.slug, title: t.title, summary: t.summary, tags: t.tags, category: t.category, difficulty: t.difficulty ?? undefined });
      }
    }

    if (type === "all" || type === "problems") {
      const problems = await prisma.problem.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { statement: { contains: q, mode: "insensitive" } },
            { tags: { has: q.toLowerCase() } },
          ],
        },
        take: 20,
        select: { id: true, slug: true, title: true, difficulty: true, tags: true },
        orderBy: { title: "asc" },
      });
      for (const p of problems) {
        results.push({ kind: "problem", id: p.id, slug: p.slug, title: p.title, summary: "", tags: p.tags, difficulty: p.difficulty });
      }
    }

    if (type === "all" || type === "code") {
      const codeExamples = await prisma.codeExample.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { code: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: { id: true, title: true, language: true, topic: { select: { slug: true, title: true, tags: true } } },
        orderBy: { title: "asc" },
      });
      for (const c of codeExamples) {
        results.push({ kind: "code", id: c.id, slug: c.topic.slug, title: `${c.topic.title} — ${c.title} (${c.language})`, summary: "", tags: c.topic.tags });
      }
    }

    const pageNum = Number(page) || 1;
    const pageSize = Number(limit) || 20;
    const paged = results.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    response.json({ items: paged, pagination: pageMeta(pageNum, pageSize, results.length) });
  }),
);
