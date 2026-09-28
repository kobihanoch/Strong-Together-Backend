import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { InvalidWorkoutSplitError } from '../errors/workout-plan.errors';
import type { WorkoutSplitInput } from '../models/workout-plan.models';
import { WorkoutPlanCache } from '../ports/workout-plan-cache.port';
import { WorkoutPlanRepository } from '../ports/workout-plan.repository';
import { WorkoutPlan } from '../../domain/entities/workout-plan';
import { WorkoutSplitNotInPlanError } from '../../domain/errors/workout-plan.errors';

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
      // Lock and restore the current plan so the domain makes decisions from stable state.
      const plan = await this.repository.findForUpdate(userId);

      if (plan) {
        try {
          // Existing plan: preserve owned IDs, update submitted splits, and deactivate omissions.
          plan.replaceSplits(splits);
        } catch (error) {
          // Keep the existing API error, including the rejected ID, at the application boundary.
          if (error instanceof WorkoutSplitNotInPlanError) throw new InvalidWorkoutSplitError(error.splitId);
          throw error;
        }
      } else {
        // A client cannot update an identified split when no active plan exists.
        const submittedId = splits.find((split) => split.id !== undefined)?.id;
        if (submittedId !== undefined) throw new InvalidWorkoutSplitError(submittedId);
      }

      // New plan: create the aggregate. Existing plan: use the state changed above.
      const workoutPlan = plan ?? WorkoutPlan.create(splits);

      // Persist the complete decided state in this same transaction, then invalidate cache only after commit.
      await this.repository.save(userId, workoutPlan);
      this.unitOfWork.afterCommit(() => this.cache.invalidateUser(userId));
    });
  }
}
