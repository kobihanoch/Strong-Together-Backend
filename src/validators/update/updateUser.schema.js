import { z } from "zod";

export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be at most 15 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may contain letters, numbers, and underscore only"
    ),

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(20, "Full name is too long"),

  email: z.string().trim().toLowerCase().email("Invalid email format"),
});
