import type { Request, Response } from 'express';
import { finishUserWorkoutData, getExerciseTrackingData } from './tracking.service.ts';
import type { FinishUserWorkoutResponse, GetExerciseTrackingResponse } from '../../../types/api/workouts/responses.ts';
import { FinishUserWorkoutBody, GetExerciseTrackingQuery } from '../../../types/api/workouts/requests.ts';

/**
 * Get the authenticated user's recent exercise tracking history.
 *
 * Returns tracking analytics and grouped tracking maps for the last 45 days in
 * the requested timezone, and sets `X-Cache` to reflect cache usage.
 *
 * Route: GET /api/workouts/gettracking
 * Access: User
 */
export const getExerciseTracking = async (
  req: Request<{}, GetExerciseTrackingResponse, {}, GetExerciseTrackingQuery>,
  res: Response<GetExerciseTrackingResponse>,
): Promise<Response<GetExerciseTrackingResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz as string;

  const { payload, cacheHit } = await getExerciseTrackingData(userId, 45, true, tz);
  res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
  return res.status(200).json(payload);
};

/**
 * Persist a completed workout for the authenticated user.
 *
 * Stores the submitted workout summary and tracking rows, refreshes tracking
 * cache state, and returns the updated tracking payload.
 *
 * Route: POST /api/workouts/finishworkout
 * Access: User
 */
export const finishUserWorkout = async (
  req: Request<{}, FinishUserWorkoutResponse, FinishUserWorkoutBody>,
  res: Response<FinishUserWorkoutResponse>,
): Promise<Response<FinishUserWorkoutResponse>> => {
  const payload = await finishUserWorkoutData(req.user!.id, req.body);
  return res.status(200).json(payload);
};
