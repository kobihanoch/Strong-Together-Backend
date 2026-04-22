import { MessagesService } from './../messages/messages.service';
import { CacheService } from '../../infrastructure/cache/cache.service';
import type { AppLogger } from '../../infrastructure/logger';
import type { BootstrapResponse } from '@strong-together/shared';
import { buildUserTimezoneKeyStable, TTL_TIMEZONE } from './bootstrap.cache';
import { Injectable } from '@nestjs/common';
import { AerobicsService } from '../aerobics/aerobics.service';
import { UpdateUserService } from '../user/update/update.service';
import { WorkoutPlanService } from '../workout/plan/plan.service';
import { WorkoutTrackingService } from '../workout/tracking/tracking.service';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly aerobicsService: AerobicsService,
    private readonly cacheService: CacheService,
    private readonly messagesService: MessagesService,
    private readonly updateUserService: UpdateUserService,
    private readonly workoutPlanService: WorkoutPlanService,
    private readonly workoutTrackingService: WorkoutTrackingService,
  ) {}

  async getBootstrapDataPayload(userId: string, tz: string, requestLogger: AppLogger): Promise<BootstrapResponse> {
    const { tz: cachedTz = null } =
      (await this.cacheService.cacheGetJSON<{ tz: string }>(buildUserTimezoneKeyStable(userId))) || {};

    const promises = [
      this.updateUserService.getUserData(userId),
      this.workoutPlanService.getWorkoutPlanData(userId, true, tz),
      this.workoutTrackingService.getExerciseTrackingData(userId, 45, true, tz),
      this.messagesService.getAllMessagesData(userId, tz),
      this.aerobicsService.getAerobicsData(userId, 45, true, tz),
    ] as const;

    const timezoneUpdatePromise =
      cachedTz !== tz ? this.updateUserService.updateUsersReminderSettingsTimezone(userId, tz) : Promise.resolve();

    requestLogger.info(
      { event: 'bootstrap.timezone_resolved', userId, cachedTz, requestedTz: tz },
      'Resolved bootstrap timezone state',
    );

    const [ud, wp, et, msg, aer] = await Promise.all(promises);
    await timezoneUpdatePromise;

    await this.cacheService.cacheSetJSON<{ tz: string }>(buildUserTimezoneKeyStable(userId), { tz }, TTL_TIMEZONE);

    return {
      user: ud.payload,
      workout: wp.payload,
      tracking: et.payload,
      aerobics: aer.payload,
      messages: msg.payload,
    };
  }
}
