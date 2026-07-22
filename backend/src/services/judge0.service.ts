import type { Language, SubmissionStatus } from "@prisma/client";

import { env } from "../config/env";
import { ApiError } from "../utils/api-error";
import { ExecutionQueue } from "./execution-queue.service";

const defaultLanguageIds: Record<Language, number> = {
  C: 50,
  CPP: 54,
  JAVA: 62,
  PYTHON: 71,
  JAVASCRIPT: 63,
  TYPESCRIPT: 74,
  GO: 60,
  RUST: 73,
  CSHARP: 51,
};

export type JudgeResult = {
  token: string;
  status: { id: number; description: string };
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  time: string | null;
  memory: number | null;
  exitCode: number | null;
};

type Judge0Response = {
  token?: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | null;
  memory?: number | null;
  exit_code?: number | null;
  status?: { id?: number; description?: string };
};

type RunInput = {
  language: Language;
  sourceCode: string;
  stdin: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
};

const queue = new ExecutionQueue(3, 100);

function sleep(durationMs: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, durationMs));
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function judgeHeaders() {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (env.JUDGE0_API_KEY) headers["X-RapidAPI-Key"] = env.JUDGE0_API_KEY;
  if (env.JUDGE0_API_HOST) headers["x-rapidapi-host"] = env.JUDGE0_API_HOST;
  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  let parsed: unknown = null;
  try {
    parsed = body ? JSON.parse(body) : null;
  } catch {
    parsed = body;
  }

  if (!response.ok) {
    const message = typeof parsed === "object" && parsed !== null && "error" in parsed
      ? String((parsed as { error: unknown }).error)
      : "Judge0 rejected the request.";
    throw new ApiError(502, message, "JUDGE0_REQUEST_FAILED");
  }
  return parsed as T;
}

async function requestJudge0<T>(url: string, init: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: { ...judgeHeaders(), ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(env.JUDGE0_TIMEOUT_MS),
    });
    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError(504, "The code execution service timed out.", "JUDGE0_TIMEOUT");
    }
    throw new ApiError(502, "The code execution service is unavailable.", "JUDGE0_UNAVAILABLE");
  }
}

export function mapJudgeStatus(statusId: number): SubmissionStatus {
  switch (statusId) {
    case 1:
    case 2:
      return "RUNNING";
    case 3:
      return "ACCEPTED";
    case 4:
      return "WRONG_ANSWER";
    case 5:
      return "TIME_LIMIT_EXCEEDED";
    case 6:
      return "COMPILATION_ERROR";
    case 13:
      return "INTERNAL_ERROR";
    default:
      return "RUNTIME_ERROR";
  }
}

export function outputMatches(actual: string | null, expected: string) {
  const normalize = (value: string) => value.replace(/\r\n/g, "\n").trimEnd();
  return normalize(actual ?? "") === normalize(expected);
}

export class Judge0Service {
  async run(input: RunInput): Promise<JudgeResult> {
    return queue.enqueue(() => this.execute(input));
  }

  private async execute(input: RunInput): Promise<JudgeResult> {
    const languageId = env.judge0LanguageIds[input.language] ?? defaultLanguageIds[input.language];
    if (!languageId) throw ApiError.badRequest(`No Judge0 language mapping is configured for ${input.language}.`);

    const baseUrl = normalizeBaseUrl(env.JUDGE0_BASE_URL);
    const submission = await requestJudge0<Judge0Response>(
      `${baseUrl}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        body: JSON.stringify({
          source_code: input.sourceCode,
          language_id: languageId,
          stdin: input.stdin,
          cpu_time_limit: input.timeLimitMs ? input.timeLimitMs / 1000 : undefined,
          wall_time_limit: input.timeLimitMs ? Math.max(input.timeLimitMs / 1000 + 1, 2) : undefined,
          memory_limit: input.memoryLimitKb,
        }),
      },
    );

    if (!submission.token) throw new ApiError(502, "Judge0 did not return an execution token.", "JUDGE0_INVALID_RESPONSE");

    let result: Judge0Response = submission;
    for (let attempt = 0; attempt < env.JUDGE0_MAX_POLL_ATTEMPTS; attempt += 1) {
      await sleep(env.JUDGE0_POLL_INTERVAL_MS);
      result = await requestJudge0<Judge0Response>(
        `${baseUrl}/submissions/${encodeURIComponent(submission.token)}?base64_encoded=false`,
        { method: "GET" },
      );

      const statusId = result.status?.id ?? 13;
      if (statusId !== 1 && statusId !== 2) return this.toJudgeResult(submission.token, result);
    }

    throw new ApiError(504, "The code execution service exceeded its polling limit.", "JUDGE0_POLL_TIMEOUT");
  }

  private toJudgeResult(token: string, result: Judge0Response): JudgeResult {
    return {
      token,
      status: {
        id: result.status?.id ?? 13,
        description: result.status?.description ?? "Internal Error",
      },
      stdout: result.stdout ?? null,
      stderr: result.stderr ?? null,
      compileOutput: result.compile_output ?? null,
      time: result.time ?? null,
      memory: result.memory ?? null,
      exitCode: result.exit_code ?? null,
    };
  }
}

export const judge0Service = new Judge0Service();
