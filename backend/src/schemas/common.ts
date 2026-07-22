import { z } from "zod";

export const LanguageSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const normalized = value.trim().toUpperCase();
    if (normalized === "C++") return "CPP";
    if (normalized === "C#") return "CSHARP";
    return normalized;
  },
  z.enum(["C", "CPP", "JAVA", "PYTHON", "JAVASCRIPT", "TYPESCRIPT", "GO", "RUST", "CSHARP"]),
);

export const DifficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);
export const ProgressStatusSchema = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);
export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const IdSchema = z.string().trim().min(1).max(128);
export const SlugSchema = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated slug.");

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const JsonValueSchema: z.ZodType<unknown> = z.lazy(() => z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
  z.array(JsonValueSchema),
  z.record(JsonValueSchema),
]));
