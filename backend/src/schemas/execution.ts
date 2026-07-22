import { z } from "zod";

import { LanguageSchema } from "./common";

export const ExecuteSchema = z.object({
  language: LanguageSchema,
  sourceCode: z.string().min(1).max(100000),
  stdin: z.string().max(50000).default(""),
  timeLimitMs: z.number().int().min(100).max(10000).optional(),
  memoryLimitKb: z.number().int().min(16000).max(512000).optional(),
});
