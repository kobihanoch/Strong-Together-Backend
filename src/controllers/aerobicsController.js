import {
  queryAddAerobicTracking,
  queryGetUserAerobicsForNDays,
} from "../queries/aerobicsQueries.js";
import {
  buildAerobicsKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  TTL_AEROBICS,
} from "../utils/cache.js";

// @desc    Get aerobics for user
// @route   GET /api/aerobics/get
// @access  Private
export const getUserAerobics = async (req, res) => {
  const userId = req.user.id;

  // Check for cache
  const aerobicsKey = buildAerobicsKeyStable(userId, 45);
  const cached = await cacheGetJSON(aerobicsKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.status(200).json(cached);
  }

  const [rows] = await queryGetUserAerobicsForNDays(userId, 45);

  // Store in cache
  await cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);

  res.set("X-Cache", "MISS");
  return res.status(200).json(rows);
};

// @desc    Add an aerobic record for user
// @route   POST /api/aerobics/add
// @access  Private
export const addUserAerobics = async (req, res) => {
  await queryAddAerobicTracking(req.user.id, req.body.record);

  // Insert into cache
  const [rows] = queryGetUserAerobicsForNDays(req.user.id, 45);
  const aerobicsKey = buildAerobicsKeyStable(req.user.id, 45);
  await cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);
  return res.status(201).end();
};
