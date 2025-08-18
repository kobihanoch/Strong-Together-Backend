import { redis } from "../config/redisClient.js";

const TRACKING_NS = "xt:maps:v1";
const PLAN_NS = "xt:plan:v1";
const USER_VER_NS = "xt:userver";

const enabled = process.env.CACHE_ENABLED === "true";

const numFromEnv = (name, def) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : def;
};

export const TTL_TRACKING = numFromEnv("CACHE_TTL_TRACKING_SEC", 48 * 60 * 60); // 48 Hours
export const TTL_PLAN = numFromEnv("CACHE_TTL_PLAN_SEC", 48 * 60 * 60); // 48 Hours

export const buildTrackingKey = (userId, version, days) =>
  `${TRACKING_NS}:${userId}:v${version}:${days}`;

export const buildPlanKey = (userId, version) =>
  `${PLAN_NS}:${userId}:v${version}`;

export const getUserVersion = async (userId) => {
  if (!enabled || !redis) return 1;
  try {
    const key = `${USER_VER_NS}:${userId}`;
    const v = await redis.get(key);
    if (!v) {
      await redis.set(key, "1");
      return 1;
    }
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : 1;
  } catch {
    return 1; // fail-open
  }
};

export const bumpUserVersion = async (userId) => {
  if (!enabled || !redis) return;
  try {
    await redis.incr(`${USER_VER_NS}:${userId}`);
  } catch {
    // ignore
  }
};

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
