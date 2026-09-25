import { relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { workoutSummary } from '../../tracking/workout_summary/table';
import { socialSchema } from '../../schemas';
import { postPolicies } from './policies';

export const postVisibility = socialSchema.enum('Post Visibility', ['crews_only', 'public']);

export const post = socialSchema
  .table(
    'post',
    {
      id: uuid('id').defaultRandom().notNull(),
      authorUserId: uuid('author_user_id').notNull(),
      workoutSummaryId: uuid('workout_summary_id'),
      content: text('content').notNull(),
      visibility: postVisibility('visibility').notNull(),
      publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow().notNull(),
      updateddAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'post_pkey', columns: [t.id] }),
      foreignKey({ name: 'post_author_user_id_fkey', columns: [t.authorUserId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'post_workout_summary_id_fkey', columns: [t.workoutSummaryId], foreignColumns: [workoutSummary.id] })
        .onUpdate('cascade')
        .onDelete('set null'),
      index('post_author_user_id_idx').on(t.authorUserId),
      index('post_workout_summary_id_idx').on(t.workoutSummaryId),
      index('post_published_at_idx').on(t.publishedAt),
      ...postPolicies(t),
    ],
  )
  .enableRLS();
export const postRelations = relations(post, ({ one }) => ({
  author: one(user, { fields: [post.authorUserId], references: [user.id] }),
  workoutSummary: one(workoutSummary, { fields: [post.workoutSummaryId], references: [workoutSummary.id] }),
}));
