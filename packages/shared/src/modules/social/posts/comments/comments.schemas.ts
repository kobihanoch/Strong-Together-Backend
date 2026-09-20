import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../../common';

/** Public comment representation used by social HTTP responses. */
export const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  authorFullName: z.string(),
  authorProfilePicPath: z.string().nullable(),
  authorUsername: z.string(),
});
