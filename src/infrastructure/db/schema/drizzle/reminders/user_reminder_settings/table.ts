import { relations, sql as drizzleSql } from 'drizzle-orm';
import { boolean, foreignKey, integer, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../identity/users/table';
import { remindersSchema } from '../../schemas';
import { reminderSettingsPolicies } from './policies';

export const userReminderSettings = remindersSchema.table('user_reminder_settings', { userId: uuid('user_id').notNull(), workoutRemindersEnabled: boolean('workout_reminders_enabled').default(true).notNull(), reminderOffsetMinutes: integer('reminder_offset_minutes').default(60).notNull(), updatedAt: timestamp('updated_at', { withTimezone: true }).default(drizzleSql`timezone('UTC', now())`).notNull(), timezone: text('timezone').default("'UTC'::text") }, (t) => [primaryKey({ name: 'user_reminder_settings_pkey', columns: [t.userId] }), foreignKey({ name: 'user_reminder_settings_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] }).onDelete('cascade'), ...reminderSettingsPolicies(t)]);
export const userReminderSettingsRelations = relations(userReminderSettings, ({ one }) => ({ user: one(users, { fields: [userReminderSettings.userId], references: [users.id] }) }));
