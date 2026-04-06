import createError from 'http-errors';
import {
  queryAddWorkout,
  queryGetWorkoutSplitsObj,
  queryWholeUserWorkoutPlan,
} from '../workout.plan.queries.ts';
import type { AddWorkoutBody } from '../../../types/api/workouts/requests.ts';
import type {
  AddWorkoutResponse,
  GetWholeUserWorkoutPlanResponse,
} from '../../../types/api/workouts/responses.ts';
import {
  buildAnalyticsKeyStable,
  buildPlanKeyStable,
  cacheDeleteKey,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
  TTL_PLAN,
} from '../../../utils/cache.ts';

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

export const addWorkoutData = async (userId: string, body: AddWorkoutBody): Promise<AddWorkoutResponse> => {
  const { workoutData, workoutName, tz } = body;

  await queryAddWorkout(userId, workoutData, workoutName);

  const planKey = buildPlanKeyStable(userId, tz);
  const analyticsKey = buildAnalyticsKeyStable(userId);
  await cacheDeleteKey(analyticsKey);
  await cacheDeleteKey(planKey);

  const rows = await queryWholeUserWorkoutPlan(userId, tz);
  const [plan] = rows;
  if (!plan) {
    throw createError(500, 'Workout plan was not created');
  }
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
