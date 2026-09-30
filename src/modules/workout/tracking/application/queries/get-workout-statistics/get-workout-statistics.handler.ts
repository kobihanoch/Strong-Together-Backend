import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { WorkoutStatistics } from '../../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../../ports/workout-tracking-cache.port';
import { WorkoutTrackingQueries } from '../../ports/workout-tracking.queries';
import { GetWorkoutStatisticsQuery } from './get-workout-statistics.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
/** Retrieves cached workout statistics. */
@QueryHandler(GetWorkoutStatisticsQuery)
export class GetWorkoutStatisticsHandler implements IQueryHandler<GetWorkoutStatisticsQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutTrackingQueries,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Retrieves workout statistics.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent local days to include.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */ async execute(query: GetWorkoutStatisticsQuery): Promise<{ payload: WorkoutStatistics; cacheHit: boolean }> {
    const { userId, days, fromCache, timezone } = query;
    const cacheEntry = await this.cache.workoutStatisticsForUser(userId, days, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const payload = await this.query.findStatistics(days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
