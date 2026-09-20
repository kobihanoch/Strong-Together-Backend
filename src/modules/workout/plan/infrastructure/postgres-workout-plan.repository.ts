import { Injectable } from '@nestjs/common';
import type { WorkoutPlan, WorkoutSplitInput } from '../application/models/workout-plan.models';
import { WorkoutPlanRepository } from '../application/ports/workout-plan.repository';
import { WorkoutPlanSql } from './workout-plan.sql';
/** PostgreSQL adapter for active workout plans. */ @Injectable()
export class PostgresWorkoutPlanRepository implements WorkoutPlanRepository {
  constructor(private readonly sql: WorkoutPlanSql) {}
  async findActiveByUser(userId: string, timezone: string): Promise<WorkoutPlan | null> {
    return (await this.sql.queryWholeUserWorkoutPlan(userId, timezone))[0] ?? null;
  }
  async replaceForUser(userId: string, splits: WorkoutSplitInput[]): Promise<void> {
    await this.sql.queryAddWorkout(userId, splits);
  }
}
