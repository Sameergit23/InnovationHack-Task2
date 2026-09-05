import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 API running in ${env.NODE_ENV} mode`);
  console.log(`   Local:  http://localhost:${env.PORT}`);
  console.log(`   Docs:   http://localhost:${env.PORT}/api/docs`);
});

// Graceful shutdown on platform signals (Render/Railway send SIGTERM).
const shutdown = (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully.`);
  server.close(() => process.exit(0));
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
