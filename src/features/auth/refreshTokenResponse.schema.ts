import { z } from 'zod';

export const refreshTokenResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: z.string(),
});
