import { Project, Task, User } from "../types";

// Deterministic seed data so the API returns something meaningful on first run
// and demos are reproducible. Timestamps are fixed for stable output.
const t = (d: string) => `${d}T09:00:00.000Z`;

export const seedUsers: User[] = [
  { id: "u1", name: "Saim Rehman", email: "saim@devboard.dev", role: "Full Stack Developer", avatarColor: "#6366f1", createdAt: t("2026-08-01"), updatedAt: t("2026-08-01") },
  { id: "u2", name: "Ayesha Khan", email: "ayesha@devboard.dev", role: "Frontend Engineer", avatarColor: "#0ea5e9", createdAt: t("2026-08-01"), updatedAt: t("2026-08-01") },
  { id: "u3", name: "Daniel Cruz", email: "daniel@devboard.dev", role: "Backend Engineer", avatarColor: "#f59e0b", createdAt: t("2026-08-01"), updatedAt: t("2026-08-01") },
  { id: "u4", name: "Mei Lin", email: "mei@devboard.dev", role: "UI/UX Designer", avatarColor: "#ec4899", createdAt: t("2026-08-01"), updatedAt: t("2026-08-01") },
];

export const seedProjects: Project[] = [
  { id: "p1", name: "Atlas Design System", description: "A shared component library and tokens powering every internal product surface.", status: "active", members: ["u1", "u2", "u4"], createdAt: t("2026-08-02"), updatedAt: t("2026-08-18") },
  { id: "p2", name: "Payments Service v2", description: "Rebuild of the payments gateway with idempotent transfers and audit logging.", status: "active", members: ["u1", "u3"], createdAt: t("2026-08-03"), updatedAt: t("2026-08-19") },
  { id: "p3", name: "Analytics Pipeline", description: "Streaming ETL that feeds the product analytics warehouse in near real time.", status: "completed", members: ["u3"], createdAt: t("2026-08-04"), updatedAt: t("2026-08-05") },
];

export const seedTasks: Task[] = [
  { id: "t1", title: "Ship Button and Input primitives", description: "Build accessible primitives with variants and docs.", projectId: "p1", assigneeId: "u2", status: "in-progress", priority: "high", dueDate: "2026-08-24", createdAt: t("2026-08-10"), updatedAt: t("2026-08-18") },
  { id: "t2", title: "Document theming API", description: "Write usage docs for the theming tokens.", projectId: "p1", assigneeId: "u1", status: "todo", priority: "low", dueDate: "2026-08-30", createdAt: t("2026-08-11"), updatedAt: t("2026-08-11") },
  { id: "t3", title: "Idempotency keys for transfers", description: "Guarantee exactly-once transfer semantics.", projectId: "p2", assigneeId: "u3", status: "in-progress", priority: "high", dueDate: "2026-08-23", createdAt: t("2026-08-12"), updatedAt: t("2026-08-19") },
  { id: "t4", title: "Webhook retry with backoff", description: "Add exponential backoff to webhook delivery.", projectId: "p2", assigneeId: "u3", status: "todo", priority: "medium", dueDate: "2026-08-27", createdAt: t("2026-08-13"), updatedAt: t("2026-08-13") },
  { id: "t5", title: "Backfill historical events", description: "Replay archived events into the new pipeline.", projectId: "p3", assigneeId: "u3", status: "done", priority: "medium", dueDate: "2026-08-05", createdAt: t("2026-08-04"), updatedAt: t("2026-08-05") },
];
