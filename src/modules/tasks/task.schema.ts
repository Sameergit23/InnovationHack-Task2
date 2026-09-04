import { z } from "zod";

const taskStatus = z.enum(["todo", "in-progress", "done"]);
const taskPriority = z.enum(["low", "medium", "high"]);

// Accepts an ISO date (YYYY-MM-DD or full ISO) or null.
const dueDate = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), "dueDate must be a valid date")
  .nullable();

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2, "title must be at least 2 characters").max(160),
    description: z.string().trim().max(1000).default(""),
    projectId: z.string().min(1, "projectId is required"),
    assigneeId: z.string().min(1).nullable().default(null),
    status: taskStatus.default("todo"),
    priority: taskPriority.default("medium"),
    dueDate: dueDate.default(null),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      title: z.string().trim().min(2).max(160),
      description: z.string().trim().max(1000),
      projectId: z.string().min(1),
      assigneeId: z.string().min(1).nullable(),
      status: taskStatus,
      priority: taskPriority,
      dueDate: dueDate,
    })
    .partial()
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Provide at least one field to update",
    }),
});

// Dedicated schema for the status-management endpoint.
export const updateTaskStatusSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ status: taskStatus }),
});

export const taskIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const listTasksSchema = z.object({
  query: z.object({
    status: taskStatus.optional(),
    priority: taskPriority.optional(),
    projectId: z.string().optional(),
    assigneeId: z.string().optional(),
    search: z.string().trim().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
export type ListTasksQuery = z.infer<typeof listTasksSchema>["query"];
