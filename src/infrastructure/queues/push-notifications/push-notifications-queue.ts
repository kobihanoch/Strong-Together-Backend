import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { appConfig } from '../../../config/app.config';
import { redisConfig } from '../../../config/redis.config';
import { NotificationPayload } from '../../../modules/push/push.dtos';

const getQueuePrefix = (): string => {
  switch (appConfig.nodeEnv) {
    case 'development':
      return 'dev';
    case 'production':
      return 'prod';
    case 'test':
      return 'test';
    default:
      return 'unknown';
  }
};

export const createPushNotificationsQueue = (): Queue<NotificationPayload> => {
  const prefix = getQueuePrefix();
  return new Bull<NotificationPayload>(`${prefix}:pushNotificationsQueue`, redisConfig.url);
};

@Injectable()
export class PushNotificationsQueueService implements OnModuleDestroy {
  private readonly queue: Queue<NotificationPayload>;

  constructor() {
    this.queue = createPushNotificationsQueue();
  }

  async onModuleDestroy() {
    await this.queue.close();
  }

  get pushNotificationsQueue() {
    return this.queue;
  }
}
