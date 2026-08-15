import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, boolean, primaryKey, text, timestamp, unique, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { messages } from '../../messages/messages/table';
import { userReminderSettings, userSplitInformation } from '../../reminders/tables';
import { aerobictracking, workoutSummary } from '../../tracking/tables';
import { workoutplans } from '../../workout/tables';
import { identitySchema } from '../../schemas';
import { oauthAccounts } from '../oauth-accounts/table';
import { usersPolicies } from './policies';
export const users = identitySchema.table(
  'users',
  {
    username: text('username').notNull(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    gender: text('gender').default('Unknown').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(drizzleSql`now() AT TIME ZONE 'utc'`)
      .notNull(),
    profileImageUrl: text('profile_image_url'),
    id: uuid('id').defaultRandom().notNull(),
    pushToken: text('push_token'),
    password: text('password'),
    role: text('role').default('User').notNull(),
    isFirstLogin: boolean('is_first_login').default(true).notNull(),
    tokenVersion: bigint('token_version', { mode: 'number' }).default(0).notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    authProvider: text('auth_provider').default('app').notNull(),
    lastLogin: timestamp('last_login', { withTimezone: true }),
  },
  (t) => [
    primaryKey({ name: 'users_pkey', columns: [t.id] }),
    unique('users_id_key1').on(t.id),
    uniqueIndex('users_email_ci_unique')
      .on(drizzleSql`lower(trim(both from ${t.email}))`)
      .where(drizzleSql`${t.email} is not null`),
    uniqueIndex('users_username_ci_unique')
      .on(drizzleSql`lower(trim(both from ${t.username}))`)
      .where(drizzleSql`${t.username} is not null`),
    ...usersPolicies(t),
  ],
);
export const usersRelations = relations(users, ({ many, one }) => ({
  oauthAccounts: many(oauthAccounts),
  ownedWorkoutplans: many(workoutplans, { relationName: 'workoutplanOwner' }),
  trainedWorkoutplans: many(workoutplans, { relationName: 'workoutplanTrainer' }),
  workoutSummaries: many(workoutSummary),
  aerobicTrackings: many(aerobictracking),
  reminderSettings: one(userReminderSettings),
  splitInformation: many(userSplitInformation),
  sentMessages: many(messages, { relationName: 'messageSender' }),
  receivedMessages: many(messages, { relationName: 'messageReceiver' }),
}));
