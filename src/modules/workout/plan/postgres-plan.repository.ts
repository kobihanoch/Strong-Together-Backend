import { Injectable } from '@nestjs/common';
import type { SaveWorkoutSplitPayloadQueryDto, WholeUserWorkoutPlanQueryDto } from '@strong-together/shared';
import { WorkoutPlanQueries } from './plan.queries';
import { WorkoutPlanRepository } from './plan.repository';

/**
 * PostgreSQL-backed implementation of {@link WorkoutPlanRepository}.
 *
 * The repository adapts the application-facing persistence contract to the
 * existing SQL query class. Raw SQL remains encapsulated by
 * {@link WorkoutPlanQueries}; this class interprets its database-oriented
 * results for the application layer.
 */
@Injectable()
export class PostgresWorkoutPlanRepository implements WorkoutPlanRepository {
  constructor(private readonly queries: WorkoutPlanQueries) {}

  async findActivePlanByUser(userId: string, timezone: string): Promise<WholeUserWorkoutPlanQueryDto | null> {
    const [plan] = await this.queries.queryWholeUserWorkoutPlan(userId, timezone);
    return plan ?? null;
  }

  async replacePlanForUser(userId: string, workoutData: SaveWorkoutSplitPayloadQueryDto): Promise<void> {
    await this.queries.queryAddWorkout(userId, workoutData);
  }
}
