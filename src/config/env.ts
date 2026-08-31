import dotenv from "dotenv";
import { z } from "zod";

// Load variables from .env into process.env (no-op if the file is absent).
dotenv.config();

// Validate and coerce environment variables once, at startup. If anything is
// malformed the process exits immediately with a clear message rather than
// failing in a confusing way later.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("*"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === "production",
  corsOrigins:
    parsed.data.CORS_ORIGIN === "*"
      ? "*"
      : parsed.data.CORS_ORIGIN.split(",").map((o) => o.trim()),
};
