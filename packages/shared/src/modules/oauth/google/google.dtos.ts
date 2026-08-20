import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

export const googleTokenVerificationResultSchema = z.object({
  googleSub: z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z.boolean(),
  fullName: userDbSchema.shape.name,
});

export type GoogleTokenVerificationResult = z.infer<typeof googleTokenVerificationResultSchema>;
