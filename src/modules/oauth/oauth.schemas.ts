import { z } from 'zod';
import { loginResponseSchema } from '../auth/session/auth.session.schemas.ts';

export const oAuthLoginResponseSchema = z.object({
  message: z.string(),
  user: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  missingFields: z.array(z.string()).nullable(),
});

export const proceedLoginResponseSchema = loginResponseSchema;
