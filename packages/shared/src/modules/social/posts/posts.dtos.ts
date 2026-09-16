import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { postDbSchema, userDbSchema } from '../../../database';

/** Runtime schema for a post with author details and its current like and comment totals. */
export const postQueryDtoSchema = postDbSchema.omit({ updateddAt: true }).extend({
  publishedAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  username: userDbSchema.shape.username,
  fullName: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath,
  interactions: z.object({
    reactionsCount: z.object({
      likesCount: z.number().int().nonnegative(),
      fireUpCount: z.number().int().nonnegative(),
      muscleCount: z.number().int().nonnegative(),
    }),
    commentsCount: z.number().int().nonnegative(),
  }),
});

/** Runtime schema for a post deletion result. */
export const deletedPostQueryDtoSchema = z.object({ id: postDbSchema.shape.id });

/** Typed post row with author details and engagement totals returned by social post endpoints. */
export type PostQueryDto = z.infer<typeof postQueryDtoSchema>;

/** Typed result used to verify that a post was deleted. */
export type DeletedPostQueryDto = z.infer<typeof deletedPostQueryDtoSchema>;
