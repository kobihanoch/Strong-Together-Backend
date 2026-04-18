// infrastructure/redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { createClient, RedisClientOptions } from 'redis';
import { redisConfig } from '../../config/redis.config';
import { RedisService } from './redis.service';
import { REDIS_CLIENT, REDIS_OPTIONS, REDIS_SUBSCRIBER, SOCKET_ADAPTER_CLIENTS } from './redis.tokens';

@Global()
@Module({
  providers: [
    // Redis options injection
    {
      provide: REDIS_OPTIONS,
      useValue: {
        ...(redisConfig.username ? { username: redisConfig.username } : {}),
        ...(redisConfig.password ? { password: redisConfig.password } : {}),
        socket: {
          host: redisConfig.host,
          port: redisConfig.port,
        },
      },
    },
    // Redis client injection
    {
      provide: REDIS_CLIENT,
      useFactory: async (options: RedisClientOptions) => {
        const client = createClient(options);
        return client;
      },
      inject: [REDIS_OPTIONS],
    },
    // Redis subscribers injection
    {
      provide: REDIS_SUBSCRIBER,
      useFactory: async (options: RedisClientOptions) => {
        const sub = createClient(options);
        return sub;
      },
      inject: [REDIS_OPTIONS],
    },
    // Socket adapter clients injection
    {
      provide: SOCKET_ADAPTER_CLIENTS,
      useFactory: async (options: RedisClientOptions) => {
        if (!redisConfig.enableSocketAdapter) return null;

        const pubClient = createClient(options);
        const subClient = pubClient.duplicate();

        return { pubClient, subClient };
      },
      inject: [REDIS_OPTIONS],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, REDIS_SUBSCRIBER, SOCKET_ADAPTER_CLIENTS, RedisService],
})
export class RedisModule {}
