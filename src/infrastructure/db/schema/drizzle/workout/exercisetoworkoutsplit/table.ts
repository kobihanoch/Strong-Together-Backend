import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, foreignKey, index, primaryKey, timestamp, unique } from 'drizzle-orm/pg-core';
import { exercisetracking } from '../../tracking/exercisetracking/table';
import { workoutSchema } from '../../schemas';
import { exercises } from '../exercises/table';
import { workoutsplits } from '../workoutsplits/table';
import { workoutSet } from '../workout_set/table';
import { exerciseToSplitPolicies } from './policies';

export const exercisetoworkoutsplit = workoutSchema.table(
  'exercisetoworkoutsplit',
  {
    id: bigint('id', { mode: 'number' })
      .generatedByDefaultAsIdentity({ name: 'ExerciseToWorkoutsplit_id_seq' })
      .notNull(),
    exerciseId: bigint('exercise_id', { mode: 'number' }).notNull(),
    workoutsplitId: bigint('workoutsplit_id', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    sets: bigint('sets', { mode: 'number' }).array().notNull(),
    orderIndex: bigint('order_index', { mode: 'number' }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
  },
  (t) => [
    primaryKey({ name: 'ExerciseToWorkoutsplit_pkey', columns: [t.id] }),
    unique('uq_ets_split_exercise').on(t.workoutsplitId, t.exerciseId),
    foreignKey({
      name: 'ExerciseToWorkoutsplit_exercise_id_fkey',
      columns: [t.exerciseId],
      foreignColumns: [exercises.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      name: 'ExerciseToWorkoutsplit_workoutsplit_id_fkey',
      columns: [t.workoutsplitId],
      foreignColumns: [workoutsplits.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('exercisetoworkoutsplit_active_idx')
      .on(t.workoutsplitId, t.orderIndex)
      .where(drizzleSql`${t.isActive} = true`),
    index('exercisetoworkoutsplit_workoutsplit_id_order_index_idx').on(t.workoutsplitId, t.orderIndex),
    ...exerciseToSplitPolicies(t),
  ],
);
export const exercisetoworkoutsplitRelations = relations(exercisetoworkoutsplit, ({ many, one }) => ({
  exercise: one(exercises, { fields: [exercisetoworkoutsplit.exerciseId], references: [exercises.id] }),
  workoutsplit: one(workoutsplits, { fields: [exercisetoworkoutsplit.workoutsplitId], references: [workoutsplits.id] }),
  exerciseTrackings: many(exercisetracking),
  workoutSets: many(workoutSet),
}));
