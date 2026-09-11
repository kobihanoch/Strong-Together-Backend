import { relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { post } from '../post/table';
import { commentPolicies } from './policies';
export const comment = socialSchema
  .table(
    'comment',
    {
      id: uuid('id').defaultRandom().notNull(),
      postId: uuid('post_id').notNull(),
      userId: uuid('user_id').notNull(),
      content: text('content').notNull(),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'comment_pkey', columns: [t.id] }),
      foreignKey({ name: 'comment_post_id_fkey', columns: [t.postId], foreignColumns: [post.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'comment_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      index('comment_post_created_at_idx').on(t.postId, t.createdAt),
      index('comment_user_id_idx').on(t.userId),
      ...commentPolicies(t),
    ],
  )
  .enableRLS();
export const commentRelations = relations(comment, ({ one }) => ({
  post: one(post, { fields: [comment.postId], references: [post.id] }),
  user: one(user, { fields: [comment.userId], references: [user.id] }),
}));
