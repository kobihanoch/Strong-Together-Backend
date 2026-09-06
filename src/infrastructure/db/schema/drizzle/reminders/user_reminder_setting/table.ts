import { relations } from 'drizzle-orm';
import { boolean, foreignKey, integer, primaryKey, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { remindersSchema } from '../../schemas';
import { userReminderSettingPolicies } from './policies';

export const userReminderSetting = remindersSchema.table(
  'user_reminder_setting',
  {
    id: uuid('id').defaultRandom().notNull(),
    userId: uuid('user_id').notNull(),
    reminderEnabled: boolean('reminder_enabled').default(false).notNull(),
    reminderOffsetMinutes: integer('reminder_offset_minutes').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    timeZone: text('time_zone').notNull(),
  },
  (t) => [
    primaryKey({ name: 'user_reminder_setting_pkey', columns: [t.id] }),
    unique('user_reminder_setting_user_id_key').on(t.userId),
    foreignKey({ name: 'user_reminder_setting_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] }).onDelete('cascade'),
    ...userReminderSettingPolicies(t),
  ],
);
export const userReminderSettingRelations = relations(userReminderSetting, ({ one }) => ({
  user: one(user, { fields: [userReminderSetting.userId], references: [user.id] }),
}));
