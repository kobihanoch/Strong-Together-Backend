import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { PersonalRecords } from '../../models/workout-tracking.models';
import { WorkoutTrackingCache } from '../../ports/workout-tracking-cache.port';
import { WorkoutTrackingQueries } from '../../ports/workout-tracking.queries';
import { GetPersonalRecordsQuery } from './get-personal-records.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
/** Retrieves cached personal records. */
@QueryHandler(GetPersonalRecordsQuery)
export class GetPersonalRecordsHandler implements IQueryHandler<GetPersonalRecordsQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: WorkoutTrackingQueries,
    private readonly cache: WorkoutTrackingCache,
  ) {}
  /**
   * Retrieves personal records.
   *
   * @param userId - The user identifier.
   * @param fromCache - Whether cached data may be returned.
   * @param timezone - The IANA time-zone name.
   * @returns The use-case result.
   */ async execute(query: GetPersonalRecordsQuery): Promise<{ payload: PersonalRecords; cacheHit: boolean }> {
    const { userId, fromCache, timezone } = query;
    const cacheEntry = await this.cache.personalRecordsForUser(userId, timezone);
    if (fromCache) {
      const value = await cacheEntry.get();
      if (value) return { payload: value, cacheHit: true };
    }

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const payload = await this.query.findPersonalRecords(timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
