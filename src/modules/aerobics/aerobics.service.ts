import { Injectable } from '@nestjs/common';
import { AerobicsQueries } from './aerobics.queries';
import type { AddUserAerobicsBody, UserAerobicsResponse } from '@strong-together/shared';
import { buildAerobicsKeyStable, TTL_AEROBICS } from './aerobics.cache';
import { CacheService } from '../../infrastructure/cache/cache.service';

@Injectable()
export class AerobicsService {
  constructor(
    private readonly aerobicsQueries: AerobicsQueries,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Retrieves aerobics.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param fromCache - The from cache.
   * @param tz - The IANA time-zone name.
   * @returns The aerobics result.
   */
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

  /**
   * Adds user aerobics record.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   * @returns The add user aerobics record result.
   */
  async addUserAerobicsRecord(userId: string, body: AddUserAerobicsBody): Promise<UserAerobicsResponse> {
    await this.aerobicsQueries.queryAddAerobicTracking(userId, body.record);

    const { payload } = await this.getAerobicsData(userId, 45, false, body.tz);
    const aerobicsKey = buildAerobicsKeyStable(userId, 45, body.tz);

    await this.cacheService.cacheSetJSON(aerobicsKey, payload, TTL_AEROBICS);
    return payload;
  }
}
