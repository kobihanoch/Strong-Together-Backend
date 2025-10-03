import { z } from "zod";

export const changeEmailSchema = z.object({
  username: z.string().trim().min(1, "Username and password are required"),
  password: z.string().trim().min(1, "Username and password are required"),
  newEmail: z.string().trim().toLowerCase().email("Invalid email format"),
});
