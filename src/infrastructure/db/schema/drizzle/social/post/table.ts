import { relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { socialSchema } from '../../schemas';
import { postPolicies } from './policies';
export const post = socialSchema
  .table(
    'post',
    {
      id: uuid('id').defaultRandom().notNull(),
      authorUserId: uuid('author_user_id').notNull(),
      content: text('content').notNull(),
      publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
      updateddAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'post_pkey', columns: [t.id] }),
      foreignKey({ name: 'post_author_user_id_fkey', columns: [t.authorUserId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      index('post_author_user_id_idx').on(t.authorUserId),
      index('post_published_at_idx').on(t.publishedAt),
      ...postPolicies(t),
    ],
  )
  .enableRLS();
export const postRelations = relations(post, ({ one }) => ({ author: one(user, { fields: [post.authorUserId], references: [user.id] }) }));
