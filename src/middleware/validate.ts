import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../lib/ApiError";

// Validates request `body`, `params` and `query` against a Zod schema.
// On success the parsed (and coerced) values replace the originals so
// controllers receive clean, typed input. On failure a 422 is raised with a
// field-by-field breakdown, handled centrally by the error handler.
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) Object.assign(req.query, parsed.query);
      if (parsed.params) Object.assign(req.params, parsed.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.issues.map((i) => ({
          field: i.path.filter((p) => p !== "body").join("."),
          message: i.message,
        }));
        next(ApiError.unprocessable("Validation failed", details));
        return;
      }
      next(err);
    }
  };
