import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { trackingSchema } from '../../schemas';
import { workoutSplit } from '../../workout/workout_split/table';
import { exerciseTracking } from '../exercise_tracking/table';
import { workoutSummaryPolicies } from './policies';

export const workoutSummary = trackingSchema.table(
  'workout_summary',
  {
    id: uuid('id').defaultRandom().notNull(),
    userId: uuid('user_id').notNull(),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }).notNull(),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    workoutSplitId: bigint('workout_split_id', { mode: 'number' }).notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_summary_pkey', columns: [t.id] }),
    foreignKey({ name: 'workout_summary_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] }).onDelete(
      'cascade',
    ),
    foreignKey({
      name: 'workout_summary_workout_split_id_fkey',
      columns: [t.workoutSplitId],
      foreignColumns: [workoutSplit.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('workout_summary_start_date_idx').on(drizzleSql`((${t.workoutStartUtc} at time zone 'UTC')::date)`),
    index('workout_summary_user_start_utc_idx').on(t.userId, t.workoutStartUtc.desc().nullsFirst()),
    ...workoutSummaryPolicies(t),
  ],
);
export const workoutSummaryRelations = relations(workoutSummary, ({ many, one }) => ({
  user: one(user, { fields: [workoutSummary.userId], references: [user.id] }),
  workoutSplit: one(workoutSplit, { fields: [workoutSummary.workoutSplitId], references: [workoutSplit.id] }),
  exerciseTrackings: many(exerciseTracking),
}));
