import type { WorkoutScheduleInputDto, WorkoutScheduleQueryDto } from '@strong-together/shared';

/**
 * Defines the persistence operations required by workout-schedule use cases.
 *
 * The contract keeps application services independent of the SQL queries and
 * database technology used to store each user's weekly schedule.
 */
export abstract class WorkoutScheduleRepository {
  /**
   * Retrieves the active weekly workout schedules owned by a user.
   *
   * @param userId - The identifier of the user whose schedules are requested.
   * @returns The user's active workout schedules.
   */
  abstract findSchedulesByUser(userId: string): Promise<WorkoutScheduleQueryDto[]>;

  /**
   * Replaces all weekly workout schedules owned by a user.
   *
   * Passing an empty collection removes every existing schedule. The concrete
   * implementation is responsible for performing the replacement atomically.
   *
   * @param userId - The identifier of the user who owns the schedules.
   * @param schedules - The complete schedule collection that should remain active.
   * @returns A promise that resolves after the schedules have been persisted.
   */
  abstract replaceSchedulesForUser(userId: string, schedules: WorkoutScheduleInputDto[]): Promise<void>;
}
