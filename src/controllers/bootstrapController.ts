import { Request, Response } from "express";
import { BootstrapRequestQuery } from "../types/api/bootstrap/requests.ts";
import { BootstrapResponse } from "../types/api/bootstrap/responses.ts";
import {
  buildUserTimezoneKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_TIMEZONE,
} from "../utils/cache.js";
import { getAerobicsData } from "./aerobicsController.js";
import { getAllMessagesData } from "./messageController.js";
import {
  getUserData,
  updateUsersReminderSettingsTimezone,
} from "./userController.js";
import {
  getExerciseTrackingData,
  getWorkoutPlanData,
} from "./workoutController.js";

// @desc    Get bootstrap data (user + plan + tracking + messages + aerobics)
// @route   POST /api/bootstrap/get
// @access  Private
export const getBootstrapData = async (
  req: Request<{}, BootstrapResponse, {}, BootstrapRequestQuery>,
  res: Response<BootstrapResponse>,
): Promise<Response<BootstrapResponse>> => {
  const userId = req.user!.id;
  const tz = req.query.tz || "Asia/Jerusalem";
  const { tz: cachedTz = null } =
    (await cacheGetJSON<{ tz: string }>(buildUserTimezoneKeyStable(userId))) ||
    {};

  const promises = [
    getUserData(userId),
    getWorkoutPlanData(userId, true, tz),
    getExerciseTrackingData(userId, 45, true, tz),
    getAllMessagesData(userId, tz),
    getAerobicsData(userId, 45, true, tz),
  ] as const;

  // Check if cached timezone is sent timezone
  // If its same than skip writing in DB, else write in DB the new time zone
  const timezoneUpdatePromise =
    cachedTz !== tz
      ? updateUsersReminderSettingsTimezone(userId, tz)
      : Promise.resolve();

  console.log({ cachedTz, tz });

  // Run all in parallel using the pure helpers
  const [ud, wp, et, msg, aer] = await Promise.all(promises);
  await timezoneUpdatePromise;

  await cacheSetJSON<{ tz: string }>(
    buildUserTimezoneKeyStable(userId),
    { tz },
    TTL_TIMEZONE,
  );

  return res.status(200).json({
    user: ud.payload,
    workout: wp.payload,
    tracking: et.payload,
    aerobics: aer.payload,
    messages: msg.payload,
  });
};
