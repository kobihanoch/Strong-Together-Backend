import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, primaryKey, text, timestamp, unique, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { message } from '../../messages/messages/table';
import { userReminderSetting } from '../../reminders/user_reminder_setting/table';
import { userSplitInformation } from '../../reminders/user_split_information/table';
import { aerobicTracking } from '../../tracking/aerobic_tracking/table';
import { workoutSummary } from '../../tracking/workout_summary/table';
import { workoutPlan } from '../../workout/workout_plan/table';
import { identitySchema } from '../../schemas';
import { oauthAccount } from '../oauth_account/table';
import { userPolicies } from './policies';
export const user = identitySchema.table(
  'user',
  {
    username: text('username').notNull(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    gender: text('gender').default('Unknown').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(drizzleSql`(now() AT TIME ZONE 'utc')`)
      .notNull(),
    profileImagePath: text('profile_image_path'),
    id: uuid('id').defaultRandom().notNull(),
    pushToken: text('push_token'),
    password: text('password'),
    role: text('role').default('User').notNull(),
    tokenVersion: bigint('token_version', { mode: 'number' }).default(0).notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    authProvider: text('auth_provider').default('app').notNull(),
    lastLogin: timestamp('last_login', { withTimezone: true }),
  },
  (t) => [
    primaryKey({ name: 'user_pkey', columns: [t.id] }),
    unique('user_id_key').on(t.id),
    uniqueIndex('user_email_ci_unique')
      .on(drizzleSql`lower(trim(both from ${t.email}))`)
      .where(drizzleSql`${t.email} is not null`),
    uniqueIndex('user_username_ci_unique')
      .on(drizzleSql`lower(trim(both from ${t.username}))`)
      .where(drizzleSql`${t.username} is not null`),
    ...userPolicies(t),
  ],
);
export const userRelations = relations(user, ({ many, one }) => ({
  oauthAccounts: many(oauthAccount),
  ownedWorkoutPlans: many(workoutPlan, { relationName: 'workoutPlanOwner' }),
  trainedWorkoutPlans: many(workoutPlan, { relationName: 'workoutPlanTrainer' }),
  workoutSummaries: many(workoutSummary),
  aerobicTrackings: many(aerobicTracking),
  reminderSettings: one(userReminderSetting),
  splitInformation: many(userSplitInformation),
  sentMessages: many(message, { relationName: 'messageSender' }),
  receivedMessages: many(message, { relationName: 'messageReceiver' }),
}));
