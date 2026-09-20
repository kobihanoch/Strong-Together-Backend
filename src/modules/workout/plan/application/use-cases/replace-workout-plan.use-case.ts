import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import type { WorkoutSplitInput } from '../models/workout-plan.models';
import { WorkoutPlanCache } from '../ports/workout-plan-cache.port';
import { WorkoutPlanRepository } from '../ports/workout-plan.repository';
/** Replaces a user's active workout plan. */
@Injectable()
export class ReplaceWorkoutPlanUseCase {
  constructor(
    private readonly repository: WorkoutPlanRepository,
    private readonly cache: WorkoutPlanCache,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Replaces the complete plan snapshot.
   * @param userId - Plan owner.
   * @param splits - Splits that should remain active.
   * @returns Nothing.
   * @throws {InvalidWorkoutSplitError} When a submitted existing split is not owned by the plan.
   */
  async execute(userId: string, splits: WorkoutSplitInput[]): Promise<void> {
    await this.repository.replaceForUser(userId, splits);
    this.hooks.afterCommit(() => this.cache.invalidateUser(userId));
  }
}
