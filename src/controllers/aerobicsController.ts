import { Request, Response } from 'express';
import { addUserAerobicsRecord, getAerobicsData } from '../services/aerobicsService.ts';
import { AddUserAerobicsBody, GetUserAerobicsQuery } from './../types/api/aerobics/requests.ts';
import { UserAerobicsResponse } from './../types/api/aerobics/responses.ts';

/**
 * Get the authenticated user's aerobics history for the last 45 days.
 *
 * Returns grouped aerobics data resolved in the user's requested timezone and
 * sets the `X-Cache` response header to indicate whether the payload was served
 * from cache.
 *
 * Route: GET /api/aerobics/get
 * Access: User
 */
export const getUserAerobics = async (
  req: Request<{}, UserAerobicsResponse, {}, GetUserAerobicsQuery>,
  res: Response<UserAerobicsResponse>,
): Promise<Response<UserAerobicsResponse>> => {
  const tz = req.query.tz;
  const { payload, cacheHit } = await getAerobicsData(req.user!.id, 45, true, tz);
  res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
  return res.status(200).json(payload);
};

/**
 * Create a new aerobics tracking record for the authenticated user.
 *
 * Persists the submitted aerobics entry, refreshes the user's aerobics cache,
 * and returns the updated aerobics snapshot for the requested timezone.
 *
 * Route: POST /api/aerobics/add
 * Access: User
 */
export const addUserAerobics = async (
  req: Request<{}, UserAerobicsResponse, AddUserAerobicsBody>,
  res: Response<UserAerobicsResponse>,
): Promise<Response<UserAerobicsResponse>> => {
  const payload = await addUserAerobicsRecord(req.user!.id, req.body);
  return res.status(201).json(payload);
};
