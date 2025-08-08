import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),

  fullName: z.string().min(1, "Full name is required").trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email format",
    }),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),

  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid birth date",
    }),

  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "You must select a valid gender" }),
  }),
});
