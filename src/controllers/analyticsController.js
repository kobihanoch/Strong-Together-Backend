import {
  queryGetWorkoutRMs,
  queryGoalAdherence,
} from "../queries/analyticsQueries.js";
import {
  buildAnalyticsKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_ANALYTICS,
} from "../utils/cache.js";

// @desc    Get analytics
// @route   GET /api/analytics/get
// @access  Private
export const getAnalytics = async (req, res) => {
  const analyticsKey = buildAnalyticsKeyStable(req.user.id);
  const cached = await cacheGetJSON(analyticsKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.status(200).json(cached);
  }
  res.set("X-Cache", "MISS");

  const rows1 = await queryGetWorkoutRMs(req.user.id);
  const rows2 = await queryGoalAdherence(req.user.id);

  await cacheSetJSON(
    analyticsKey,
    { _1RM: rows1, goals: rows2 },
    TTL_ANALYTICS
  );

  return res.status(200).json({ _1RM: rows1, goals: rows2 });
};
