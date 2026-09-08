import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

/** Normalized verification result extracted from an Apple identity token. */
export const appleTokenVerificationResultDtoSchema = z.object({
  appleSub: z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z.boolean(),
  fullName: userDbSchema.shape.name,
});

export type AppleTokenVerificationResultDto = z.infer<typeof appleTokenVerificationResultDtoSchema>;
