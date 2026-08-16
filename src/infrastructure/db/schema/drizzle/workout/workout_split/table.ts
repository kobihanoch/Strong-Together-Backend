import { relations } from 'drizzle-orm';
import { bigint, boolean, foreignKey, index, primaryKey, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { userSplitInformation } from '../../reminders/user_split_information/table';
import { workoutSummary } from '../../tracking/workout_summary/table';
import { workoutSchema } from '../../schemas';
import { exerciseToWorkoutSplit } from '../exercisetoworkoutsplit/table';
import { workoutPlan } from '../workout_plan/table';
import { workoutSplitPolicies } from './policies';

export const workoutSplit = workoutSchema.table(
  'workout_split',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'workout_split_id_seq' }).notNull(),
    workoutId: bigint('workout_id', { mode: 'number' }).notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    muscleGroup: text('muscle_group'),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_split_pkey', columns: [t.id] }),
    unique('uq_workout_split_plan_name').on(t.workoutId, t.name),
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
