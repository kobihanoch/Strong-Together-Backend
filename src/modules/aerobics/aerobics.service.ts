import { Injectable, NotFoundException } from '@nestjs/common';
import { AerobicsQueries } from './aerobics.queries';
import type { AddAerobicInputQueryDto, CreateAerobicEntryBody, GetAerobicHistoryResponse } from '@strong-together/shared';
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
  ): Promise<{ payload: GetAerobicHistoryResponse; cacheHit: boolean }> {
    const aerobicsKey = buildAerobicsKeyStable(userId, days, tz);

    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(aerobicsKey);
      const cached = await this.cacheService.cacheGetJSON<GetAerobicHistoryResponse>(aerobicsKey);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const rows = await this.aerobicsQueries.queryGetUserAerobicsForNDays(userId, days, tz);
    await this.cacheService.cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);

    return { payload: rows, cacheHit: false };
  }

  /**
   * Adds an aerobic record and deletes its exact 45-day cache key.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   * @param tz - The IANA timezone identifying the affected cache key.
   */
  async createAerobicEntryData(userId: string, body: CreateAerobicEntryBody, tz: string): Promise<void> {
    await this.aerobicsQueries.queryAddAerobicTracking(userId, body.record);

    const aerobicsKey = buildAerobicsKeyStable(userId, 45, tz);
    await this.cacheService.cacheDeleteKey(aerobicsKey);
  }

  /**
   * Updates an owned aerobic entry and deletes its exact 45-day cache key.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic values.
   * @param tz - The IANA timezone identifying the affected cache key.
   */
  async updateAerobicEntryData(userId: string, id: number, record: AddAerobicInputQueryDto, tz: string): Promise<void> {
    const updatedId = await this.aerobicsQueries.queryUpdateAerobicTracking(userId, id, record);
    if (updatedId === null) throw new NotFoundException('Aerobic entry not found');
    await this.cacheService.cacheDeleteKey(buildAerobicsKeyStable(userId, 45, tz));
  }

  /**
   * Deletes an owned aerobic entry and deletes its exact 45-day cache key.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @param tz - The IANA timezone identifying the affected cache key.
   */
  async deleteAerobicEntryData(userId: string, id: number, tz: string): Promise<void> {
    const deletedId = await this.aerobicsQueries.queryDeleteAerobicTracking(userId, id);
    if (deletedId === null) throw new NotFoundException('Aerobic entry not found');
    await this.cacheService.cacheDeleteKey(buildAerobicsKeyStable(userId, 45, tz));
  }
}
