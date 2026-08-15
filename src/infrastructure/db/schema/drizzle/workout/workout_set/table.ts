import { relations } from 'drizzle-orm';
import { bigint, foreignKey, index, integer, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { exercisetoworkoutsplit } from '../exercisetoworkoutsplit/table';
import { workoutSetPolicies } from './policies';

export const workoutSet = workoutSchema.table(
  'workout_set',
  {
    id: uuid('id').defaultRandom().notNull(),
    exerciseToWorkoutsplitId: bigint('exercisetoworkoutsplit_id', { mode: 'number' }).notNull(),
    orderIndex: integer('order_index').notNull(),
    reps: integer('reps').notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_set_pkey', columns: [t.id] }),
    unique('workout_set_exercise_order_unique').on(t.exerciseToWorkoutsplitId, t.orderIndex),
    foreignKey({
      name: 'workout_set_exercisetoworkoutsplit_id_fkey',
      columns: [t.exerciseToWorkoutsplitId],
      foreignColumns: [exercisetoworkoutsplit.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('workout_set_exercisetoworkoutsplit_id_idx').on(t.exerciseToWorkoutsplitId),
    ...workoutSetPolicies(t),
  ],
);

export const workoutSetRelations = relations(workoutSet, ({ one }) => ({
  exerciseToWorkoutsplit: one(exercisetoworkoutsplit, {
    fields: [workoutSet.exerciseToWorkoutsplitId],
    references: [exercisetoworkoutsplit.id],
  }),
}));
