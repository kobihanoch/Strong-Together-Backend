import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { AerobicsHistory } from '../../models/aerobics.models';
import { AerobicsCache } from '../../ports/aerobics-cache.port';
import { AerobicsQueries } from '../../ports/aerobics.queries';
import { GetAerobicHistoryQuery } from './get-aerobic-history.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves and caches a user's aerobic history. */
@QueryHandler(GetAerobicHistoryQuery)
export class GetAerobicHistoryHandler implements IQueryHandler<GetAerobicHistoryQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: AerobicsQueries,
    private readonly cache: AerobicsCache,
  ) {}

  /**
   * Retrieves a user's aerobic history for a recent local-date window.
   *
   * @param userId - The user whose history is requested.
   * @param days - The number of recent calendar days to include.
   * @param fromCache - Whether a cached result may be returned.
   * @param timezone - The IANA time zone used for date boundaries.
   * @returns The history payload and whether it came from cache.
   */
  async execute(query: GetAerobicHistoryQuery
  ): Promise<{ payload: AerobicsHistory; cacheHit: boolean }> {
    const { userId, days, fromCache, timezone } = query;
    const cacheEntry = await this.cache.forUser(userId, days, timezone);
    if (fromCache) {
      const cached = await cacheEntry.get();
      if (cached) return { payload: cached, cacheHit: true };
    }

    return this.unitOfWork.executeReadOnly(userId, async () => {
      const payload = await this.query.findByUser(days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
