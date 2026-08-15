import { relations } from 'drizzle-orm';
import { bigint, primaryKey, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { workoutSchema } from '../../schemas';
import { exercisetoworkoutsplit } from '../exercisetoworkoutsplit/table';
import { exercisesPolicies } from './policies';

export const exercises = workoutSchema.table(
  'exercises',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'exercises_id_seq' }).notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    targetmuscle: text('targetmuscle').notNull(),
    specifictargetmuscle: text('specifictargetmuscle').notNull(),
  },
  (t) => [
    primaryKey({ name: 'exercises_pkey', columns: [t.id] }),
    uniqueIndex('exercises_name_unique').on(t.name),
    ...exercisesPolicies(),
  ],
);
export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutSplitAssignments: many(exercisetoworkoutsplit),
}));
