import pkg from "redis";
import { gunzipSync, gzipSync } from "zlib";
import { redis } from "../config/redisClient.js";
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
export const buildTrackingKeyStable = (userId, days, tz) =>
  `${TRACKING_NS}:${userId}:${days}:${tz}`;
export const buildPlanKeyStable = (userId, tz) => `${PLAN_NS}:${userId}:${tz}`;
export const buildAnalyticsKeyStable = (userId) => `${ANALYTICS_NS}:${userId}`;
export const buildAerobicsKeyStable = (userId, days, tz) =>
  `${AEROBICS_NS}:${userId}:${days}:${tz}`;

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

// Delets other timezone key
export const cacheDeleteOtherTimezones = async (currentKey) => {
  if (!enabled || !redis || !currentKey) return;

  // --- helpers ---
  // Normalize to string and trim invisible characters
  const normalizeKey = (k) =>
    String(k)
      .normalize("NFC")
      .replace(/[\u200E\u200F\uFEFF]/g, "")
      .replace(/\0/g, "")
      .trim();

  const curr = normalizeKey(currentKey);
  const lastColon = curr.lastIndexOf(":");
  if (lastColon === -1) return; // not a base:tz structure

  const base = curr.slice(0, lastColon);
  const tzToKeep = curr.slice(lastColon + 1);
  const pattern = `${base}:*`;

  // IANA-like tz (e.g., "Asia/Jerusalem", "America/New_York")
  const looksLikeTz = (s) =>
    /^[A-Za-z]+(?:[_-][A-Za-z]+)*(?:\/[A-Za-z]+(?:[_-][A-Za-z]+)*)+$/.test(s);

  const buf = [];

  // Some clients yield a string per iteration; others yield an array (chunk).
  for await (const chunk of redis.scanIterator({
    MATCH: pattern,
    COUNT: 1000,
  })) {
    const keys = Array.isArray(chunk) ? chunk : [chunk];

    for (const rawKey of keys) {
      const k = normalizeKey(rawKey);

      // Never delete the exact current key
      if (k === curr) continue;

      // Only direct siblings: base:<suffix> (no extra colons)
      if (!k.startsWith(base + ":")) continue;
      const tail = k.slice(base.length + 1);
      if (tail.includes(":")) continue;

      // Only keys that look like tz
      if (!looksLikeTz(tail)) continue;

      // Never delete the same tz suffix
      if (tail === tzToKeep) continue;

      // Push the raw key (as string) to the deletion buffer
      buf.push(String(rawKey));

      if (buf.length >= 500) {
        try {
          await redis.unlink(...buf);
        } catch {
          await redis.del(...buf);
        }
        buf.length = 0;
      }
    }
  }
  if (buf.length) {
    try {
      await redis.unlink(...buf);
    } catch {
      await redis.del(...buf);
    }
  }
};

export const cacheStoreJti = async (prefix, jti, ttlSec) => {
  if (!enabled || !redis) return false;

  const key = `${prefix}:jti:${jti}`;
  const res = await redis.set(key, "1", { NX: true, EX: ttlSec });

  // Redis returns truthy on success (usually 'OK'), null otherwise
  return !!res;
};
