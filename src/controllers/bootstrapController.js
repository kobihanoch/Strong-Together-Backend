import createError from "http-errors";
import {
  getWorkoutPlanData,
  getExerciseTrackingData,
} from "./workoutController.js";
import { getAllMessagesData } from "./messageController.js";
import { getAerobicsData } from "./aerobicsController.js";

// @desc    Get bootstrap data (plan + tracking + messages + aerobics)
// @route   POST /api/bootstrap/get
// @access  Private
export const getBootstrapData = async (req, res) => {
  const userId = req.user.id;

  // Run all in parallel using the pure helpers
  const [wp, et, msg, aer] = await Promise.all([
    getWorkoutPlanData(userId),
    getExerciseTrackingData(userId, 45),
    getAllMessagesData(userId),
    getAerobicsData(userId, 45),
  ]);

  return res.status(200).json({
    workout: wp.payload,
    tracking: et.payload,
    aerobics: aer.payload,
    messages: msg.payload,
  });
};
