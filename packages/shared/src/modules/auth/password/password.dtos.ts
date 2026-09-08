import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

/** Claims carried by a forgot-password token. */
export const forgotPasswordPayloadDtoSchema = z.object({
  sub: userDbSchema.shape.id,
  jti: z.string(),
  exp: z.number(),
  iss: z.string(),
  typ: z.string(),
});

export type ForgotPasswordPayloadDto = z.infer<typeof forgotPasswordPayloadDtoSchema>;
