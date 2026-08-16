import { relations, sql as drizzleSql } from 'drizzle-orm';
import { boolean, foreignKey, integer, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/users/table';
import { remindersSchema } from '../../schemas';
import { userReminderSettingPolicies } from './policies';

export const userReminderSetting = remindersSchema.table('user_reminder_setting', { userId: uuid('user_id').notNull(), workoutRemindersEnabled: boolean('workout_reminders_enabled').default(true).notNull(), reminderOffsetMinutes: integer('reminder_offset_minutes').default(60).notNull(), updatedAt: timestamp('updated_at', { withTimezone: true }).default(drizzleSql`timezone('UTC', now())`).notNull(), timezone: text('timezone').default("'UTC'::text") }, (t) => [primaryKey({ name: 'user_reminder_setting_pkey', columns: [t.userId] }), foreignKey({ name: 'user_reminder_setting_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] }).onDelete('cascade'), ...userReminderSettingPolicies(t)]);
export const userReminderSettingRelations = relations(userReminderSetting, ({ one }) => ({ user: one(user, { fields: [userReminderSetting.userId], references: [user.id] }) }));
