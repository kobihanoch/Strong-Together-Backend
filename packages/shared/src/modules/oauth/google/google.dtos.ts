import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

/** Normalized verification result extracted from a Google identity token. */
export const googleTokenVerificationResultDtoSchema = z.object({
  googleSub: z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z.boolean(),
  fullName: userDbSchema.shape.name,
});

export type GoogleTokenVerificationResultDto = z.infer<typeof googleTokenVerificationResultDtoSchema>;
