import { z } from 'zod';

export const loginResponseSchema = z.object({
  message: z.string(),
  user: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
