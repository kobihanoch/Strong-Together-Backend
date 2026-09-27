import type { ReminderSettingsPreference } from '../../domain/entities/reminder-settings';
import type { ReminderTimeZone } from '../../domain/value-objects/reminder-time-zone';

/** Persistence operations required by reminder-settings use cases. */
export abstract class RemindersRepository {
  abstract upsertForUser(userId: string, settings: ReminderSettingsPreference): Promise<void>;
  abstract updateTimeZoneForUser(userId: string, timeZone: ReminderTimeZone): Promise<void>;
}
