import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import api from "./routes";
import { openapiSpec } from "./docs/openapi";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

// Builds and configures the Express application. Kept separate from server
// startup so it can be imported and tested without binding a port.
export function createApp() {
  const app = express();

  // --- Security & platform middleware ---
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
    })
  );
  app.use(express.json());
  if (!env.isProd) app.use(morgan("dev"));

  // --- Landing route (useful as the deployed "live link") ---
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        name: "Users, Projects & Tasks API",
        version: "1.0.0",
        docs: "/api/docs",
        openapi: "/api/openapi.json",
        health: "/api/health",
      },
    });
  });

  // --- Interactive API documentation ---
  app.get("/api/openapi.json", (_req, res) => res.json(openapiSpec));
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, { customSiteTitle: "Users, Projects & Tasks API — Docs" })
  );

  // --- Feature routes ---
  app.use("/api", api);

  // --- 404 + centralized error handling (must be last) ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
