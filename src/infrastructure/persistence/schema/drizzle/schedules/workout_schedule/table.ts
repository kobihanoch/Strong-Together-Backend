import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, check, foreignKey, integer, primaryKey, time, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { schedulesSchema } from '../../schemas';
import { workoutSplit } from '../../workout/workout_split/table';
import { workoutSchedulePolicies } from './policies';

export const workoutSchedule = schedulesSchema
  .table(
    'workout_schedule',
    {
      id: uuid('id').defaultRandom().notNull(),
      userId: uuid('user_id').notNull(),
      workoutSplitId: bigint('workout_split_id', { mode: 'number' }).notNull(),
      dayOfWeek: integer('day_of_week').notNull(),
      startTime: time('start_time', { precision: 0 }).notNull(),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
      updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => [
      primaryKey({ name: 'workout_schedule_pkey', columns: [t.id] }),
      unique('workout_schedule_user_split_weekday_key').on(t.userId, t.workoutSplitId, t.dayOfWeek),
      check('workout_schedule_day_of_week_check', drizzleSql`${t.dayOfWeek} BETWEEN 0 AND 6`),
      foreignKey({ name: 'workout_schedule_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({
        name: 'workout_schedule_workout_split_id_fkey',
        columns: [t.workoutSplitId],
        foreignColumns: [workoutSplit.id],
      })
        .onUpdate('cascade')
        .onDelete('cascade'),
      ...workoutSchedulePolicies(t),
    ],
  )
  .enableRLS();

export const workoutScheduleRelations = relations(workoutSchedule, ({ one }) => ({
  user: one(user, { fields: [workoutSchedule.userId], references: [user.id] }),
  workoutSplit: one(workoutSplit, { fields: [workoutSchedule.workoutSplitId], references: [workoutSplit.id] }),
}));
