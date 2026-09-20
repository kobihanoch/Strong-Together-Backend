import { userReminderSetting } from '../../../infrastructure/db/schema/drizzle/reminders/user_reminder_setting/table';

type ReminderSettingsDbRow = typeof userReminderSetting.$inferSelect;

/** Serialized reminder-settings row returned by raw SQL. */
export type ReminderSettingsSqlRow = Omit<ReminderSettingsDbRow, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
