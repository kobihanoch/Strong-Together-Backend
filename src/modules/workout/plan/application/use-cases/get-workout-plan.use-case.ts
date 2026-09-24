import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutPlanResult } from '../models/workout-plan.models';
import { WorkoutPlanCache } from '../ports/workout-plan-cache.port';
import { WorkoutPlanRepository } from '../ports/workout-plan.repository';
/** Retrieves and caches a user's active workout plan. */
@Injectable()
export class GetWorkoutPlanUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: WorkoutPlanRepository,
    private readonly cache: WorkoutPlanCache,
  ) {}

  /**
   * Retrieves the active plan.
   *
   * @param userId - Plan owner.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - Time zone for localized values.
   * @returns The plan payload and cache status.
   */
  async execute(userId: string, fromCache = true, timezone = 'Asia/Jerusalem'): Promise<{ payload: WorkoutPlanResult; cacheHit: boolean }> {
    const cacheEntry = await this.cache.forUser(userId, timezone);
    if (fromCache) {
      const cached = await cacheEntry.get();
      if (cached) return { payload: cached, cacheHit: true };
    }

    return this.unitOfWork.execute(userId, async () => {
      const payload = { workoutPlan: await this.repository.findActiveByUser(userId, timezone) };
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
