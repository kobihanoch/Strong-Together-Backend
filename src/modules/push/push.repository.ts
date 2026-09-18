import type { DueWorkoutReminder } from './push.dtos';

/**
 * Defines the persistence operations required by push-reminder use cases.
 *
 * The contract keeps API and worker services independent of SQL, PostgreSQL,
 * and the concrete query implementation used to evaluate reminder eligibility.
 */
export abstract class PushRepository {
  /**
   * Retrieves workout reminders due in the configured scheduling window.
   *
   * @returns The eligible workout reminders that should be queued.
   */
  abstract findDueWorkoutReminders(): Promise<DueWorkoutReminder[]>;

  /**
   * Retrieves a user's current Expo token when a queued reminder remains eligible.
   *
   * @param userId - The identifier of the reminder owner.
   * @param workoutScheduleId - The identifier of the queued workout schedule.
   * @param occurrenceDate - The queued workout's local calendar date.
   * @returns The current Expo token, or `null` when the reminder is no longer eligible.
   */
  abstract findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null>;
}
