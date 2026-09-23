import type { ReplaceWorkoutSchedulesOutcome, WorkoutSchedule, WorkoutScheduleInput } from '../models/workout-schedule.models';

/** Persistence operations required by workout-schedule use cases. */
export abstract class WorkoutScheduleRepository {
  /** Retrieves active weekly schedule entries owned by a user. */
  public abstract findByUser(userId: string): Promise<WorkoutSchedule[]>;

  /**
   * Atomically replaces a user's weekly schedule when every split is valid.
   *
   * @returns The replacement outcome.
   */
  public abstract replaceForUser(userId: string, schedules: WorkoutScheduleInput[]): Promise<ReplaceWorkoutSchedulesOutcome>;
}
