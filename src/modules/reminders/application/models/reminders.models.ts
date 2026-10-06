/** Reminder settings returned for a user. */
export interface ReminderSettings {
  id: string;
  userId: string;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  timeZone: string;
}

/** Complete reminder-settings replacement input. */
export interface UpsertReminderSettingsInput {
  reminderEnabled: boolean;
  timeZone: string;
}

/** Reminder time-zone update input. */
export interface UpdateReminderTimeZoneInput {
  timeZone: string;
}

/** Reminder-settings result returned by the application. */
export interface ReminderSettingsResult {
  reminderSettings: ReminderSettings | null;
}
