import { Injectable } from '@nestjs/common';
import { AerobicsQueries } from './aerobics.queries.ts';
import type { AddUserAerobicsBody, UserAerobicsResponse } from '@strong-together/shared';
import { buildAerobicsKeyStable, TTL_AEROBICS } from './aerobics.cache.ts';
import { CacheService } from '../../infrastructure/cache/cache.service.ts';

@Injectable()
export class AerobicsService {
  constructor(
    private readonly aerobicsQueries: AerobicsQueries,
    private readonly cacheService: CacheService,
  ) {}

  async getAerobicsData(
    userId: string,
    days: number = 45,
    fromCache: boolean = true,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: UserAerobicsResponse; cacheHit: boolean }> {
    const aerobicsKey = buildAerobicsKeyStable(userId, days, tz);

    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(aerobicsKey);
      const cached = await this.cacheService.cacheGetJSON<UserAerobicsResponse>(aerobicsKey);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const rows = await this.aerobicsQueries.queryGetUserAerobicsForNDays(userId, days, tz);
    await this.cacheService.cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);

    return { payload: rows, cacheHit: false };
  }

  async addUserAerobicsRecord(userId: string, body: AddUserAerobicsBody): Promise<UserAerobicsResponse> {
    await this.aerobicsQueries.queryAddAerobicTracking(userId, body.record);

    const { payload } = await this.getAerobicsData(userId, 45, false, body.tz);
    const aerobicsKey = buildAerobicsKeyStable(userId, 45, body.tz);

    await this.cacheService.cacheSetJSON(aerobicsKey, payload, TTL_AEROBICS);
    return payload;
  }
}
