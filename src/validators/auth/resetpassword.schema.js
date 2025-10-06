import { z } from "zod";

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});
