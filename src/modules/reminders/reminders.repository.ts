import type { GetReminderSettingsResponse, UpdateReminderTimeZoneBody, UpsertReminderSettingsBody } from '@strong-together/shared';

/**
 * Defines the persistence operations required by reminder-settings use cases.
 *
 * The contract keeps application services independent of SQL, PostgreSQL,
 * and the concrete query implementation used to store reminder preferences.
 */
export abstract class RemindersRepository {
  /**
   * Retrieves reminder settings owned by a user.
   *
   * @param userId - The identifier of the user whose settings are requested.
   * @returns The user's reminder settings, or `null` when none exist.
   */
  abstract findReminderSettingsByUser(userId: string): Promise<GetReminderSettingsResponse['reminderSettings']>;

  /**
   * Creates or replaces reminder settings owned by a user.
   *
   * @param userId - The identifier of the user who owns the settings.
   * @param settings - The complete validated reminder settings to persist.
   * @returns A promise that resolves after the settings have been persisted.
   */
  abstract upsertReminderSettingsForUser(userId: string, settings: UpsertReminderSettingsBody): Promise<void>;

  /**
   * Updates the time zone of reminder settings owned by a user.
   *
   * @param userId - The identifier of the user who owns the settings.
   * @param settings - The validated reminder time-zone update.
   * @returns A promise that resolves after the time zone has been persisted.
   */
  abstract updateReminderTimeZoneForUser(userId: string, settings: UpdateReminderTimeZoneBody): Promise<void>;
}
