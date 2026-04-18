import './app.config';

export const redisConfig = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379),
  url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
  enableSocketAdapter: process.env.ENABLE_SOCKET_REDIS_ADAPTER === 'true',
  cacheTtls: {
    trackingSec: Number(process.env.CACHE_TTL_TRACKING_SEC ?? 48 * 60 * 60),
    timezoneSec: Number(process.env.CACHE_TTL_TIMEZONE_SEC ?? 48 * 60 * 60),
    planSec: Number(process.env.CACHE_TTL_PLAN_SEC ?? 48 * 60 * 60),
    analyticsSec: Number(process.env.CACHE_TTL_ANALYTICS_SEC ?? 60 * 60),
    aerobicsSec: Number(process.env.CACHE_TTL_AEROBICS_SEC ?? 48 * 60 * 60),
  },
};
