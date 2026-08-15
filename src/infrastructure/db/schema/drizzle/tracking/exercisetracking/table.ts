import { relations } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, real, text, uuid } from 'drizzle-orm/pg-core';
import { trackingSchema } from '../../schemas';
import { exercisetoworkoutsplit } from '../../workout/exercisetoworkoutsplit/table';
import { workoutSummary } from '../workout_summary/table';
import { trackingSet } from '../tracking_set/table';
import { exerciseTrackingPolicies } from './policies';

export const exercisetracking = trackingSchema.table(
  'exercisetracking',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'exercisetracking_id_seq' }).notNull(),
    exercisetosplitId: bigint('exercisetosplit_id', { mode: 'number' }).notNull(),
    weight: real('weight').array().notNull(),
    reps: bigint('reps', { mode: 'number' }).array().notNull(),
    notes: text('notes'),
    workoutSummaryId: uuid('workout_summary_id').notNull(),
  },
  (t) => [
    primaryKey({ name: 'exercisetracking_pkey', columns: [t.id] }),
    foreignKey({
      name: 'exercisetracking_exercisetosplit_id_fkey',
      columns: [t.exercisetosplitId],
      foreignColumns: [exercisetoworkoutsplit.id],
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
export const exercisetrackingRelations = relations(exercisetracking, ({ many, one }) => ({
  exerciseToWorkoutsplit: one(exercisetoworkoutsplit, {
    fields: [exercisetracking.exercisetosplitId],
    references: [exercisetoworkoutsplit.id],
  }),
  workoutSummary: one(workoutSummary, { fields: [exercisetracking.workoutSummaryId], references: [workoutSummary.id] }),
  trackingSets: many(trackingSet),
}));
