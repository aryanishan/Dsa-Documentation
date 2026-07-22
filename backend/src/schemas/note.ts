import { z } from "zod";

import { IdSchema, PaginationSchema } from "./common";

export const NoteParamsSchema = z.object({ noteId: IdSchema });
export const NoteListSchema = PaginationSchema;
export const CreateNoteSchema = z.object({
  topicId: IdSchema.nullable().optional(),
  title: z.string().trim().min(1).max(160),
  content: z.string().min(1).max(100000),
});
export const UpdateNoteSchema = CreateNoteSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required.");
