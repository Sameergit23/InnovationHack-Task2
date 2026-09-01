// A typed operational error carrying the HTTP status code and optional
// structured details. Thrown anywhere in the request lifecycle and turned
// into a JSON response by the centralized error handler.
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(400, message, details);
  }
  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }
  static conflict(message = "Resource conflict") {
    return new ApiError(409, message);
  }
  static unprocessable(message = "Unprocessable entity", details?: unknown) {
    return new ApiError(422, message, details);
  }
}
