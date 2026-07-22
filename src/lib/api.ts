/**
 * Small typed transport layer for the separately deployed REST API.
 * Browser-facing pages only call this module; credentials and Judge0 settings
 * remain confined to the backend service.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  token?: string;
  headers?: HeadersInit;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, headers, ...init } = options;
  const response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload: unknown = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = isApiMessage(payload) ? payload.message : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

function isApiMessage(value: unknown): value is { message: string } {
  return typeof value === "object" && value !== null && "message" in value && typeof value.message === "string";
}

export const api = {
  auth: {
    signIn: (input: { email: string; password: string }) => apiRequest<{ token: string; user: unknown }>("/auth/login", { method: "POST", body: input }),
    signUp: (input: { name: string; email: string; password: string }) => apiRequest<{ token: string; user: unknown }>("/auth/register", { method: "POST", body: input }),
  },
  code: {
    execute: (input: { language: string; sourceCode: string; stdin?: string }) => apiRequest<{ stdout: string | null; stderr: string | null; compileOutput: string | null; time: string | null; memory: number | null; status: { id: number; description: string } }>("/executions", { method: "POST", body: input }),
  },
  search: (query: string) => apiRequest<{ items: unknown[] }>(`/search?q=${encodeURIComponent(query)}`),
};
