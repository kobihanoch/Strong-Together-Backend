import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3)
    .refine(
      (val) => {
        const isEmail = z.string().email().safeParse(val).success;
        const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(val);
        return isEmail || isUsername;
      },
      {
        message: "Must be a valid email or username",
      }
    ),
  password: z.string().min(1, "Username and password are required"),
});
