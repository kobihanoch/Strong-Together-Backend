import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../../common';
import { commentDbSchema } from '../../../../database';

/** Runtime schema for a comment returned by a social query. */
export const commentQueryDtoSchema = commentDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
});

/** Runtime schema for the identifier returned after a comment write. */
export const commentWriteResultQueryDtoSchema = z.object({ id: commentDbSchema.shape.id });

/** Typed comment returned by social comment queries. */
export type CommentQueryDto = z.infer<typeof commentQueryDtoSchema>;

/** Typed identifier returned after creating, editing, or deleting a comment. */
export type CommentWriteResultQueryDto = z.infer<typeof commentWriteResultQueryDtoSchema>;
