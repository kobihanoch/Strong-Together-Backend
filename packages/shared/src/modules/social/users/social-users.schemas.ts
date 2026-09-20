import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';

/** Public profile fields returned by social user search. */
export const socialUserSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  fullName: z.string(),
  profilePicPath: z.string().nullable(),
  createdAt: serializedDateSchema,
});
