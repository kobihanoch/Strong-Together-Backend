import { Injectable } from '@nestjs/common';
import { ReplaceForUserSql } from './writes/replace-for-user.sql';
import type { ReplaceWorkoutPlanOutcome } from '../../application/models/workout-plan.models';
import { WorkoutPlanRepository } from '../../application/ports/workout-plan.repository';
import type { WorkoutPlanReplacement } from '../../domain/entities/workout-plan-replacement';
/** PostgreSQL adapter for active workout plans. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresWorkoutPlanRepository implements WorkoutPlanRepository {
  public constructor(private readonly replaceForUserSql: ReplaceForUserSql) {}
  async replaceForUser(userId: string, plan: WorkoutPlanReplacement): Promise<ReplaceWorkoutPlanOutcome> {
    const splits = plan.splits.map((split) => ({
      id: split.id,
      name: split.name.value,
      orderIndex: split.orderIndex.value,
      exercises: split.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map((set) => set.value),
        orderIndex: exercise.orderIndex.value,
      })),
    }));
    const result = await this.replaceForUserSql.replaceForUser(userId, splits);
    return 'replaced' in result ? { kind: 'replaced' } : { kind: 'split-not-owned', splitId: result.invalidSplitId };
  }
}
