import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  role: z.enum(["admin", "user"]).optional().default("user")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().default(""),
  status: z.enum(["pending", "completed"]).default("pending")
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "completed"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Empty update" });

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional()
});
