import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/ApiError";
import { env } from "../config/env";

// Single, centralized error handler. Every thrown/rejected error in the app
// funnels here and is turned into a consistent JSON envelope with the correct
// HTTP status code. Unknown errors become a safe 500.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof SyntaxError && "body" in err) {
    // Thrown by express.json() when the request body is malformed JSON.
    statusCode = 400;
    message = "Malformed JSON in request body";
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(env.isProd ? {} : { statusCode }),
    },
  });
}
