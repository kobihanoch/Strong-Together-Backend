import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username and password are required").trim(),
  password: z.string().min(1, "Username and password are required").trim(),
});
