import { Inject, Injectable, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { createLogger } from '../logger';
import { REDIS_CLIENT, REDIS_SUBSCRIBER, SOCKET_ADAPTER_CLIENTS } from './redis.tokens';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private logger = createLogger('config:redis');
  private clientsUp = 0;

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
    await this.connectAllCLients();
  }

  async onModuleDestroy() {
    this.logger.info('Closing all Redis connections...');
    const clients = [this.redisClient, this.redisSubscriber];

    if (this.socketAdapter) {
      clients.push(this.socketAdapter.pubClient, this.socketAdapter.subClient);
    }

    await Promise.all(clients.map((c) => c.quit()));
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

  private async connectAllCLients() {
    try {
      this.logger.info('Attempting to connect redis client...');
      await this.redisClient.connect();
      this.clientsUp++;
      this.logger.info('Redis client connected successfully!');

      this.logger.info('Attempting to connect redis subscriber client...');
      await this.redisSubscriber.connect();
      this.clientsUp++;
      this.logger.info('Redis subscriber client connected successfully!');

      if (this.socketAdapter) {
        this.logger.info('Attempting to connect redis adatper clients...');
        await Promise.all([this.socketAdapter.pubClient.connect(), this.socketAdapter.subClient.connect()]);
        this.clientsUp += 2;
        this.logger.info('Redis adapter clients connected successfully!');
      }

      const connections = await this.getRedisConnections();
      await this.redisClient.ping();

      this.logger.info('Redis clients connected: [' + connections + ' connections] [' + this.clientsUp + ' Clients]');
    } catch (e) {
      this.logger.error({ e }, 'Redis connection error');
      throw e;
    }
  }

  private async getRedisConnections() {
    const info = await this.redisClient.info('clients');
    const match = info.match(/connected_clients:(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
