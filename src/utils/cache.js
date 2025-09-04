// English comments only inside the code

import { redis } from "../config/redisClient.js";

const TRACKING_NS = "xt:tracking:v1";
const PLAN_NS = "xt:workoutplan:v1";
const ANALYTICS_NS = "xt:analytics:v1";
const AEROBICS_NS = "xt:aerobics:v1";

const enabled = false; //process.env.CACHE_ENABLED === "true";

const numFromEnv = (name, def) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : def;
};

export const TTL_TRACKING = numFromEnv("CACHE_TTL_TRACKING_SEC", 48 * 60 * 60); // 48 Hours
export const TTL_PLAN = numFromEnv("CACHE_TTL_PLAN_SEC", 48 * 60 * 60); // 48 Hours
export const TTL_ANALYTICS = numFromEnv("CACHE_TTL_ANALYTICS_SEC", 1 * 60 * 60); // 1 Hr
export const TTL_AEROBICS = numFromEnv("CACHE_TTL_AEROBICS_SEC", 48 * 60 * 60); // 48 Hours

// Key builders
export const buildTrackingKeyStable = (userId, days) =>
  `${TRACKING_NS}:${userId}:${days}`;
export const buildPlanKeyStable = (userId) => `${PLAN_NS}:${userId}`;
export const buildAnalyticsKeyStable = (userId) => `${ANALYTICS_NS}:${userId}`;
export const buildAerobicsKeyStable = (userId) => `${ANALYTICS_NS}:${userId}`;

export const cacheGetJSON = async (key) => {
  if (!enabled || !redis) return null;
  try {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cacheSetJSON = async (key, obj, ttlSec) => {
  if (!enabled || !redis) return;
  try {
    await redis.set(key, JSON.stringify(obj), { EX: ttlSec });
  } catch {
    // ignore
  }
};

// Delete a single exact key */
export const cacheDeleteKey = async (key) => {
  if (!enabled || !redis) return;
  try {
    try {
      await redis.unlink(key); // async non-blocking delete
    } catch {
      await redis.del(key);
    }
  } catch {
    // ignore
  }
};
