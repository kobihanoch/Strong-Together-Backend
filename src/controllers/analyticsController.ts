import { Request, Response } from 'express';
import { createLogger } from '../config/logger.ts';
import { queryGetWorkoutRMs, queryGoalAdherence } from '../queries/analyticsQueries.ts';
import { GetAnalyticsResponse } from '../types/api/analytics/responses.ts';
import {
  buildAnalyticsKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_ANALYTICS,
} from '../utils/cache.ts';

const logger = createLogger('controller:analytics');

// @desc    Get analytics
// @route   GET /api/analytics/get
// @access  Private
export const getAnalytics = async (
  req: Request<{}, GetAnalyticsResponse>,
  res: Response<GetAnalyticsResponse>,
): Promise<Response<GetAnalyticsResponse>> => {
  const analyticsKey = buildAnalyticsKeyStable(req.user!.id);
  const cached = await cacheGetJSON<GetAnalyticsResponse>(analyticsKey);
  if (cached) {
    res.set('X-Cache', 'HIT');
    (req.logger || logger).info(
      { event: 'analytics.cache_hit', userId: req.user!.id, analyticsKey },
      'Analytics served from cache',
    );
    return res.status(200).json(cached);
  }
  res.set('X-Cache', 'MISS');

  const rows1 = await queryGetWorkoutRMs(req.user!.id);
  const rows2 = await queryGoalAdherence(req.user!.id);

  await cacheSetJSON<GetAnalyticsResponse>(
    analyticsKey,
    {
      _1RM: rows1,
      goals: rows2,
    },
    TTL_ANALYTICS,
  );

  return res.status(200).json({ _1RM: rows1, goals: rows2 });
};
