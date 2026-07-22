import type { RequestHandler } from "express";
import type { z } from "zod";

import { ApiError } from "../utils/api-error";

type RequestLocation = "body" | "params" | "query";

export function validate<T extends z.ZodTypeAny>(schema: T, location: RequestLocation = "body"): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request[location]);
    if (!result.success) {
      next(new ApiError(422, "Request validation failed.", "VALIDATION_ERROR", result.error.flatten()));
      return;
    }

    (request as unknown as Record<string, unknown>)[location] = result.data;
    next();
  };
}
