import { Injectable } from '@nestjs/common';
import { TransactionHooks } from '../../../../common/application/ports/transaction-hooks.port';
import type { AerobicsHistory } from '../models/aerobics.models';
import { AerobicsCache } from '../ports/aerobics-cache.port';
import { AerobicsRepository } from '../ports/aerobics.repository';

/** Retrieves and caches a user's aerobic history. */
@Injectable()
export class GetAerobicHistoryUseCase {
  constructor(
    private readonly repository: AerobicsRepository,
    private readonly cache: AerobicsCache,
    private readonly transactionHooks: TransactionHooks,
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

    const payload = await this.repository.findByUser(userId, days, timezone);
    this.transactionHooks.afterCommit(() => cacheEntry.set(payload));
    return { payload, cacheHit: false };
  }
}
