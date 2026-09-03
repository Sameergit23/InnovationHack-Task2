import { z } from "zod";

const projectStatus = z.enum(["active", "on-hold", "completed"]);

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "name must be at least 2 characters").max(120),
    description: z.string().trim().max(500).default(""),
    status: projectStatus.default("active"),
    members: z.array(z.string().min(1)).default([]),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().trim().min(2).max(120),
      description: z.string().trim().max(500),
      status: projectStatus,
      members: z.array(z.string().min(1)),
    })
    .partial()
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Provide at least one field to update",
    }),
});

export const projectIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const listProjectsSchema = z.object({
  query: z.object({
    status: projectStatus.optional(),
    search: z.string().trim().optional(),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>["body"];
export type ListProjectsQuery = z.infer<typeof listProjectsSchema>["query"];
