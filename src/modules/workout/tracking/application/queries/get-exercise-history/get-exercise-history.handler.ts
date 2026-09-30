import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { ExerciseHistory } from '../../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../../ports/workout-tracking-cache.port';
import { WorkoutTrackingQueries } from '../../ports/workout-tracking.queries';
import { GetExerciseHistoryQuery } from './get-exercise-history.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
/** Retrieves cached exercise history. */
@QueryHandler(GetExerciseHistoryQuery)
export class GetExerciseHistoryHandler implements IQueryHandler<GetExerciseHistoryQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutTrackingQueries,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Retrieves exercise history.
   *
   * @param userId - The user identifier.
   * @param days - The number of recent local days to include.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */
  async execute(query: GetExerciseHistoryQuery): Promise<{ payload: ExerciseHistory; cacheHit: boolean }> {
    const { userId, days, fromCache, timezone } = query;
    const cacheEntry = await this.cache.exerciseHistoryForUser(userId, days, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const payload = await this.query.findExerciseHistory(days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
