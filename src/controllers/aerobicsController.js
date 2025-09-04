import { queryGetUserAerobicsForNDays } from "../queries/aerobicsQueries.js";
import {
  buildAnalyticsKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_ANALYTICS,
} from "../utils/cache.js";

// @desc    Get aerobics for user
// @route   GET /api/aerobics/get
// @access  Private
export const getUserAerobics = async (req, res) => {
  const userId = req.user.id;
  const [rows] = await queryGetUserAerobicsForNDays(userId, 45);
  return res.status(200).json(rows);
};
