import { MessagesService } from './../messages/messages.service.ts';
import { cacheGetJSON, cacheSetJSON } from '../../infrastructure/cache/redis.cache.ts';
import type { AppLogger } from '../../infrastructure/logger.ts';
import type { BootstrapResponse } from '@strong-together/shared';
import { getUserData, updateUsersReminderSettingsTimezone } from '../user/update/update.service.ts';
import { getWorkoutPlanData } from '../workout/plan/plan.service.ts';
import { getExerciseTrackingData } from '../workout/tracking/tracking.service.ts';
import { buildUserTimezoneKeyStable, TTL_TIMEZONE } from './bootstrap.cache.ts';
import { Injectable } from '@nestjs/common';
import { AerobicsService } from '../aerobics/aerobics.service.ts';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly aerobicsService: AerobicsService,
    private readonly messagesService: MessagesService,
  ) {}

  async getBootstrapDataPayload(userId: string, tz: string, requestLogger: AppLogger): Promise<BootstrapResponse> {
    const { tz: cachedTz = null } = (await cacheGetJSON<{ tz: string }>(buildUserTimezoneKeyStable(userId))) || {};

    const promises = [
      getUserData(userId),
      getWorkoutPlanData(userId, true, tz),
      getExerciseTrackingData(userId, 45, true, tz),
      this.messagesService.getAllMessagesData(userId, tz),
      this.aerobicsService.getAerobicsData(userId, 45, true, tz),
    ] as const;

    const timezoneUpdatePromise = cachedTz !== tz ? updateUsersReminderSettingsTimezone(userId, tz) : Promise.resolve();

    requestLogger.info(
      { event: 'bootstrap.timezone_resolved', userId, cachedTz, requestedTz: tz },
      'Resolved bootstrap timezone state',
    );

    const [ud, wp, et, msg, aer] = await Promise.all(promises);
    await timezoneUpdatePromise;

    await cacheSetJSON<{ tz: string }>(buildUserTimezoneKeyStable(userId), { tz }, TTL_TIMEZONE);

    return {
      user: ud.payload,
      workout: wp.payload,
      tracking: et.payload,
      aerobics: aer.payload,
      messages: msg.payload,
    };
  }
}
