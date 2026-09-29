import { userReminderSetting } from '../../../../infrastructure/persistence/schema/drizzle/reminders/user_reminder_setting/table';

/** Represents the reminder settings db row value. */
type ReminderSettingsDbRow = typeof userReminderSetting.$inferSelect;

/** Primitive reminder settings accepted by write SQL. */
export type ReminderSettingsSqlInput = Pick<ReminderSettingsDbRow, 'reminderEnabled' | 'timeZone'>;

/** Serialized reminder-settings row returned by raw SQL. */
export type ReminderSettingsSqlRow = Omit<ReminderSettingsDbRow, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

/** Complete domain state loaded for a reminder-settings mutation. */
export type ReminderSettingsDomainSqlRow = Pick<ReminderSettingsDbRow, 'userId' | 'reminderEnabled' | 'timeZone'>;
