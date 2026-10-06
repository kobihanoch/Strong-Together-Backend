import { relations } from 'drizzle-orm';
import { bigint, foreignKey, index, integer, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { exerciseToWorkoutSplit } from '../exercisetoworkoutsplit/table';
import { workoutSetPolicies } from './policies';

export const workoutSet = workoutSchema.table(
  'workout_set',
  {
    id: uuid('id').defaultRandom().notNull(),
    exerciseToSplitId: bigint('exercise_to_split_id', { mode: 'number' }).notNull(),
    orderIndex: integer('order_index').notNull(),
    reps: integer('reps').notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_set_pkey', columns: [t.id] }),
    unique('workout_set_exercise_order_unique').on(t.exerciseToSplitId, t.orderIndex),
    foreignKey({
      name: 'workout_set_exercise_to_split_id_fkey',
      columns: [t.exerciseToSplitId],
      foreignColumns: [exerciseToWorkoutSplit.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('workout_set_exercise_to_split_id_idx').on(t.exerciseToSplitId),
    ...workoutSetPolicies(t),
  ],
);

export const workoutSetRelations = relations(workoutSet, ({ one }) => ({
  exerciseToWorkoutSplit: one(exerciseToWorkoutSplit, {
    fields: [workoutSet.exerciseToSplitId],
    references: [exerciseToWorkoutSplit.id],
  }),
}));
