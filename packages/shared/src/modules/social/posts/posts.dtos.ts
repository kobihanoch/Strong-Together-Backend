import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { postDbSchema } from '../../../database';

/** Runtime schema for a post row and its optional crew placement. */
export const postQueryDtoSchema = postDbSchema.omit({ updateddAt: true }).extend({
  publishedAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  crewId: z.uuid().nullable(),
});

/** Runtime schema for a post deletion result. */
export const deletedPostQueryDtoSchema = z.object({ id: postDbSchema.shape.id });

/** Typed post row returned with its nullable crew placement. */
export type PostQueryDto = z.infer<typeof postQueryDtoSchema>;

/** Typed result used to verify that a post was deleted. */
export type DeletedPostQueryDto = z.infer<typeof deletedPostQueryDtoSchema>;
