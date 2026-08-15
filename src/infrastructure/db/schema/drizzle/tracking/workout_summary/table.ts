import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../identity/users/table';
import { trackingSchema } from '../../schemas';
import { workoutsplits } from '../../workout/workoutsplits/table';
import { exercisetracking } from '../exercisetracking/table';
import { workoutSummaryPolicies } from './policies';

export const workoutSummary = trackingSchema.table(
  'workout_summary',
  {
    id: uuid('id').defaultRandom().notNull(),
    userId: uuid('user_id').notNull(),
    workoutStartUtc: timestamp('workout_start_utc', { withTimezone: true }).notNull(),
    workoutEndUtc: timestamp('workout_end_utc', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    workoutsplitId: bigint('workoutsplit_id', { mode: 'number' }).notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_summary_pkey', columns: [t.id] }),
    foreignKey({ name: 'workout_summary_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] }).onDelete(
      'cascade',
    ),
    foreignKey({
      name: 'workout_summary_workoutsplit_id_fkey',
      columns: [t.workoutsplitId],
      foreignColumns: [workoutsplits.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('workout_summary_start_date_idx').on(drizzleSql`((${t.workoutStartUtc} at time zone 'UTC')::date)`),
    index('workout_summary_user_start_utc_idx').on(t.userId, t.workoutStartUtc.desc().nullsFirst()),
    ...workoutSummaryPolicies(t),
  ],
);
export const workoutSummaryRelations = relations(workoutSummary, ({ many, one }) => ({
  user: one(users, { fields: [workoutSummary.userId], references: [users.id] }),
  workoutsplit: one(workoutsplits, { fields: [workoutSummary.workoutsplitId], references: [workoutsplits.id] }),
  exerciseTrackings: many(exercisetracking),
}));
