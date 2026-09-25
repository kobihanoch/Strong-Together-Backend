import type { WeeklyWorkoutSchedule } from '../../domain/entities/weekly-workout-schedule';
import type { ReplaceWorkoutSchedulesOutcome } from '../models/workout-schedule.models';

/** Persistence operations required by workout-schedule use cases. */
export abstract class WorkoutScheduleRepository {
  /** Retrieves active weekly schedule entries owned by a user. */

  /**
   * Atomically replaces a user's weekly schedule when every split is valid.
   *
   * @returns The replacement outcome.
   */
  public abstract replaceForUser(userId: string, schedule: WeeklyWorkoutSchedule): Promise<ReplaceWorkoutSchedulesOutcome>;
}
