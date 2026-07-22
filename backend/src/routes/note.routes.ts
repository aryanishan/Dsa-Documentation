import { Router } from "express";

import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateNoteSchema, NoteListSchema, NoteParamsSchema, UpdateNoteSchema } from "../schemas/note";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { pageMeta, toPagination } from "../utils/pagination";

export const noteRouter = Router();

noteRouter.get(
  "/",
  requireAuth,
  validate(NoteListSchema, "query"),
  asyncHandler(async (request, response) => {
    const { page, limit, skip, take } = toPagination(request.query as { page?: number; limit?: number });
    const where = { userId: request.auth!.userId };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take,
        include: {
          topic: { select: { id: true, slug: true, title: true } },
        },
      }),
      prisma.note.count({ where }),
    ]);

    response.json({ items: notes, pagination: pageMeta(page, limit, total) });
  }),
);

noteRouter.post(
  "/",
  requireAuth,
  validate(CreateNoteSchema),
  asyncHandler(async (request, response) => {
    const note = await prisma.note.create({
      data: { ...request.body, userId: request.auth!.userId },
      include: { topic: { select: { id: true, slug: true, title: true } } },
    });
    response.status(201).json({ note });
  }),
);

noteRouter.patch(
  "/:noteId",
  requireAuth,
  validate(NoteParamsSchema, "params"),
  validate(UpdateNoteSchema),
  asyncHandler(async (request, response) => {
    const existing = await prisma.note.findFirst({
      where: { id: request.params.noteId, userId: request.auth!.userId },
    });
    if (!existing) throw ApiError.notFound("Note");

    const note = await prisma.note.update({
      where: { id: existing.id },
      data: request.body,
      include: { topic: { select: { id: true, slug: true, title: true } } },
    });
    response.json({ note });
  }),
);

noteRouter.delete(
  "/:noteId",
  requireAuth,
  validate(NoteParamsSchema, "params"),
  asyncHandler(async (request, response) => {
    const existing = await prisma.note.findFirst({
      where: { id: request.params.noteId, userId: request.auth!.userId },
    });
    if (!existing) throw ApiError.notFound("Note");
    await prisma.note.delete({ where: { id: existing.id } });
    response.json({ message: "Note deleted." });
  }),
);
