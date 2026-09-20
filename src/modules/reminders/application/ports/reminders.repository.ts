import type { ReminderSettings, UpdateReminderTimeZoneInput, UpsertReminderSettingsInput } from '../models/reminders.models';

/** Persistence operations required by reminder-settings use cases. */
export abstract class RemindersRepository {
  abstract findByUser(userId: string): Promise<ReminderSettings | null>;
  abstract upsertForUser(userId: string, settings: UpsertReminderSettingsInput): Promise<void>;
  abstract updateTimeZoneForUser(userId: string, settings: UpdateReminderTimeZoneInput): Promise<void>;
}
