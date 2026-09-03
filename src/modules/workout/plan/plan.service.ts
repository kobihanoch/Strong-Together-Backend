import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { WorkoutPlanQueries } from './plan.queries';
import type { ReplaceWorkoutPlanBody, GetWorkoutPlanResponse } from '@strong-together/shared';

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
   * Replaces the workout plan and deletes its directly affected cache keys.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   */
  async replaceWorkoutPlanData(userId: string, body: ReplaceWorkoutPlanBody): Promise<void> {
    await this.workoutPlanQueries.queryAddWorkout(userId, body.workoutData);
    await this.deleteWorkoutPlanCaches(userId, body.tz);
  }

  /**
   * Deletes the plan, analytics, workout-history, and workout-statistics cache
   * keys directly affected by replacing a user's plan.
   * @param userId - The user identifier.
   * @param tz - The IANA time-zone name.
   */
  private async deleteWorkoutPlanCaches(userId: string, tz: string): Promise<void> {
    const planKey = buildPlanKeyStable(userId, tz);
    const analyticsKey = buildAnalyticsKeyStable(userId);
    const workoutHistoryKey = buildWorkoutHistoryKeyStable(userId, 45, tz);
    const workoutStatisticsKey = buildWorkoutStatisticsKeyStable(userId, 45, tz);
    await Promise.all([
      this.cacheService.cacheDeleteKey(analyticsKey),
      this.cacheService.cacheDeleteKey(planKey),
      this.cacheService.cacheDeleteKey(workoutHistoryKey),
      this.cacheService.cacheDeleteKey(workoutStatisticsKey),
    ]);
  }
}
