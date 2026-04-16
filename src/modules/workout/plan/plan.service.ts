import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WorkoutPlanQueries } from './plan.queries.ts';
import type { AddWorkoutBody, AddWorkoutResponse, GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';

import { buildPlanKeyStable, TTL_PLAN } from './plan.cache.ts';
import {
  cacheDeleteKey,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
} from '../../../infrastructure/cache/cache.service.ts';
import { buildAnalyticsKeyStable } from '../../analytics/analytics.cache.ts';

@Injectable()
export class WorkoutPlanService {
  constructor(private readonly workoutPlanQueries: WorkoutPlanQueries) {}

  async getWorkoutPlanData(
    userId: string,
    fromCache: boolean = true,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: GetWholeUserWorkoutPlanResponse; cacheHit: boolean }> {
    const planKey = buildPlanKeyStable(userId, tz);
    if (fromCache) {
      await cacheDeleteOtherTimezones(planKey);
      const cached = await cacheGetJSON<GetWholeUserWorkoutPlanResponse>(planKey);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const rows = await this.workoutPlanQueries.queryWholeUserWorkoutPlan(userId, tz);
    const [plan] = rows;
    if (!plan) {
      const empty = { workoutPlan: null, workoutPlanForEditWorkout: null };
      await cacheSetJSON(planKey, empty, TTL_PLAN);
      return { payload: empty, cacheHit: false };
    }

    const { splits } = await this.workoutPlanQueries.queryGetWorkoutSplitsObj(rows[0].id);
    const payload = { workoutPlan: plan, workoutPlanForEditWorkout: splits };
    await cacheSetJSON(planKey, payload, TTL_PLAN);
    return { payload, cacheHit: false };
  }

  async addWorkoutData(userId: string, body: AddWorkoutBody): Promise<AddWorkoutResponse> {
    const { workoutData, workoutName, tz } = body;

    await this.workoutPlanQueries.queryAddWorkout(userId, workoutData, workoutName);

    const planKey = buildPlanKeyStable(userId, tz);
    const analyticsKey = buildAnalyticsKeyStable(userId);
    await cacheDeleteKey(analyticsKey);
    await cacheDeleteKey(planKey);

    const rows = await this.workoutPlanQueries.queryWholeUserWorkoutPlan(userId, tz);
    const [plan] = rows;
    if (!plan) {
      throw new InternalServerErrorException('Workout plan was not created');
    }
    const { splits } = await this.workoutPlanQueries.queryGetWorkoutSplitsObj(plan.id);

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
  }
}
