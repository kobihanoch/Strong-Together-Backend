import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutHistory } from '../../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../../ports/workout-tracking-cache.port';
import { WorkoutTrackingQueries } from '../../ports/workout-tracking.queries';
import { GetWorkoutHistoryQuery } from './get-workout-history.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
/** Retrieves cached workout history. */
@QueryHandler(GetWorkoutHistoryQuery)
export class GetWorkoutHistoryHandler implements IQueryHandler<GetWorkoutHistoryQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutTrackingQueries,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Retrieves workout history.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent local days to include.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */ async execute(query: GetWorkoutHistoryQuery): Promise<{ payload: WorkoutHistory; cacheHit: boolean }> {
    const { userId, days, fromCache, timezone } = query;
    const cacheEntry = await this.cache.workoutHistoryForUser(userId, days, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const payload = await this.query.findWorkoutHistory(days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
