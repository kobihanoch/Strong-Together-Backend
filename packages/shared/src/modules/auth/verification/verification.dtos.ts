import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

/** Claims carried by an email-verification token. */
export const emailVerifyPayloadDtoSchema = z.object({
  sub: userDbSchema.shape.id,
  jti: z.string(),
  exp: z.number(),
  iss: z.string(),
  typ: z.string(),
});

export type EmailVerifyPayloadDto = z.infer<typeof emailVerifyPayloadDtoSchema>;
