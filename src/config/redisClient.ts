// redisClient.js
import dotenv from 'dotenv';
import { createClient, RedisClientOptions } from 'redis';
import { createLogger } from './logger.ts';

dotenv.config();
const logger = createLogger('config:redis');

const redisOptions: RedisClientOptions = {
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  },
};

export const redis = createClient(redisOptions);

redis.on('error', (err) => logger.error({ err, event: 'redis.client_error' }, 'Redis client error'));

export const connectRedis = async (): Promise<void> => {
  if (!redis.isOpen) {
    await redis.connect();
  }

  const result = await redis.ping();
  logger.info({ event: 'redis.connected', ping: result }, 'Redis connected');
};

export const createRedisAdapterClients = async () => {
  const pubClient = createClient(redisOptions);
  const subClient = pubClient.duplicate();

  pubClient.on('error', (err) =>
    logger.error({ err, event: 'redis.adapter_publisher_error' }, 'Redis adapter publisher error'),
  );
  subClient.on('error', (err) =>
    logger.error({ err, event: 'redis.adapter_subscriber_error' }, 'Redis adapter subscriber error'),
  );

  await pubClient.connect();
  await subClient.connect();

  return { pubClient, subClient };
};

export const createRedisSubscriber = async () => {
  const subscriber = createClient(redisOptions);

  subscriber.on('error', (err) => {
    logger.error({ err, event: 'redis.subscriber_error' }, 'Redis subscriber error');
  });

  await subscriber.connect();
  return subscriber;
};
