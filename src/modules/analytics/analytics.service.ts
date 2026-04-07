import { queryGetWorkoutRMs, queryGoalAdherence } from './analytics.queries.ts';
import type { GetAnalyticsResponse } from '../../shared/types/api/analytics/responses.ts';
import { buildAnalyticsKeyStable, cacheGetJSON, cacheSetJSON, TTL_ANALYTICS } from '../../shared/utils/cache.ts';

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
