import { z } from 'zod/v4';
import { loginResponseSchema } from '../auth/session/session.schemas';
import { userDbSchema } from '../../database';

export const oAuthLoginResponseSchema = z.object({
  message: z.string(),
  user: userDbSchema.shape.id,
  accessToken: z.string(),
  refreshToken: z.string(),
  missingFields: z.array(z.string()).nullable(),
});

export const proceedLoginResponseSchema = loginResponseSchema;
