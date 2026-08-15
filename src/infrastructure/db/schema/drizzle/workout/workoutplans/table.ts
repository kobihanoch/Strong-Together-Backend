import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, foreignKey, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../identity/users/table';
import { workoutSchema } from '../../schemas';
import { workoutsplits } from '../workoutsplits/table';
import { workoutplansPolicies } from './policies';

export const workoutplans = workoutSchema.table(
  'workoutplans',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'workoutplan_id_seq' }).notNull(),
    name: text('name').default('My Workout').notNull(),
    numberofsplits: bigint('numberofsplits', { mode: 'number' }).default(1).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    level: text('level').default('Beginner').notNull(),
    userId: uuid('user_id').notNull(),
    trainerId: uuid('trainer_id'),
    isActive: boolean('is_active').default(true).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(drizzleSql`(now() AT TIME ZONE 'utc')`)
      .notNull(),
  },
  (t) => [
    primaryKey({ name: 'workoutplan_pkey', columns: [t.id] }),
    foreignKey({ name: 'workoutplans_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({ name: 'workoutplans_trainer_id_fkey', columns: [t.trainerId], foreignColumns: [users.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    uniqueIndex('uq_workoutplans_active_user')
      .on(t.userId)
      .where(drizzleSql`${t.isActive}`),
    ...workoutplansPolicies(t),
  ],
);
export const workoutplansRelations = relations(workoutplans, ({ many, one }) => ({
  owner: one(users, { fields: [workoutplans.userId], references: [users.id], relationName: 'workoutplanOwner' }),
  trainer: one(users, { fields: [workoutplans.trainerId], references: [users.id], relationName: 'workoutplanTrainer' }),
  splits: many(workoutsplits),
}));
