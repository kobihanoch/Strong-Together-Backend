import { relations } from 'drizzle-orm';
import { bigint, boolean, foreignKey, index, primaryKey, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { userSplitInformation } from '../../reminders/user_split_information/table';
import { workoutSummary } from '../../tracking/workout_summary/table';
import { workoutSchema } from '../../schemas';
import { exercisetoworkoutsplit } from '../exercisetoworkoutsplit/table';
import { workoutplans } from '../workoutplans/table';
import { workoutsplitsPolicies } from './policies';

export const workoutsplits = workoutSchema.table('workoutsplits', { id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'workoutsplits_id_seq' }).notNull(), workoutId: bigint('workout_id', { mode: 'number' }).notNull(), name: text('name').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(), muscleGroup: text('muscle_group'), isActive: boolean('is_active').default(true).notNull() }, (t) => [primaryKey({ name: 'workoutsplits_pkey', columns: [t.id] }), unique('uq_workoutsplits_plan_name').on(t.workoutId, t.name), foreignKey({ name: 'workoutsplits_workout_id_fkey', columns: [t.workoutId], foreignColumns: [workoutplans.id] }).onUpdate('cascade').onDelete('cascade'), index('workoutsplits_workout_id_idx').on(t.workoutId), ...workoutsplitsPolicies(t)]);
export const workoutsplitsRelations = relations(workoutsplits, ({ many, one }) => ({ workoutplan: one(workoutplans, { fields: [workoutsplits.workoutId], references: [workoutplans.id] }), exerciseAssignments: many(exercisetoworkoutsplit), workoutSummaries: many(workoutSummary), splitInformation: many(userSplitInformation) }));
