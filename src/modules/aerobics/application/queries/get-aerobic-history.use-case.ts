import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../common/application/ports/unit-of-work.port';
import type { AerobicsHistory } from '../models/aerobics.models';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsQueries } from '../ports/aerobics.queries';

/** Retrieves and caches a user's aerobic history. */
@Injectable()
export class GetAerobicHistoryUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: AerobicsQueries,
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
  async execute(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    timezone: string = 'Asia/Jerusalem',
  ): Promise<{ payload: AerobicsHistory; cacheHit: boolean }> {
    const cacheEntry = await this.cache.forUser(userId, days, timezone);
    if (fromCache) {
      const cached = await cacheEntry.get();
      if (cached) return { payload: cached, cacheHit: true };
    }

    return this.unitOfWork.execute(userId, async () => {
      const payload = await this.repository.findByUser(userId, days, timezone);
      this.unitOfWork.afterCommit(() => cacheEntry.set(payload));
      return { payload, cacheHit: false };
    });
  }
}
