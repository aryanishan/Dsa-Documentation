export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, code = "REQUEST_FAILED", details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, "BAD_REQUEST", details);
  }

  static unauthorized(message = "Authentication is required.") {
    return new ApiError(401, message, "UNAUTHORIZED");
  }

  static forbidden(message = "You do not have permission to perform this action.") {
    return new ApiError(403, message, "FORBIDDEN");
  }

  static notFound(resource = "Resource") {
    return new ApiError(404, `${resource} was not found.`, "NOT_FOUND");
  }

  static conflict(message: string) {
    return new ApiError(409, message, "CONFLICT");
  }
}
