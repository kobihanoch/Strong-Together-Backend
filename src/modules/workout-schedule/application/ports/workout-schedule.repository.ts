import type { WorkoutSchedule, WorkoutScheduleInput } from '../models/workout-schedule.models';

/** Persistence operations required by workout-schedule use cases. */
export abstract class WorkoutScheduleRepository {
  /** Retrieves active weekly schedule entries owned by a user. */
  public abstract findByUser(userId: string): Promise<WorkoutSchedule[]>;

  /**
   * Atomically replaces a user's weekly schedule when every split is valid.
   *
   * @returns Whether all submitted splits belong to the user's active plan.
   */
  public abstract replaceForUser(userId: string, schedules: WorkoutScheduleInput[]): Promise<boolean>;
}
