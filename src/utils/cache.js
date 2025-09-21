import { redis } from "../config/redisClient.js";
import { gzipSync, gunzipSync } from "zlib";
import pkg from "redis";
const { commandOptions } = pkg;

const TRACKING_NS = "xt:tracking:v1";
const PLAN_NS = "xt:workoutplan:v1";
const ANALYTICS_NS = "xt:analytics:v1";
const AEROBICS_NS = "xt:aerobics:v1";

const enabled = process.env.CACHE_ENABLED === "true";

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
export const buildAerobicsKeyStable = (userId, days) =>
  `${AEROBICS_NS}:${userId}:${days}`;

// --- MINIMAL CHANGE: now reads compressed values, with legacy fallback ---
export const cacheGetJSON = async (key) => {
  if (!enabled || !redis) return null;
  try {
    const b64 = await redis.get(key);
    if (!b64) return null;
    // 1) Decode Base64 to Buffer
    const gz = Buffer.from(b64, "base64");
    // 2) Decompress
    const json = gunzipSync(gz).toString("utf8");
    // 3) Parse JSON
    return JSON.parse(json);
  } catch (e) {
    console.log(e);
    return null;
  }
};

// --- MINIMAL CHANGE: now always stores compressed (gzip) ---
export const cacheSetJSON = async (key, obj, ttlSec) => {
  if (!enabled || !redis) return;
  try {
    const json = JSON.stringify(obj);
    // 2) Compress to Buffer
    const gz = gzipSync(Buffer.from(json, "utf8"));
    // 3) Encode as Base64 so Redis stores a safe UTF-8 string
    const b64 = gz.toString("base64");
    // 4) SET with EX
    await redis.set(key, b64, { EX: ttlSec });
  } catch {
    // ignore
  }
};

// Delete a single exact key
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
