import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username and password are required"),
  password: z.string().trim().min(1, "Username and password are required"),
});
