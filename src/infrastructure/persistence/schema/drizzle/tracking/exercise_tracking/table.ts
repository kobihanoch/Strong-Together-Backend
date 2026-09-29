import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import { trackingSchema } from '../../schemas';
import { exercise } from '../../workout/exercises/table';
import { exerciseToWorkoutSplit } from '../../workout/exercisetoworkoutsplit/table';
import { trackingSet } from '../tracking_set/table';
import { workoutSummary } from '../workout_summary/table';
import { exerciseTrackingPolicies } from './policies';
import { check } from 'drizzle-orm/pg-core';

export const exerciseTracking = trackingSchema.table(
  'exercise_tracking',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'exercise_tracking_id_seq' }).notNull(),
    workoutSummaryId: uuid('workout_summary_id').notNull(),
    exerciseToSplitId: bigint('exercise_to_split_id', { mode: 'number' }),
    exerciseId: bigint('exercise_id', { mode: 'number' }),
    notes: text('notes'),
  },
  (t) => [
    primaryKey({ name: 'exercise_tracking_pkey', columns: [t.id] }),
    foreignKey({
      name: 'exercise_tracking_exercise_to_split_id_fkey',
      columns: [t.exerciseToSplitId],
      foreignColumns: [exerciseToWorkoutSplit.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      name: 'exercise_tracking_exercise_id_fkey',
      columns: [t.exerciseId],
      foreignColumns: [exercise.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      name: 'exercise_tracking_workout_summary_id_fkey',
      columns: [t.workoutSummaryId],
      foreignColumns: [workoutSummary.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    check('exercise_tracking_xor_check', drizzleSql`num_nonnulls(${t.exerciseToSplitId}, ${t.exerciseId}) = 1`), // Only one of them can be defined (for random exercises that are not assigned)
    index('exercise_tracking_workout_summary_id_idx').on(t.workoutSummaryId),
    ...exerciseTrackingPolicies(t),
  ],
);
export const exerciseTrackingRelations = relations(exerciseTracking, ({ many, one }) => ({
  exerciseToWorkoutSplit: one(exerciseToWorkoutSplit, {
    fields: [exerciseTracking.exerciseToSplitId],
    references: [exerciseToWorkoutSplit.id],
  }),
  workoutSummary: one(workoutSummary, { fields: [exerciseTracking.workoutSummaryId], references: [workoutSummary.id] }),
  trackingSets: many(trackingSet),
  exercise: one(exercise, {
    fields: [exerciseTracking.exerciseId],
    references: [exercise.id],
  }),
}));
