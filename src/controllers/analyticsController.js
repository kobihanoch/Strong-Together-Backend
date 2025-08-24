import {
  queryGetWorkoutRMs,
  queryGoalAdherence,
} from "../queries/analyticsQueries.js";

// @desc    Get analytics
// @route   GET /api/analytics/get
// @access  Private
export const getAnalytics = async (req, res) => {
  const rows1 = await queryGetWorkoutRMs(req.user.id);
  const rows2 = await queryGoalAdherence(req.user.id);
  return res.status(200).json({ _1RM: rows1, goals: rows2 });
};
