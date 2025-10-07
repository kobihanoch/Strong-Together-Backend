import createError from "http-errors";
import {
  getWorkoutPlanData,
  getExerciseTrackingData,
} from "./workoutController.js";
import { getAllMessagesData } from "./messageController.js";
import { getAerobicsData } from "./aerobicsController.js";
import { getUserData } from "./userController.js";

// @desc    Get bootstrap data (user + plan + tracking + messages + aerobics)
// @route   POST /api/bootstrap/get
// @access  Private
export const getBootstrapData = async (req, res) => {
  const userId = req.user.id;
  const tz = req.query.tz || "Asia/Jerusalem";

  // Run all in parallel using the pure helpers
  const [ud, wp, et, msg, aer] = await Promise.all([
    getUserData(userId),
    getWorkoutPlanData(userId, true, tz),
    getExerciseTrackingData(userId, 45, true, tz),
    getAllMessagesData(userId, tz),
    getAerobicsData(userId, 45),
  ]);

  return res.status(200).json({
    user: ud.payload,
    workout: wp.payload,
    tracking: et.payload,
    aerobics: aer.payload,
    messages: msg.payload,
  });
};
