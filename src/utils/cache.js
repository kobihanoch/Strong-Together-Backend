// English comments only inside the code

import { redis } from "../config/redisClient.js";
import { gzipSync, gunzipSync } from "zlib";

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
    // Fetch as Buffer to support compressed payloads
    const buf = await redis.getBuffer(key);
    if (!buf) return null;

    // Detect gzip by magic bytes 0x1f 0x8b; if not, treat as UTF-8 JSON (legacy)
    const isGzip = buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b;
    const jsonStr = isGzip
      ? gunzipSync(buf).toString("utf8")
      : buf.toString("utf8");
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

// --- MINIMAL CHANGE: now always stores compressed (gzip) ---
export const cacheSetJSON = async (key, obj, ttlSec) => {
  if (!enabled || !redis) return;
  try {
    const raw = JSON.stringify(obj);
    const gz = gzipSync(raw); // Store compressed binary
    await redis.set(key, gz, { EX: ttlSec });
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
