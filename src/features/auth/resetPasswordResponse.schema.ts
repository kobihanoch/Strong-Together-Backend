import { z } from 'zod';

export const resetPasswordResponseSchema = z.object({
  ok: z.boolean(),
});
