import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@prisma/client";

import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

export const notFound: RequestHandler = (request, _response, next) => {
  next(new ApiError(404, `Route ${request.method} ${request.originalUrl} was not found.`, "ROUTE_NOT_FOUND"));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, _next) => {
  let appError: ApiError;

  if (error instanceof ApiError) {
    appError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    appError = ApiError.conflict("A record with this value already exists.");
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    appError = ApiError.notFound();
  } else if (error instanceof SyntaxError && "body" in error) {
    appError = ApiError.badRequest("Malformed JSON request body.");
  } else {
    appError = new ApiError(500, "An unexpected server error occurred.", "INTERNAL_ERROR");
    if (env.NODE_ENV !== "test") console.error(error);
  }

  response.status(appError.statusCode).json({
    message: appError.message,
    code: appError.code,
    details: appError.details,
    requestId: request.requestId,
    ...(env.NODE_ENV === "development" && !(error instanceof ApiError) && error instanceof Error ? { stack: error.stack } : {}),
  });
};
