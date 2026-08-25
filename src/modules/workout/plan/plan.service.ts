import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { WorkoutPlanQueries } from './plan.queries';
import type {
  AddWorkoutBody,
  AddWorkoutResponse,
  GetWholeUserWorkoutPlanResponse,
} from '@strong-together/shared';

import { buildPlanKeyStable, TTL_PLAN } from './plan.cache';
import { buildAnalyticsKeyStable } from '../../analytics/analytics.cache';
import { buildTrackingMapsKeyStable, buildTrackingStatsKeyStable } from '../tracking/tracking.cache';

@Injectable()
export class WorkoutPlanService {
  constructor(
    private readonly workoutPlanQueries: WorkoutPlanQueries,
    private readonly cacheService: CacheService,
  ) {}

  async getWorkoutPlanData(
    userId: string,
    fromCache: boolean = true,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: GetWholeUserWorkoutPlanResponse; cacheHit: boolean }> {
    const planKey = buildPlanKeyStable(userId, tz);
    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(planKey);
      const cached = await this.cacheService.cacheGetJSON<GetWholeUserWorkoutPlanResponse>(planKey);
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const rows = await this.workoutPlanQueries.queryWholeUserWorkoutPlan(userId, tz);
    const [plan] = rows;
    if (!plan) {
      const empty = { workoutPlan: null };
      await this.cacheService.cacheSetJSON(planKey, empty, TTL_PLAN);
      return { payload: empty, cacheHit: false };
    }

    const payload = { workoutPlan: plan };
    await this.cacheService.cacheSetJSON(planKey, payload, TTL_PLAN);
    return { payload, cacheHit: false };
  }

  async addWorkoutData(userId: string, body: AddWorkoutBody): Promise<AddWorkoutResponse> {
    await this.workoutPlanQueries.queryAddWorkout(userId, body.workoutData);
    return this.refreshWorkoutPlan(userId, body.tz);
  }

  private async refreshWorkoutPlan(
    userId: string,
    tz: string,
  ): Promise<AddWorkoutResponse> {
    const planKey = buildPlanKeyStable(userId, tz);
    const analyticsKey = buildAnalyticsKeyStable(userId);
    const trackingMapsKey = buildTrackingMapsKeyStable(userId, 45, tz);
    const trackingStatsKey = buildTrackingStatsKeyStable(userId, 45, tz);
    await Promise.all([
      this.cacheService.cacheDeleteOtherTimezones(trackingMapsKey),
      this.cacheService.cacheDeleteOtherTimezones(trackingStatsKey),
    ]);
    await this.cacheService.cacheDeleteKey(analyticsKey);
    await this.cacheService.cacheDeleteKey(planKey);
    await this.cacheService.cacheDeleteKey(trackingMapsKey);
    await this.cacheService.cacheDeleteKey(trackingStatsKey);

    const rows = await this.workoutPlanQueries.queryWholeUserWorkoutPlan(userId, tz);
    const [plan] = rows;
    if (!plan) {
      throw new InternalServerErrorException('Workout plan was not created');
    }
    const payload = {
      message: 'Workout created successfully!',
      workoutPlan: plan,
    };

    await this.cacheService.cacheSetJSON(
      buildPlanKeyStable(userId, tz),
      {
        workoutPlan: plan,
      },
      TTL_PLAN,
    );

    return payload;
  }
}
