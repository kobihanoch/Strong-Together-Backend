import type { WorkoutSchedule } from '../../domain/entities/workout-schedule';

/** Persistence operations required by workout-schedule use cases. */
export abstract class WorkoutScheduleRepository {
  /** Retrieves active weekly schedule entries owned by a user. */

  /**
   * Atomically replaces a user's weekly schedule when every split is valid.
   *
   * @returns The replacement outcome.
   */
  public abstract save(schedule: WorkoutSchedule): Promise<boolean>;
}
