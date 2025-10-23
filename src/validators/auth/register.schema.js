import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be at most 15 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may contain letters, numbers, and underscore only"
    ),

  fullName: z.preprocess(
    // Map "", null, undefined -> "User"
    (val) => {
      if (val == null) return "User";
      if (typeof val === "string" && val.trim() === "") return "User";
      return val;
    },
    z
      .string()
      .trim()
      .max(20, "Full name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only")
  ),

  email: z.string().trim().toLowerCase().email("Invalid email format"),

  password: z.string().min(8, "Password must be at least 8 characters long"),

  gender: z.preprocess(
    (val) => (val === "" || val == null ? "Unknown" : val),
    z.enum(["Male", "Female", "Other", "Unknown"])
  ),
});
