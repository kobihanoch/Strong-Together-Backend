import type { Request, Response } from 'express';
import {
  addWorkoutData,
  finishUserWorkoutData,
  getExerciseTrackingData,
  getWorkoutPlanData,
} from '../services/workoutService.ts';
import type {
  AddWorkoutResponse,
  FinishUserWorkoutResponse,
  GetExerciseTrackingResponse,
  GetWholeUserWorkoutPlanResponse,
} from '../types/api/workouts/responses.ts';
import {
  AddWorkoutBody,
  FinishUserWorkoutBody,
  GetExerciseTrackingQuery,
  GetWholeUserWorkoutPlanQuery,
} from '../types/api/workouts/requests.ts';

/**
 * Get the authenticated user's active workout plan.
 *
 * Returns the current workout plan and editable split structure for the
 * requested timezone, and sets `X-Cache` to reflect cache usage.
 *
 * Route: GET /api/workouts/getworkout
 * Access: User
 */
export const getWholeUserWorkoutPlan = async (
  req: Request<{}, GetWholeUserWorkoutPlanResponse, {}, GetWholeUserWorkoutPlanQuery>,
  res: Response<GetWholeUserWorkoutPlanResponse>,
): Promise<Response<GetWholeUserWorkoutPlanResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz as string;
  const { payload, cacheHit } = await getWorkoutPlanData(userId, true, tz);
  res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');
  return res.status(200).json(payload);
};

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

/**
 * Delete a workout owned by the authenticated user.
 *
 * This handler is currently a placeholder and does not perform any action.
 *
 * Route: DELETE /api/workouts/delete
 * Access: User
 */
export const deleteUserWorkout = async (req: Request, res: Response): Promise<void> => {
  return;
};

/**
 * Create or replace the authenticated user's workout plan.
 *
 * Persists the submitted workout structure, invalidates related caches,
 * rebuilds the plan snapshot, and returns the updated plan payload.
 *
 * Route: POST /api/workouts/add
 * Access: User
 */
export const addWorkout = async (
  req: Request<{}, AddWorkoutResponse, AddWorkoutBody>,
  res: Response<AddWorkoutResponse>,
): Promise<Response<AddWorkoutResponse>> => {
  const payload = await addWorkoutData(req.user!.id, req.body);
  return res.status(200).json(payload);
};
