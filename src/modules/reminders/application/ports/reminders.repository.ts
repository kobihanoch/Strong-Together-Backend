import type { UpdateReminderTimeZoneInput, UpsertReminderSettingsInput } from '../models/reminders.models';

/** Persistence operations required by reminder-settings use cases. */
export abstract class RemindersRepository {
  abstract upsertForUser(userId: string, settings: UpsertReminderSettingsInput): Promise<void>;
  abstract updateTimeZoneForUser(userId: string, settings: UpdateReminderTimeZoneInput): Promise<void>;
}
