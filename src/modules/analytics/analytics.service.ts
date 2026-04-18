import { Injectable } from '@nestjs/common';
import type { GetAnalyticsResponse } from '@strong-together/shared';
import { CacheService } from '../../infrastructure/cache/cache.service';
import { buildAnalyticsKeyStable, TTL_ANALYTICS } from './analytics.cache';
import { AnalyticsQueries } from './analytics.queries';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly analyticsQueries: AnalyticsQueries,
    private readonly cacheService: CacheService,
  ) {}

  async getAnalyticsData(
    userId: string,
  ): Promise<{ payload: GetAnalyticsResponse; cacheHit: boolean; analyticsKey: string }> {
    const analyticsKey = buildAnalyticsKeyStable(userId);
    const cached = await this.cacheService.cacheGetJSON<GetAnalyticsResponse>(analyticsKey);

    if (cached) {
      return { payload: cached, cacheHit: true, analyticsKey };
    }

    const rows1 = await this.analyticsQueries.queryGetWorkoutRMs(userId);
    const rows2 = await this.analyticsQueries.queryGoalAdherence(userId);

    const payload = {
      _1RM: rows1,
      goals: rows2,
    };

    await this.cacheService.cacheSetJSON<GetAnalyticsResponse>(analyticsKey, payload, TTL_ANALYTICS);

    return { payload, cacheHit: false, analyticsKey };
  }
}
