import { z } from 'zod';

export const resetPasswordRequest = z.object({
  body: z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
  query: z.object({
    token: z.string().optional(),
  }),
});
