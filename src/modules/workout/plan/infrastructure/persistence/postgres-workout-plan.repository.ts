import { Injectable } from '@nestjs/common';
import { ReplaceForUserSql } from './writes/replace-for-user.sql';
import type { ReplaceWorkoutPlanOutcome, WorkoutSplitInput } from '../../application/models/workout-plan.models';
import { WorkoutPlanRepository } from '../../application/ports/workout-plan.repository';
/** PostgreSQL adapter for active workout plans. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutPlanRepository implements WorkoutPlanRepository {
  public constructor(private readonly replaceForUserSql: ReplaceForUserSql) {}
  async replaceForUser(userId: string, splits: WorkoutSplitInput[]): Promise<ReplaceWorkoutPlanOutcome> {
    const result = await this.replaceForUserSql.replaceForUser(userId, splits);
    return 'replaced' in result ? { kind: 'replaced' } : { kind: 'split-not-owned', splitId: result.invalidSplitId };
  }
}
