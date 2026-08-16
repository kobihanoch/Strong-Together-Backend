import { relations } from 'drizzle-orm';
import { bigint, primaryKey, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { exerciseToWorkoutSplit } from '../exercisetoworkoutsplit/table';
import { exercisePolicies } from './policies';

export const exercise = workoutSchema.table(
  'exercise',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'exercises_id_seq' }).notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    targetMuscle: text('targetmuscle').notNull(),
    specificTargetMuscle: text('specifictargetmuscle').notNull(),
  },
  (t) => [
    primaryKey({ name: 'exercises_pkey', columns: [t.id] }),
    uniqueIndex('exercises_name_unique').on(t.name),
    ...exercisePolicies(),
  ],
);
export const exerciseRelations = relations(exercise, ({ many }) => ({
  workoutSplitAssignments: many(exerciseToWorkoutSplit),
}));
