import { Inject, Injectable, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { createLogger } from '../logger.ts';
import { REDIS_CLIENT, REDIS_SUBSCRIBER, SOCKET_ADAPTER_CLIENTS } from './redis.tokens.ts';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private logger = createLogger('config:redis');

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    @Inject(REDIS_SUBSCRIBER) private readonly redisSubscriber: RedisClientType,
    @Optional()
    @Inject(SOCKET_ADAPTER_CLIENTS)
    public readonly socketAdapter: { pubClient: RedisClientType; subClient: RedisClientType } | null,
  ) {
    this.setupErrorHandlers();
  }

  async onModuleInit() {
    try {
      const result = await this.redisClient.ping();
      this.logger.info({ event: 'redis.connected', ping: result }, 'Redis is ready and responding');
    } catch (err) {
      this.logger.error({ err }, 'Redis ping failed during initialization');
    }
  }

  async onModuleDestroy() {
    this.logger.info('Closing all Redis connections...');
    const clients = [this.redisClient, this.redisSubscriber];

    if (this.socketAdapter) {
      clients.push(this.socketAdapter.pubClient, this.socketAdapter.subClient);
    }

    await Promise.all(clients.map((c) => c.quit().catch(() => {})));
    this.logger.info('All connections closed');
  }

  async pingClient(): Promise<void> {
    const result = await this.redisClient.ping();
    this.logger.info({ event: 'redis.connected', ping: result }, 'Redis connected');
  }

  private setupErrorHandlers() {
    this.redisClient.on('error', (err) => this.logger.error({ err }, 'Redis Client Error'));
    this.redisSubscriber.on('error', (err) => this.logger.error({ err }, 'Redis Subscriber Error'));

    if (this.socketAdapter) {
      this.socketAdapter.pubClient.on('error', (err) => this.logger.error({ err }, 'Adapter Pub Error'));
      this.socketAdapter.subClient.on('error', (err) => this.logger.error({ err }, 'Adapter Sub Error'));
    }
  }
}
