import {
  queryAddAerobicTracking,
  queryGetUserAerobicsForNDays,
} from "../queries/aerobicsQueries.js";
import {
  buildAerobicsKeyStable,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
  TTL_AEROBICS,
} from "../utils/cache.js";

/** Pure helper (no req/res) */
export const getAerobicsData = async (
  userId,
  days = 45,
  fromCache = true,
  tz = "Asia/Jerusalem"
) => {
  // Check for cache
  const aerobicsKey = buildAerobicsKeyStable(userId, days, tz);
  if (fromCache) {
    await cacheDeleteOtherTimezones(aerobicsKey);
    const cached = await cacheGetJSON(aerobicsKey);
    if (cached) {
      return { payload: cached, cacheHit: true };
    }
  }

  const rows = await queryGetUserAerobicsForNDays(userId, days, tz);

  // Store in cache
  await cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);

  return { payload: rows, cacheHit: false };
};

// @desc    Get aerobics for user
// @route   GET /api/aerobics/get
// @access  Private
export const getUserAerobics = async (req, res) => {
  const tz = req.query.tz;
  const { payload, cacheHit } = await getAerobicsData(
    req.user.id,
    45,
    true,
    tz
  );
  res.set("X-Cache", cacheHit ? "HIT" : "MISS");
  return res.status(200).json(payload);
};

// @desc    Add an aerobic record for user
// @route   POST /api/aerobics/add
// @access  Private
export const addUserAerobics = async (req, res) => {
  await queryAddAerobicTracking(req.user.id, req.body.record);
  const tz = req.body.tz;

  // Insert into cache
  const { payload } = await getAerobicsData(req.user.id, 45, false, tz);

  const aerobicsKey = buildAerobicsKeyStable(req.user.id, 45, tz);
  await cacheSetJSON(aerobicsKey, payload, TTL_AEROBICS);
  return res.status(201).json(payload);
};
