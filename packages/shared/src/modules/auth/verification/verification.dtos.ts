import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

export const emailVerifyPayloadSchema = z.object({
  sub: userDbSchema.shape.id,
  jti: z.string(),
  exp: z.number(),
  iss: z.string(),
  typ: z.string(),
});

export type EmailVerifyPayload = z.infer<typeof emailVerifyPayloadSchema>;
