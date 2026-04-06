import createError from 'http-errors';
import {
  queryAddWorkout,
  queryGetExerciseTrackingAndStats,
  queryGetWorkoutSplitsObj,
  queryInsertUserFinishedWorkout,
  queryWholeUserWorkoutPlan,
} from '../queries/workoutQueries.js';
import { sendSystemMessageToUserWorkoutDone } from '../services/messagesService.ts';
import type { AddWorkoutBody, FinishUserWorkoutBody } from '../types/api/workouts/requests.ts';
import type {
  AddWorkoutResponse,
  FinishUserWorkoutResponse,
  GetWholeUserWorkoutPlanResponse,
} from '../types/api/workouts/responses.ts';
import type { ExerciseTrackingAndStats } from '../types/dto/exerciseTracking.dto.ts';
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
} from '../utils/cache.ts';

export const getWorkoutPlanData = async (
  userId: string,
  fromCache: boolean = true,
  tz: string = 'Asia/Jerusalem',
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
    const empty = { workoutPlan: null, workoutPlanForEditWorkout: null };
    await cacheSetJSON(planKey, empty, TTL_PLAN);
    return { payload: empty, cacheHit: false };
  }

  const { splits } = await queryGetWorkoutSplitsObj(rows[0].id);
  const payload = { workoutPlan: plan, workoutPlanForEditWorkout: splits };
  await cacheSetJSON(planKey, payload, TTL_PLAN);
  return { payload, cacheHit: false };
};

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

export const finishUserWorkoutData = async (
  userId: string,
  body: FinishUserWorkoutBody,
): Promise<FinishUserWorkoutResponse> => {
  const workoutArray = body.workout;
  const tz = body.tz || 'Asia/Jerusalem';
  const workoutStartUtc = body.workout_start_utc || null;
  const workoutEndUtc = body.workout_end_utc || null;

  if (!Array.isArray(workoutArray) || workoutArray.length === 0) {
    throw createError(400, 'Not a valid workout');
  }

  await queryInsertUserFinishedWorkout(userId, workoutArray, workoutStartUtc, workoutEndUtc);

  const { payload } = await getExerciseTrackingData(userId, 45, false, tz);
  await cacheSetJSON(buildTrackingKeyStable(userId, 45, tz), payload, TTL_TRACKING);

  sendSystemMessageToUserWorkoutDone(userId);
  return payload;
};

export const addWorkoutData = async (userId: string, body: AddWorkoutBody): Promise<AddWorkoutResponse> => {
  const { workoutData, workoutName, tz } = body;

  await queryAddWorkout(userId, workoutData, workoutName);

  const planKey = buildPlanKeyStable(userId, tz);
  const analyticsKey = buildAnalyticsKeyStable(userId);
  await cacheDeleteKey(analyticsKey);
  await cacheDeleteKey(planKey);

  const rows = await queryWholeUserWorkoutPlan(userId, tz);
  const [plan] = rows;
  const { splits } = await queryGetWorkoutSplitsObj(plan.id);

  const payload = {
    message: 'Workout created successfully!',
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

  return payload;
};
