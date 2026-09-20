import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../../common';

/** Public reaction representation used by social HTTP responses. */
export const reactionSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['like', 'fire up', 'muscle']),
  reactedAt: serializedDateSchema,
});
