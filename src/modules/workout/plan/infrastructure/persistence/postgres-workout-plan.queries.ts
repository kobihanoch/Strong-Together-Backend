import { Injectable } from '@nestjs/common';
import { FindActiveByUserSql } from './reads/find-active-by-user.sql';
import type { WorkoutPlan } from '../../application/models/workout-plan.models';
import { WorkoutPlanQueries } from '../../application/ports/workout-plan.queries';
/** PostgreSQL adapter for active workout plans. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresWorkoutPlanQueries implements WorkoutPlanQueries {
  public constructor(private readonly findActiveByUserSql: FindActiveByUserSql) {}
  async findActiveByUser(userId: string, timezone: string): Promise<WorkoutPlan | null> {
    return (await this.findActiveByUserSql.findActiveByUser(userId, timezone))[0] ?? null;
  }
}
