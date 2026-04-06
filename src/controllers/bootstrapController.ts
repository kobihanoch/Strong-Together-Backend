import { Request, Response } from 'express';
import { createLogger } from '../config/logger.ts';
import { BootstrapRequestQuery } from '../types/api/bootstrap/requests.ts';
import { BootstrapResponse } from '../types/api/bootstrap/responses.ts';
import {
  buildUserTimezoneKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_TIMEZONE,
} from '../utils/cache.js';
import { getAerobicsData } from '../services/aerobicsService.ts';
import { getAllMessagesData } from './messageController.js';
import { getUserData, updateUsersReminderSettingsTimezone } from './userController.js';
import { getExerciseTrackingData, getWorkoutPlanData } from './workoutController.js';

const logger = createLogger('controller:bootstrap');

// @desc    Get bootstrap data (user + plan + tracking + messages + aerobics)
// @route   POST /api/bootstrap/get
// @access  Private
export const getBootstrapData = async (
  req: Request<{}, BootstrapResponse, {}, BootstrapRequestQuery>,
  res: Response<BootstrapResponse>,
): Promise<Response<BootstrapResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz || 'Asia/Jerusalem';
  const requestLogger = req.logger || logger;
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

  return res.status(200).json({
    user: ud.payload,
    workout: wp.payload,
    tracking: et.payload,
    aerobics: aer.payload,
    messages: msg.payload,
  });
};
