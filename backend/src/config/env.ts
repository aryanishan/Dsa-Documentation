import "dotenv/config";

import { z } from "zod";

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  API_PREFIX: z.string().regex(/^\//).default("/api/v1"),
  TRUST_PROXY: z.enum(["true", "false"]).default("false"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32).default("development-access-secret-change-me-12345"),
  JWT_REFRESH_SECRET: z.string().min(32).default("development-refresh-secret-change-me-12345"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),
  JUDGE0_BASE_URL: z.string().url().default("http://localhost:2358"),
  JUDGE0_API_KEY: z.string().optional(),
  JUDGE0_API_HOST: z.string().optional(),
  JUDGE0_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  JUDGE0_POLL_INTERVAL_MS: z.coerce.number().int().min(100).max(10000).default(500),
  JUDGE0_MAX_POLL_ATTEMPTS: z.coerce.number().int().min(1).max(240).default(30),
  JUDGE0_LANGUAGE_IDS: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(300),
  EXECUTION_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(20),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(12),
});

const parsed = rawEnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`);
}

const value = parsed.data;

if (
  value.NODE_ENV === "production" &&
  (value.JWT_ACCESS_SECRET.startsWith("development-") || value.JWT_REFRESH_SECRET.startsWith("development-"))
) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be replaced before running in production.");
}

function parseLanguageOverrides(input: string | undefined): Record<string, number> {
  if (!input) return {};

  try {
    const parsedJson: unknown = JSON.parse(input);
    const validated = z.record(z.string(), z.number().int().positive()).safeParse(parsedJson);
    if (!validated.success) throw new Error("values must be positive integers");
    return validated.data;
  } catch (error) {
    throw new Error(`JUDGE0_LANGUAGE_IDS must be a JSON object of positive language IDs: ${error instanceof Error ? error.message : "invalid JSON"}`);
  }
}

export const env = {
  ...value,
  trustProxy: value.TRUST_PROXY === "true",
  corsOrigins: value.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean),
  judge0LanguageIds: parseLanguageOverrides(value.JUDGE0_LANGUAGE_IDS),
} as const;
