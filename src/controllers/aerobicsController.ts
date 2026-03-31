import { Request, Response } from 'express';
import { queryAddAerobicTracking, queryGetUserAerobicsForNDays } from '../queries/aerobicsQueries.ts';
import {
  buildAerobicsKeyStable,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
  TTL_AEROBICS,
} from '../utils/cache.ts';
import { AddUserAerobicsBody, GetUserAerobicsQuery } from './../types/api/aerobics/requests.ts';
import { UserAerobicsResponse } from './../types/api/aerobics/responses.ts';

/** Pure helper (no req/res) */
export const getAerobicsData = async (
  userId: string,
  days: number = 45,
  fromCache: boolean = true,
  tz: string = 'Asia/Jerusalem',
): Promise<{ payload: UserAerobicsResponse; cacheHit: boolean }> => {
  // Check for cache
  const aerobicsKey = buildAerobicsKeyStable(userId, days, tz);
  if (fromCache) {
    await cacheDeleteOtherTimezones(aerobicsKey);
    const cached = await cacheGetJSON(aerobicsKey);
    if (cached) {
      return { payload: cached, cacheHit: true };
    }
  }

  const rows = await queryGetUserAerobicsForNDays(userId, days, tz);

  // Store in cache
  await cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);

  return { payload: rows, cacheHit: false };
};

// @desc    Get aerobics for user
// @route   GET /api/aerobics/get
// @access  Private
export const getUserAerobics = async (
  req: Request<{}, UserAerobicsResponse, {}, GetUserAerobicsQuery>,
  res: Response<UserAerobicsResponse>,
): Promise<Response<UserAerobicsResponse>> => {
  const tz = req.query.tz;
  const { payload, cacheHit } = await getAerobicsData(req.user!.id, 45, true, tz);
  res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
  return res.status(200).json(payload);
};

// @desc    Add an aerobic record for user
// @route   POST /api/aerobics/add
// @access  Private
export const addUserAerobics = async (
  req: Request<{}, UserAerobicsResponse, AddUserAerobicsBody>,
  res: Response<UserAerobicsResponse>,
): Promise<Response<UserAerobicsResponse>> => {
  await queryAddAerobicTracking(req.user!.id, req.body.record);
  const tz = req.body.tz;

  // Insert into cache
  const { payload } = await getAerobicsData(req.user!.id, 45, false, tz);

  const aerobicsKey = buildAerobicsKeyStable(req.user!.id, 45, tz);
  await cacheSetJSON(aerobicsKey, payload, TTL_AEROBICS);
  return res.status(201).json(payload);
};
