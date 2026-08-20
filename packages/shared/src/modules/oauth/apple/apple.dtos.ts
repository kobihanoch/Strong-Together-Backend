import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

export const appleTokenVerificationResultSchema = z.object({
  appleSub: z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z.boolean(),
  fullName: userDbSchema.shape.name,
});

export type AppleTokenVerificationResult = z.infer<typeof appleTokenVerificationResultSchema>;
