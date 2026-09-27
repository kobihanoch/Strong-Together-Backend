import { ReminderTimeZone } from '../value-objects/reminder-time-zone';

/** Primitive values used to construct reminder settings. */
export interface ReminderSettingsValues {
  reminderEnabled: boolean;
  timeZone: string;
}

/** User preference controlling workout reminders and their local time zone. */
export class ReminderSettingsPreference {
  public readonly reminderEnabled: boolean;
  public readonly timeZone: ReminderTimeZone;

  public constructor(values: ReminderSettingsValues) {
    if (typeof values.reminderEnabled !== 'boolean') throw new Error('Reminder enabled must be a boolean');
    this.reminderEnabled = values.reminderEnabled;
    this.timeZone = new ReminderTimeZone(values.timeZone);
  }
}
