import { ReminderTimeZone } from '../value-objects/reminder-time-zone';
import { InvalidReminderEnabledError } from '../errors/reminder-settings.errors';

/** Primitive values used to construct reminder settings. */
export interface ReminderSettingsValues {
  reminderEnabled: boolean;
  timeZone: string;
}

/** User preference controlling workout reminders and their local time zone. */
export class ReminderSettings {
  private constructor(
    public readonly userId: string,
    public reminderEnabled: boolean,
    public timeZone: ReminderTimeZone,
  ) {}

  static create(userId: string, values: ReminderSettingsValues): ReminderSettings {
    ReminderSettings.validateEnabled(values.reminderEnabled);
    return new ReminderSettings(userId, values.reminderEnabled, new ReminderTimeZone(values.timeZone));
  }

  static restore(userId: string, values: ReminderSettingsValues): ReminderSettings {
    ReminderSettings.validateEnabled(values.reminderEnabled);
    return new ReminderSettings(userId, values.reminderEnabled, new ReminderTimeZone(values.timeZone));
  }

  replace(values: ReminderSettingsValues): void {
    ReminderSettings.validateEnabled(values.reminderEnabled);
    this.reminderEnabled = values.reminderEnabled;
    this.timeZone = new ReminderTimeZone(values.timeZone);
  }

  changeTimeZone(timeZone: string): void {
    this.timeZone = new ReminderTimeZone(timeZone);
  }

  private static validateEnabled(value: boolean): void {
    if (typeof value !== 'boolean') throw new InvalidReminderEnabledError();
  }
}
