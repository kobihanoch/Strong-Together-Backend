import createError from "http-errors";
import {
  getWorkoutPlanData,
  getExerciseTrackingData,
} from "./workoutController.js";
import { getAllMessagesData } from "./messageController.js";
import { getAerobicsData } from "./aerobicsController.js";
import {
  getUserData,
  updateUsersReminderSettingsTimezone,
} from "./userController.js";
import {
  buildUserTimezoneKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_TIMEZONE,
} from "../utils/cache.js";

// @desc    Get bootstrap data (user + plan + tracking + messages + aerobics)
// @route   POST /api/bootstrap/get
// @access  Private
export const getBootstrapData = async (req, res) => {
  const userId = req.user.id;
  const tz = req.query.tz || "Asia/Jerusalem";
  const { tz: cachedTz = null } =
    (await cacheGetJSON(buildUserTimezoneKeyStable(userId))) || {};

  const promises = [
    getUserData(userId),
    getWorkoutPlanData(userId, true, tz),
    getExerciseTrackingData(userId, 45, true, tz),
    getAllMessagesData(userId, tz),
    getAerobicsData(userId, 45, true, tz),
  ];

  // Check if cached timezone is sent timezone
  // If its same than skip writing in DB, else write in DB the new time zone
  if (cachedTz !== tz) {
    promises.push(updateUsersReminderSettingsTimezone(userId, tz));
  }

  console.log({ cachedTz, tz });

  // Run all in parallel using the pure helpers
  const [ud, wp, et, msg, aer] = await Promise.all(promises);

  await cacheSetJSON(buildUserTimezoneKeyStable(userId), { tz }, TTL_TIMEZONE);

  return res.status(200).json({
    user: ud.payload,
    workout: wp.payload,
    tracking: et.payload,
    aerobics: aer.payload,
    messages: msg.payload,
  });
};
