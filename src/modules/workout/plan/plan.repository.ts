import type { SaveWorkoutSplitPayloadQueryDto, WholeUserWorkoutPlanQueryDto } from '@strong-together/shared';

/**
 * Defines the persistence operations required by workout-plan use cases.
 *
 * This application-facing contract keeps callers independent of the concrete
 * database technology and of the SQL-oriented query implementation used by
 * the infrastructure layer.
 */
export abstract class WorkoutPlanRepository {
  /**
   * Finds the active workout plan that belongs to a user.
   *
   * @param userId - The identifier of the user who owns the plan.
   * @param timezone - The IANA time-zone name used when deriving date-based plan data.
   * @returns The user's active workout plan, or `null` when the user has no active plan.
   */
  abstract findActivePlanByUser(userId: string, timezone: string): Promise<WholeUserWorkoutPlanQueryDto | null>;

  /**
   * Replaces a user's active workout plan with the supplied splits.
   *
   * Existing split identifiers are used to update matching splits, while
   * omitted identifiers cause new splits to be created. Persistence details
   * and the atomic replacement strategy are delegated to the implementation.
   *
   * @param userId - The identifier of the user who owns the plan.
   * @param workoutData - The complete set of workout splits that should remain active.
   * @returns A promise that resolves after the replacement has been persisted.
   */
  abstract replacePlanForUser(userId: string, workoutData: SaveWorkoutSplitPayloadQueryDto): Promise<void>;
}
