import { relations } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, real, text, uuid } from 'drizzle-orm/pg-core';
import { trackingSchema } from '../../schemas';
import { exerciseToWorkoutSplit } from '../../workout/exercisetoworkoutsplit/table';
import { workoutSummary } from '../workout_summary/table';
import { trackingSet } from '../tracking_set/table';
import { exerciseTrackingPolicies } from './policies';

export const exerciseTracking = trackingSchema.table(
  'exercise_tracking',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'exercisetracking_id_seq' }).notNull(),
    exerciseToSplitId: bigint('exercise_to_split_id', { mode: 'number' }).notNull(),
    weight: real('weight').array().notNull(),
    reps: bigint('reps', { mode: 'number' }).array().notNull(),
    notes: text('notes'),
    workoutSummaryId: uuid('workout_summary_id').notNull(),
  },
  (t) => [
    primaryKey({ name: 'exercisetracking_pkey', columns: [t.id] }),
    foreignKey({
      name: 'exercisetracking_exercisetosplit_id_fkey',
      columns: [t.exerciseToSplitId],
      foreignColumns: [exerciseToWorkoutSplit.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      name: 'exercisetracking_workout_summary_id_fkey',
      columns: [t.workoutSummaryId],
      foreignColumns: [workoutSummary.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('exercisetracking_workout_summary_id_idx').on(t.workoutSummaryId),
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
}));
