import { Router } from "express";
import userRoutes from "./modules/users/user.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";

// Combines every feature router under a single API router, mounted at /api.
const api = Router();

api.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() } });
});

api.use("/users", userRoutes);
api.use("/projects", projectRoutes);
api.use("/tasks", taskRoutes);

export default api;
