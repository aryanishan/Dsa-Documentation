import { z } from "zod";

import { DifficultySchema, IdSchema, JsonValueSchema, LanguageSchema, PaginationSchema, SlugSchema } from "./common";

export const TopicListSchema = PaginationSchema.extend({
  category: z.string().trim().min(1).max(80).optional(),
  difficulty: DifficultySchema.optional(),
  tag: z.string().trim().min(1).max(50).optional(),
});

export const TopicSlugParamsSchema = z.object({ slug: SlugSchema });
export const TopicIdParamsSchema = z.object({ topicId: IdSchema });

const CodeExampleInputSchema = z.object({
  language: LanguageSchema,
  title: z.string().trim().min(1).max(120),
  code: z.string().min(1).max(100000),
  explanation: z.string().max(20000).nullable().optional(),
});

const TopicCoreSchema = z.object({
  slug: SlugSchema,
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(10).max(10000),
  content: z.string().min(1).max(500000),
  category: z.string().trim().min(2).max(80),
  difficulty: DifficultySchema.nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  headings: JsonValueSchema.default([]),
  estimatedMinutes: z.number().int().min(1).max(1440).default(5),
  sortOrder: z.number().int().min(0).max(100000).default(0),
  isPublished: z.boolean().default(false),
  codeExamples: z.array(CodeExampleInputSchema).max(30).default([]),
});

export const CreateTopicSchema = TopicCoreSchema;
export const UpdateTopicSchema = TopicCoreSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field is required.");
