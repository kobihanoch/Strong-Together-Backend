import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { WorkoutPlanQueries } from './plan.queries';
import type {
  ReplaceWorkoutPlanBody,
  ReplaceWorkoutPlanResponse,
  GetWorkoutPlanResponse,
} from '@strong-together/shared';

import { buildPlanKeyStable, TTL_PLAN } from './plan.cache';
import { buildAnalyticsKeyStable } from '../../analytics/analytics.cache';
import { buildWorkoutHistoryKeyStable, buildWorkoutStatisticsKeyStable } from '../tracking/tracking.cache';

@Injectable()
export class WorkoutPlanService {
  constructor(
    private readonly workoutPlanQueries: WorkoutPlanQueries,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Retrieves workout plan.
   * @param userId - The user identifier.
   * @param fromCache - The from cache.
   * @param tz - The IANA time-zone name.
   * @returns The workout plan result.
   */
  async getWorkoutPlanData(
    userId: string,
    fromCache: boolean = true,
    tz: string = 'Asia/Jerusalem',
  ): Promise<{ payload: GetWorkoutPlanResponse; cacheHit: boolean }> {
    const planKey = buildPlanKeyStable(userId, tz);
    if (fromCache) {
      await this.cacheService.cacheDeleteOtherTimezones(planKey);
      const cached = await this.cacheService.cacheGetJSON<GetWorkoutPlanResponse>(planKey);
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

  /**
   * Adds workout.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   * @returns The add workout result.
   */
  async replaceWorkoutPlanData(userId: string, body: ReplaceWorkoutPlanBody): Promise<ReplaceWorkoutPlanResponse> {
    await this.workoutPlanQueries.queryAddWorkout(userId, body.workoutData);
    return this.refreshWorkoutPlan(userId, body.tz);
  }

  /**
   * Refreshes the cached workout plan for a user.
   * @param userId - The user identifier.
   * @param tz - The IANA time-zone name.
   * @returns The refresh workout plan result.
   */
  private async refreshWorkoutPlan(
    userId: string,
    tz: string,
  ): Promise<ReplaceWorkoutPlanResponse> {
    const planKey = buildPlanKeyStable(userId, tz);
    const analyticsKey = buildAnalyticsKeyStable(userId);
    const workoutHistoryKey = buildWorkoutHistoryKeyStable(userId, 45, tz);
    const workoutStatisticsKey = buildWorkoutStatisticsKeyStable(userId, 45, tz);
    await Promise.all([
      this.cacheService.cacheDeleteOtherTimezones(workoutHistoryKey),
      this.cacheService.cacheDeleteOtherTimezones(workoutStatisticsKey),
    ]);
    await this.cacheService.cacheDeleteKey(analyticsKey);
    await this.cacheService.cacheDeleteKey(planKey);
    await this.cacheService.cacheDeleteKey(workoutHistoryKey);
    await this.cacheService.cacheDeleteKey(workoutStatisticsKey);

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
