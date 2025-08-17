import { z } from "zod";

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username may contain letters, numbers, and underscore only"
      )
      .optional(),

    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .max(100, "Full name is too long")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email format")
      .toLowerCase()
      .optional(),

    gender: z
      .enum(["male", "female", "other"], {
        errorMap: () => ({ message: "You must select a valid gender" }),
      })
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .optional(),

    profileImgUrl: z
      .string()
      .trim()
      .url("Invalid profile image URL")
      .optional(),

    pushToken: z.string().trim().min(1, "Push token is invalid").optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
    path: [],
  });
