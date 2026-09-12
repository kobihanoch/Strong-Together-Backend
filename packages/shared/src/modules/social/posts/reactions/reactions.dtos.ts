import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../../common';
import { reactionDbSchema } from '../../../../database';

/** Runtime schema for a reaction returned by a social query. */
export const reactionQueryDtoSchema = reactionDbSchema.extend({ reactedAt: serializedDateSchema });

/** Runtime schema for the identifier returned after a reaction write. */
export const reactionWriteResultQueryDtoSchema = z.object({ id: reactionDbSchema.shape.id });

/** Typed reaction returned by social reaction queries. */
export type ReactionQueryDto = z.infer<typeof reactionQueryDtoSchema>;

/** Typed identifier returned after creating, changing, or deleting a reaction. */
export type ReactionWriteResultQueryDto = z.infer<typeof reactionWriteResultQueryDtoSchema>;
