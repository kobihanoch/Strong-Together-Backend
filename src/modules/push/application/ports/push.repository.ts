import type { DueWorkoutReminder } from '../models/push.models';

/** Persistence operations required by push-reminder workflows. */
export abstract class PushRepository {
  abstract findDueWorkoutReminders(): Promise<DueWorkoutReminder[]>;
  abstract findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null>;
}
