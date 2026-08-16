import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, foreignKey, index, primaryKey, timestamp, unique } from 'drizzle-orm/pg-core';
import { exerciseTracking } from '../../tracking/exercisetracking/table';
import { workoutSchema } from '../../schemas';
import { exercise } from '../exercises/table';
import { workoutSplit } from '../workoutsplits/table';
import { workoutSet } from '../workout_set/table';
import { exerciseToWorkoutSplitPolicies } from './policies';

export const exerciseToWorkoutSplit = workoutSchema.table(
  'exercise_to_workout_split',
  {
    id: bigint('id', { mode: 'number' })
      .generatedByDefaultAsIdentity({ name: 'exercise_to_workout_split_id_seq' })
      .notNull(),
    exerciseId: bigint('exercise_id', { mode: 'number' }).notNull(),
    workoutSplitId: bigint('workout_split_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    sets: bigint('sets', { mode: 'number' }).array().notNull(),
    orderIndex: bigint('order_index', { mode: 'number' }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (t) => [
    primaryKey({ name: 'exercise_to_workout_split_pkey', columns: [t.id] }),
    unique('uq_exercise_to_workout_split_workout_split_exercise').on(t.workoutSplitId, t.exerciseId),
    foreignKey({
      name: 'exercise_to_workout_split_exercise_id_fkey',
      columns: [t.exerciseId],
      foreignColumns: [exercise.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      name: 'exercise_to_workout_split_workout_split_id_fkey',
      columns: [t.workoutSplitId],
      foreignColumns: [workoutSplit.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('exercise_to_workout_split_active_idx')
      .on(t.workoutSplitId, t.orderIndex)
      .where(drizzleSql`${t.isActive} = true`),
    index('exercise_to_workout_split_workout_split_id_order_index_idx').on(t.workoutSplitId, t.orderIndex),
    ...exerciseToWorkoutSplitPolicies(t),
  ],
);
export const exerciseToWorkoutSplitRelations = relations(exerciseToWorkoutSplit, ({ many, one }) => ({
  exercise: one(exercise, { fields: [exerciseToWorkoutSplit.exerciseId], references: [exercise.id] }),
  workoutSplit: one(workoutSplit, { fields: [exerciseToWorkoutSplit.workoutSplitId], references: [workoutSplit.id] }),
  exerciseTrackings: many(exerciseTracking),
  workoutSets: many(workoutSet),
}));
