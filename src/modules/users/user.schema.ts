import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{6})$/, "avatarColor must be a hex color like #6366f1");

// ---- Create --------------------------------------------------------------
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "name must be at least 2 characters").max(80),
    email: z.string().trim().toLowerCase().email("email must be valid"),
    role: z.string().trim().min(2).max(60).default("Member"),
    avatarColor: hexColor.default("#6366f1"),
  }),
});

// ---- Update (partial) ----------------------------------------------------
export const updateUserSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().toLowerCase().email(),
      role: z.string().trim().min(2).max(60),
      avatarColor: hexColor,
    })
    .partial()
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Provide at least one field to update",
    }),
});

// ---- Id param only -------------------------------------------------------
export const userIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
