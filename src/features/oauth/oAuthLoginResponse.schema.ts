import { z } from 'zod';

export const oAuthLoginResponseSchema = z.object({
  message: z.string(),
  user: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  missingFields: z.array(z.string()).nullable(),
});
