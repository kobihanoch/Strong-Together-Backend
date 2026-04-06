import { Request, Response } from 'express';
import { createLogger } from '../../config/logger.ts';
import { getAnalyticsData } from './analyticsService.ts';
import { GetAnalyticsResponse } from '../../types/api/analytics/responses.ts';

const logger = createLogger('controller:analytics');

/**
 * Get the authenticated user's analytics snapshot.
 *
 * Returns the latest analytics payload, including estimated one-rep max data
 * and goal-adherence metrics. The handler also sets the `X-Cache` response
 * header to indicate whether the payload was served from cache.
 *
 * Route: GET /api/analytics/get
 * Access: User
 */
export const getAnalytics = async (
  req: Request<{}, GetAnalyticsResponse>,
  res: Response<GetAnalyticsResponse>,
): Promise<Response<GetAnalyticsResponse>> => {
  const { payload, cacheHit, analyticsKey } = await getAnalyticsData(req.user!.id);
  if (cacheHit) {
    res.set('X-Cache', 'HIT');
    (req.logger || logger).info(
      { event: 'analytics.cache_hit', userId: req.user!.id, analyticsKey },
      'Analytics served from cache',
    );
    return res.status(200).json(payload);
  }
  res.set('X-Cache', 'MISS');
  return res.status(200).json(payload);
};
