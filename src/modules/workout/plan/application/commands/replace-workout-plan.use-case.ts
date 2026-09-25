import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { InvalidWorkoutSplitError } from '../errors/workout-plan.errors';
import type { WorkoutSplitInput } from '../models/workout-plan.models';
import { WorkoutPlanCache } from '../ports/workout-plan-cache.port';
import { WorkoutPlanRepository } from '../ports/workout-plan.repository';
/** Replaces a user's active workout plan. */
@Injectable()
export class ReplaceWorkoutPlanUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: WorkoutPlanRepository,
    private readonly cache: WorkoutPlanCache,
  ) {}
  /**
   * Replaces the complete plan snapshot.
   *
   * @param userId - Plan owner.
   * @param splits - Splits that should remain active.
   * @returns Nothing.
   * @throws {InvalidWorkoutSplitError} When a submitted existing split is not owned by the plan.
   */
  async execute(userId: string, splits: WorkoutSplitInput[]): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.replaceForUser(userId, splits);
      if (outcome.kind === 'split-not-owned') {
        throw new InvalidWorkoutSplitError(outcome.splitId);
      }
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
