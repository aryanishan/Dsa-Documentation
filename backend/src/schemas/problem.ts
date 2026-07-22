import { z } from "zod";

import { DifficultySchema, IdSchema, JsonValueSchema, LanguageSchema, PaginationSchema, SlugSchema } from "./common";

export const ProblemSlugParamsSchema = z.object({ slug: SlugSchema });
export const SubmissionIdParamsSchema = z.object({ submissionId: IdSchema });

const TestCaseSchema = z.object({
  input: z.string().max(50000),
  expectedOutput: z.string().max(50000),
  isHidden: z.boolean().default(false),
  weight: z.number().int().min(1).max(100).default(1),
});

const ProblemCoreSchema = z.object({
  slug: SlugSchema,
  title: z.string().trim().min(2).max(180),
  difficulty: DifficultySchema,
  statement: z.string().min(10).max(200000),
  constraints: z.string().min(1).max(50000),
  examples: z.array(JsonValueSchema).max(20).default([]),
  hints: z.array(z.string().trim().min(1).max(3000)).max(10).default([]),
  starterCode: JsonValueSchema.default({}),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  inputFormat: z.string().max(20000).nullable().optional(),
  outputFormat: z.string().max(20000).nullable().optional(),
  timeLimitMs: z.number().int().min(100).max(30000).default(2000),
  memoryLimitKb: z.number().int().min(16000).max(1024000).default(128000),
  isPublished: z.boolean().default(false),
});

export const CreateProblemSchema = ProblemCoreSchema.extend({
  testCases: z.array(TestCaseSchema).min(1).max(100),
});

export const UpdateProblemSchema = ProblemCoreSchema.partial().extend({
  testCases: z.array(TestCaseSchema).min(1).max(100).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required.");

export const ProblemListSchema = PaginationSchema.extend({
  difficulty: DifficultySchema.optional(),
  tag: z.string().trim().min(1).max(50).optional(),
  q: z.string().trim().min(1).max(150).optional(),
});

export const RunCodeSchema = z.object({
  language: LanguageSchema,
  sourceCode: z.string().min(1).max(100000),
  stdin: z.string().max(50000).default(""),
});

export const SubmitProblemSchema = RunCodeSchema;
