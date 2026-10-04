import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';

/** Public post representation with author details and engagement totals. */
export const postSchema = z.object({
  id: z.string().uuid(),
  authorUserId: z.string().uuid(),
  workoutSummaryId: z.string().uuid().nullable(),
  content: z.string(),
  visibility: z.enum(['crews_only', 'public']),
  publishedAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  username: z.string(),
  fullName: z.string(),
  profilePicPath: z.string().nullable(),
  interactions: z.object({
    reactionsCount: z.object({
      likesCount: z.number().int().nonnegative(),
      fireUpCount: z.number().int().nonnegative(),
      muscleCount: z.number().int().nonnegative(),
    }),
    commentsCount: z.number().int().nonnegative(),
  }),
});
