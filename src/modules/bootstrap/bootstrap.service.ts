import type { BootstrapResponse } from '../../types/api/bootstrap/responses.ts';
import { buildUserTimezoneKeyStable, cacheGetJSON, cacheSetJSON, TTL_TIMEZONE } from '../../utils/cache.ts';
import { getAerobicsData } from '../aerobics/aerobics.service.ts';
import { getAllMessagesData } from '../messages/messages.service.ts';
import { getUserData, updateUsersReminderSettingsTimezone } from '../user/update/user.update.service.ts';
import { getWorkoutPlanData } from '../workout/plan/workout.plan.service.ts';
import { getExerciseTrackingData } from '../workout/tracking/workout.tracking.service.ts';

export const getBootstrapDataPayload = async (
  userId: string,
  tz: string,
  requestLogger: { info: (...args: any[]) => void },
): Promise<BootstrapResponse> => {
  const { tz: cachedTz = null } = (await cacheGetJSON<{ tz: string }>(buildUserTimezoneKeyStable(userId))) || {};

  const promises = [
    getUserData(userId),
    getWorkoutPlanData(userId, true, tz),
    getExerciseTrackingData(userId, 45, true, tz),
    getAllMessagesData(userId, tz),
    getAerobicsData(userId, 45, true, tz),
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
};
