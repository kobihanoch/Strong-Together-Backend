import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, foreignKey, primaryKey, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { workoutSchema } from '../../schemas';
import { workoutSplit } from '../workout_split/table';
import { workoutPlanPolicies } from './policies';

export const workoutPlan = workoutSchema.table(
  'workout_plan',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'workout_plan_id_seq' }).notNull(),
    userId: uuid('user_id').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(drizzleSql`(now() AT TIME ZONE 'utc')`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ name: 'workout_plan_pkey', columns: [t.id] }),
    foreignKey({ name: 'workout_plan_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    uniqueIndex('uq_workout_plan_active_user')
      .on(t.userId)
      .where(drizzleSql`${t.isActive}`),
    ...workoutPlanPolicies(t),
  ],
);

export const workoutPlanRelations = relations(workoutPlan, ({ many, one }) => ({
  owner: one(user, { fields: [workoutPlan.userId], references: [user.id], relationName: 'workoutPlanOwner' }),
  splits: many(workoutSplit),
}));
