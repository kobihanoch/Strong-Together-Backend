// redisClient.js
import dotenv from 'dotenv';
import { createClient, RedisClientOptions } from 'redis';

dotenv.config();

const redisOptions: RedisClientOptions = {
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  },
};

export const redis = createClient(redisOptions);

redis.on('error', (err) => console.error('[Redis]: Redis Client Error', err));

export const connectRedis = async (): Promise<void> => {
  if (!redis.isOpen) {
    await redis.connect();
  }

  const result = await redis.ping();
  console.log('[Redis]: Redis Connected -', result);
};

export const createRedisAdapterClients = async () => {
  const pubClient = createClient(redisOptions);
  const subClient = pubClient.duplicate();

  pubClient.on('error', (err) => console.error('[Redis Adapter]: Publisher error', err));
  subClient.on('error', (err) => console.error('[Redis Adapter]: Subscriber error', err));

  await pubClient.connect();
  await subClient.connect();

  return { pubClient, subClient };
};

export const createRedisSubscriber = async () => {
  const subscriber = createClient(redisOptions);

  subscriber.on('error', (err) => {
    console.error('[Redis Subscriber]: Error', err);
  });

  await subscriber.connect();
  return subscriber;
};
