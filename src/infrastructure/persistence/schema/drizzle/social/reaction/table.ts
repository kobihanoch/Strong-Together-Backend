import { relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { post } from '../post/table';
import { reactionPolicies } from './policies';

export const reactionType = socialSchema.enum('Reaction Type', ['like', 'fire up', 'muscle']);

export const reaction = socialSchema
  .table(
    'reaction',
    {
      id: uuid('id').defaultRandom().notNull(),
      postId: uuid('post_id').notNull(),
      userId: uuid('user_id').notNull(),
      type: reactionType('type').notNull(),
      reactedAt: timestamp('reacted_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'reaction_pkey', columns: [t.id] }),
      foreignKey({ name: 'reaction_post_id_fkey', columns: [t.postId], foreignColumns: [post.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'reaction_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      unique('reaction_post_user_unique').on(t.postId, t.userId),
      index('reaction_user_id_idx').on(t.userId),
      ...reactionPolicies(t),
    ],
  )
  .enableRLS();
export const reactionRelations = relations(reaction, ({ one }) => ({
  post: one(post, { fields: [reaction.postId], references: [post.id] }),
  user: one(user, { fields: [reaction.userId], references: [user.id] }),
}));
