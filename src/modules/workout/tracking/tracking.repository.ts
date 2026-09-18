import type {
  ExerciseHistoryQueryDto,
  ExerciseTrackingMapsQueryDto,
  ExerciseTrackingStatsQueryDto,
  FinishedWorkoutEntryQueryDto,
  PersonalRecordsQueryDto,
} from '@strong-together/shared';

/**
 * Defines the persistence operations required by workout-tracking use cases.
 *
 * The contract exposes application-oriented operations while keeping services
 * independent of SQL, PostgreSQL, and the concrete query implementation.
 */
export abstract class WorkoutTrackingRepository {
  /**
   * Retrieves workout-history maps for a user over a recent date window.
   *
   * @param userId - The identifier of the user whose history is requested.
   * @param days - The number of recent calendar days to include.
   * @param timezone - The IANA time-zone name used to calculate date boundaries.
   * @returns The user's workout history grouped into tracking maps.
   */
  abstract findWorkoutHistoryByUser(userId: string, days: number, timezone: string): Promise<ExerciseTrackingMapsQueryDto>;

  /**
   * Retrieves exercise history grouped by exercise assignment.
   *
   * @param userId - The identifier of the user whose exercise history is requested.
   * @param days - The number of recent calendar days to include.
   * @param timezone - The IANA time-zone name used to calculate date boundaries.
   * @returns The user's exercise history grouped by exercise assignment.
   */
  abstract findExerciseHistoryByUser(userId: string, days: number, timezone: string): Promise<ExerciseHistoryQueryDto>;

  /**
   * Retrieves aggregate workout statistics for a user.
   *
   * @param userId - The identifier of the user whose statistics are requested.
   * @param days - The number of recent calendar days to include.
   * @param timezone - The IANA time-zone name used to calculate date boundaries.
   * @returns The user's workout statistics for the requested period.
   */
  abstract findWorkoutStatisticsByUser(userId: string, days: number, timezone: string): Promise<ExerciseTrackingStatsQueryDto>;

  /**
   * Retrieves all current personal records for a user.
   *
   * @param userId - The identifier of the user whose records are requested.
   * @param timezone - The IANA time-zone name used for local workout timestamps.
   * @returns The user's current personal records.
   */
  abstract findPersonalRecordsByUser(userId: string, timezone: string): Promise<PersonalRecordsQueryDto>;

  /**
   * Persists a completed workout session and its tracked sets.
   *
   * @param userId - The identifier of the user who completed the workout.
   * @param workout - The exercises and sets completed during the workout.
   * @param workoutStartUtc - The workout's UTC start timestamp, or `null` when unavailable.
   * @param workoutEndUtc - The workout's UTC end timestamp, or `null` when unavailable.
   * @returns A promise that resolves after the complete workout has been persisted.
   */
  abstract saveCompletedWorkoutForUser(
    userId: string,
    workout: FinishedWorkoutEntryQueryDto[],
    workoutStartUtc: string | null,
    workoutEndUtc: string | null,
  ): Promise<void>;
}
