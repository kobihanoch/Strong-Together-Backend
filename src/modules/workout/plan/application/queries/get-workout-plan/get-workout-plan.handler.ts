import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutPlanResult } from '../../models/workout-plan.models';
import { WorkoutPlanCache } from '../../ports/workout-plan-cache.port';
import { WorkoutPlanQueries } from '../../ports/workout-plan.queries';
import { GetWorkoutPlanQuery } from './get-workout-plan.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
/** Retrieves and caches a user's active workout plan. */
@QueryHandler(GetWorkoutPlanQuery)
export class GetWorkoutPlanHandler implements IQueryHandler<GetWorkoutPlanQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutPlanQueries,
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
  async execute(query: GetWorkoutPlanQuery): Promise<{ payload: WorkoutPlanResult; cacheHit: boolean }> {
    const { userId, fromCache, timezone } = query;
    const cacheEntry = await this.cache.forUser(userId, timezone);
    if (fromCache) {
      const cached = await cacheEntry.get();
      if (cached) return { payload: cached, cacheHit: true };
    }

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const payload = { workoutPlan: await this.query.findActiveByUser(timezone) };
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
