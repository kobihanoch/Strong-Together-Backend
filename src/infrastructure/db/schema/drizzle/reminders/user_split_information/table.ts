import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, foreignKey, index, integer, numeric, primaryKey, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { remindersSchema } from '../../schemas';
import { workoutSplit } from '../../workout/workout_split/table';

export const userSplitInformation = remindersSchema
  .table(
    'user_split_information',
    {
      id: bigint('id', { mode: 'number' })
        .generatedByDefaultAsIdentity({ name: 'user_split_information_id_seq' })
        .notNull(),
      userId: uuid('user_id').notNull(),
      workoutSplitId: bigint('workout_split_id', { mode: 'number' }).notNull(),
      estimatedTimeUtc: timestamp('estimated_time_utc', { withTimezone: true }).notNull(),
      confidence: numeric('confidence', { precision: 3, scale: 2 }).default('1.00').notNull(),
      lastComputedAt: timestamp('last_computed_at', { withTimezone: true })
        .default(drizzleSql`timezone('UTC', now())`)
        .notNull(),
      preferredWeekday: integer('preferred_weekday'),
    },
    (t) => [
      primaryKey({ name: 'user_split_information_pkey', columns: [t.id] }),
      unique('user_split_information_user_id_workout_split_id_key').on(t.userId, t.workoutSplitId),
      foreignKey({
        name: 'user_split_information_user_id_fkey',
        columns: [t.userId],
        foreignColumns: [user.id],
      }).onDelete('cascade'),
      foreignKey({
        name: 'user_split_information_workout_split_id_fkey',
        columns: [t.workoutSplitId],
        foreignColumns: [workoutSplit.id],
      }).onDelete('cascade'),
      index('user_split_information_confidence_idx')
        .on(t.preferredWeekday, t.confidence)
        .where(drizzleSql`${t.confidence} >= 0.60`),
      index('user_split_information_user_weekday_idx')
        .on(t.userId, t.preferredWeekday)
        .where(drizzleSql`${t.preferredWeekday} is not null`),
    ],
  )
  .enableRLS();
export const userSplitInformationRelations = relations(userSplitInformation, ({ one }) => ({
  user: one(user, { fields: [userSplitInformation.userId], references: [user.id] }),
  workoutSplit: one(workoutSplit, { fields: [userSplitInformation.workoutSplitId], references: [workoutSplit.id] }),
}));
