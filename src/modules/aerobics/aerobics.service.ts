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
   * Adds user aerobics record.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   * @param tz - The IANA timezone used for the returned history.
   * @returns The add user aerobics record result.
   */
  async createAerobicEntryData(
    userId: string,
    body: CreateAerobicEntryBody,
    tz: string,
  ): Promise<GetAerobicHistoryResponse> {
    await this.aerobicsQueries.queryAddAerobicTracking(userId, body.record);

    const aerobicsKey = buildAerobicsKeyStable(userId, 45, tz);
    await this.cacheService.cacheDeleteOtherTimezones(aerobicsKey);
    return (await this.getAerobicsData(userId, 45, false, tz)).payload;
  }

  /**
   * Updates an owned aerobic entry and refreshes the requested cache view.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic values.
   * @param tz - The IANA timezone used for the returned history.
   * @returns The refreshed aerobic history.
   */
  async updateAerobicEntryData(
    userId: string,
    id: number,
    record: AddAerobicInputQueryDto,
    tz: string,
  ): Promise<GetAerobicHistoryResponse> {
    const updatedId = await this.aerobicsQueries.queryUpdateAerobicTracking(userId, id, record);
    if (updatedId === null) throw new NotFoundException('Aerobic entry not found');
    await this.cacheService.cacheDeleteOtherTimezones(buildAerobicsKeyStable(userId, 45, tz));
    return (await this.getAerobicsData(userId, 45, false, tz)).payload;
  }

  /**
   * Deletes an owned aerobic entry and refreshes the requested cache view.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @param tz - The IANA timezone used for the returned history.
   * @returns The refreshed aerobic history.
   */
  async deleteAerobicEntryData(userId: string, id: number, tz: string): Promise<GetAerobicHistoryResponse> {
    const deletedId = await this.aerobicsQueries.queryDeleteAerobicTracking(userId, id);
    if (deletedId === null) throw new NotFoundException('Aerobic entry not found');
    await this.cacheService.cacheDeleteOtherTimezones(buildAerobicsKeyStable(userId, 45, tz));
    return (await this.getAerobicsData(userId, 45, false, tz)).payload;
  }
}
