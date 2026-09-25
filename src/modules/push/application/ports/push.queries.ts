import type { DueWorkoutReminder } from '../models/push.models';

/** Read operations required by application queries. */
export abstract class PushQueries {
  abstract findDueWorkoutReminders(): Promise<DueWorkoutReminder[]>;
  abstract findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null>;
}
