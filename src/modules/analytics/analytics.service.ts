import { cacheGetJSON, cacheSetJSON } from '../../shared/cache/redis.cache.ts';
import type { GetAnalyticsResponse } from '@strong-together/shared';
import { buildAnalyticsKeyStable, TTL_ANALYTICS } from './analytics.cache.ts';
import { queryGetWorkoutRMs, queryGoalAdherence } from './analytics.queries.ts';

export const getAnalyticsData = async (
  userId: string,
): Promise<{ payload: GetAnalyticsResponse; cacheHit: boolean; analyticsKey: string }> => {
  const analyticsKey = buildAnalyticsKeyStable(userId);
  const cached = await cacheGetJSON<GetAnalyticsResponse>(analyticsKey);

  if (cached) {
    return { payload: cached, cacheHit: true, analyticsKey };
  }

  const rows1 = await queryGetWorkoutRMs(userId);
  const rows2 = await queryGoalAdherence(userId);

  const payload = {
    _1RM: rows1,
    goals: rows2,
  };

  await cacheSetJSON<GetAnalyticsResponse>(analyticsKey, payload, TTL_ANALYTICS);

  return { payload, cacheHit: false, analyticsKey };
};
