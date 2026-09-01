import { NextFunction, Request, Response, RequestHandler } from "express";

// Wraps an async route handler so any rejected promise is forwarded to
// Express's error handling chain instead of crashing the process. This keeps
// controllers free of repetitive try/catch blocks.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
