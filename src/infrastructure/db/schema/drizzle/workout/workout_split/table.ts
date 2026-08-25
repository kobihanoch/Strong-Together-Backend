import { sql as drizzleSql, relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  foreignKey,
  index,
  integer,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { userSplitInformation } from '../../reminders/user_split_information/table';
import { workoutSchema } from '../../schemas';
import { workoutSummary } from '../../tracking/workout_summary/table';
import { exerciseToWorkoutSplit } from '../exercisetoworkoutsplit/table';
import { workoutPlan } from '../workout_plan/table';
import { workoutSplitPolicies } from './policies';

export const workoutSplit = workoutSchema.table(
  'workout_split',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'workout_split_id_seq' }).notNull(),
    workoutId: bigint('workout_id', { mode: 'number' }).notNull(),
    name: text('name').notNull(),
    orderIndex: integer('order_index').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(drizzleSql`(NOW() AT TIME ZONE 'utc')`)
      .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_split_pkey', columns: [t.id] }),
    uniqueIndex('uq_active_workout_split_order_index')
      .on(t.workoutId, t.orderIndex)
      .where(drizzleSql`${t.isActive} = TRUE`),
    foreignKey({ name: 'workout_split_workout_id_fkey', columns: [t.workoutId], foreignColumns: [workoutPlan.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('workout_split_workout_id_idx').on(t.workoutId),
    ...workoutSplitPolicies(t),
  ],
);
export const workoutSplitRelations = relations(workoutSplit, ({ many, one }) => ({
  workoutPlan: one(workoutPlan, { fields: [workoutSplit.workoutId], references: [workoutPlan.id] }),
  exerciseAssignments: many(exerciseToWorkoutSplit),
  workoutSummaries: many(workoutSummary),
  splitInformation: many(userSplitInformation),
}));
