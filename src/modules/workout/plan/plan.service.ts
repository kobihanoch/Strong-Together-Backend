import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { DBService } from '../../../infrastructure/db/db.service';
import type { ReplaceWorkoutPlanBody, GetWorkoutPlanResponse } from '@strong-together/shared';

import { buildPlanKeyStable, TTL_PLAN } from './plan.cache';
import { WorkoutPlanRepository } from './plan.repository';

@Injectable()
export class WorkoutPlanService {
  constructor(
    private readonly dbService: DBService,
    private readonly workoutPlanRepository: WorkoutPlanRepository,
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
    const cache = await this.cacheService.forUser(userId, buildPlanKeyStable(userId, tz));
    if (fromCache) {
      const cached = await cache.get<GetWorkoutPlanResponse>();
      if (cached) {
        return { payload: cached, cacheHit: true };
      }
    }

    const plan = await this.workoutPlanRepository.findActivePlanByUser(userId, tz);
    if (!plan) {
      const empty = { workoutPlan: null };
      this.dbService.afterCommit(() => cache.set(empty, TTL_PLAN));
      return { payload: empty, cacheHit: false };
    }

    const payload = { workoutPlan: plan };
    this.dbService.afterCommit(() => cache.set(payload, TTL_PLAN));
    return { payload, cacheHit: false };
  }

  /**
   * Replaces the workout plan and invalidates the user's cached data.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   */
  async replaceWorkoutPlanData(userId: string, body: ReplaceWorkoutPlanBody): Promise<void> {
    await this.workoutPlanRepository.replacePlanForUser(userId, body.workoutData);
    this.dbService.afterCommit(() => this.cacheService.invalidateUser(userId));
  }
}
