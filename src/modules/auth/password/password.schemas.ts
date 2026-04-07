import { z } from 'zod';

export const sendChangePassEmailRequest = z.object({
  body: z.object({ identifier: z.string() }),
});

export const resetPasswordRequest = z.object({
  body: z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  }),
  query: z.object({
    token: z.string().optional(),
  }),
});

export const resetPasswordResponseSchema = z.object({
  ok: z.boolean(),
});
