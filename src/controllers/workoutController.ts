import type { Request, Response } from "express";
import createError from "http-errors";
import {
  queryAddWorkout,
  queryGetExerciseTrackingAndStats,
  queryGetWorkoutSplitsObj,
  queryInsertUserFinishedWorkout,
  queryWholeUserWorkoutPlan,
} from "../queries/workoutQueries.js";
import { sendSystemMessageToUserWorkoutDone } from "../services/messagesService.ts";
import {
  buildAnalyticsKeyStable,
  buildPlanKeyStable,
  buildTrackingKeyStable,
  cacheDeleteKey,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
  TTL_PLAN,
  TTL_TRACKING,
} from "../utils/cache.ts";
import type {
  AddWorkoutRequestBody,
  FinishUserWorkoutRequestBody,
} from "../types/api/workouts/requests.ts";
import type {
  GetExerciseTrackingResponse,
  GetWholeUserWorkoutPlanResponse,
  AddWorkoutResponse,
  FinishUserWorkoutResponse,
} from "../types/api/workouts/responses.ts";
import type {
  GetExerciseTrackingQuery,
  GetWholeUserWorkoutPlanQuery,
} from "../types/api/workouts/queries.ts";
import type { ExerciseTrackingAndStats } from "../types/dto/exerciseTracking.dto.ts";

/** ---------------------------
 * Pure helpers (no req/res)
 * ---------------------------*/

// Returns { payload, cacheHit }
export const getWorkoutPlanData = async (
  userId: string,
  fromCache: boolean = true,
  tz: string = "Asia/Jerusalem",
): Promise<{ payload: GetWholeUserWorkoutPlanResponse; cacheHit: boolean }> => {
  const planKey = buildPlanKeyStable(userId, tz);
  if (fromCache) {
    await cacheDeleteOtherTimezones(planKey);
    const cached = await cacheGetJSON<GetWholeUserWorkoutPlanResponse>(planKey);
    if (cached) {
      return { payload: cached, cacheHit: true };
    }
  }

  const rows = await queryWholeUserWorkoutPlan(userId, tz);
  const [plan] = rows;
  if (!plan) {
    const empty = { workoutPlan: null };
    await cacheSetJSON(planKey, empty, TTL_PLAN);
    return { payload: empty, cacheHit: false };
  }

  const { splits } = await queryGetWorkoutSplitsObj(rows[0].id);
  const payload = { workoutPlan: plan, workoutPlanForEditWorkout: splits };
  await cacheSetJSON(planKey, payload, TTL_PLAN);
  return { payload, cacheHit: false };
};

// Returns { payload, cacheHit }
export const getExerciseTrackingData = async (
  userId: string,
  days: number = 45,
  fromCache: boolean = true,
  tz: string,
): Promise<{ payload: ExerciseTrackingAndStats; cacheHit: boolean }> => {
  const key = buildTrackingKeyStable(userId, days, tz);
  if (fromCache) {
    await cacheDeleteOtherTimezones(key);
    const cached = await cacheGetJSON(key);
    if (cached) {
      return { payload: cached, cacheHit: true };
    }
  }

  const data = await queryGetExerciseTrackingAndStats(userId, days, tz);
  const payload = data;
  await cacheSetJSON(key, payload, TTL_TRACKING);
  return { payload, cacheHit: false };
};

/** ---------------------------
 * Express handlers (use helpers)
 * ---------------------------*/

// @desc    Get authenticated user workout (plan, splits, and exercises)
// @route   GET /api/workouts/getworkout
// @access  Private
export const getWholeUserWorkoutPlan = async (
  req: Request<
    {},
    GetWholeUserWorkoutPlanResponse,
    {},
    GetWholeUserWorkoutPlanQuery
  >,
  res: Response<GetWholeUserWorkoutPlanResponse>,
): Promise<Response<GetWholeUserWorkoutPlanResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz as string;
  const { payload, cacheHit } = await getWorkoutPlanData(userId, true, tz);
  res.set("X-Cache", cacheHit ? "HIT" : "MISS");
  return res.status(200).json(payload);
};

// @desc    Get authenticated user exercise tracking (Past 45 days only)
// @route   GET /api/workouts/gettracking
// @access  Private
export const getExerciseTracking = async (
  req: Request<{}, GetExerciseTrackingResponse, {}, GetExerciseTrackingQuery>,
  res: Response<GetExerciseTrackingResponse>,
): Promise<Response<GetExerciseTrackingResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz as string;

  const { payload, cacheHit } = await getExerciseTrackingData(
    userId,
    45,
    true,
    tz,
  );
  res.set("X-Cache", cacheHit ? "HIT" : "MISS");
  return res.status(200).json(payload);
};

// @desc    Finish user workout
// @route   POST /api/workouts/finishworkout
// @access  Private
export const finishUserWorkout = async (
  req: Request<{}, FinishUserWorkoutResponse, FinishUserWorkoutRequestBody>,
  res: Response<FinishUserWorkoutResponse>,
): Promise<Response<FinishUserWorkoutResponse>> => {
  const workoutArray = req.body.workout;
  const tz = req.body.tz || "Asia/Jerusalem";
  const workoutStartUtc = req.body.workout_start_utc || null;
  const workoutEndUtc = req.body.workout_end_utc || null;

  if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
    throw createError(400, "Not a valid workout");
  }

  const userId = req.user!.id;

  const startIso = workoutStartUtc;
  const endIso = workoutEndUtc;

  await queryInsertUserFinishedWorkout(userId, workoutArray, startIso, endIso);

  // refresh tracking cache
  const { payload } = await getExerciseTrackingData(userId, 45, false, tz);
  await cacheSetJSON(
    buildTrackingKeyStable(userId, 45, tz),
    payload,
    TTL_TRACKING,
  );

  sendSystemMessageToUserWorkoutDone(userId);
  return res.status(200).json(payload);
};

// @desc    Delete user's workout
// @route   DELETE /api/workouts/delete
// @access  Private
export const deleteUserWorkout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  /*await queryDeleteUserWorkout(userId);

  const planKey = buildPlanKeyStable(userId, tz);
  const analyticsKey = buildAnalyticsKeyStable(userId);
  await cacheDeleteKey(analyticsKey);
  await cacheDeleteKey(planKey);

  return res.status(204).end();*/
};

// @desc    Add workout
// @route   POST /api/workouts/add
// @access  Private
export const addWorkout = async (
  req: Request<{}, AddWorkoutResponse, AddWorkoutRequestBody>,
  res: Response<AddWorkoutResponse>,
): Promise<Response<AddWorkoutResponse>> => {
  const userId = req.user!.id;
  const { workoutData, workoutName, tz } = req.body;

  await queryAddWorkout(userId, workoutData, workoutName);

  const planKey = buildPlanKeyStable(userId, tz);
  const analyticsKey = buildAnalyticsKeyStable(userId);
  await cacheDeleteKey(analyticsKey);
  await cacheDeleteKey(planKey);

  // Rebuild plan and cache
  const rows = await queryWholeUserWorkoutPlan(userId, tz);
  const [plan] = rows;
  const { splits } = await queryGetWorkoutSplitsObj(plan.id);

  const payload = {
    message: "Workout created successfully!",
    workoutPlan: plan,
    workoutPlanForEditWorkout: splits,
  };

  await cacheSetJSON(
    buildPlanKeyStable(userId, tz),
    {
      workoutPlan: plan,
      workoutPlanForEditWorkout: splits,
    },
    TTL_PLAN,
  );

  return res.status(200).json(payload);
};
