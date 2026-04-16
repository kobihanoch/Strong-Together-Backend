import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { appConfig } from '../../../config/app.config.ts';
import { redisConfig } from '../../../config/redis.config.ts';
import { EmailPayload } from './emails.dtos.ts';

@Injectable()
export class EmailsQueueService implements OnModuleDestroy {
  public readonly queue: Queue<EmailPayload>;

  constructor() {
    let prefix;
    switch (appConfig.nodeEnv) {
      case 'development':
        prefix = 'dev';
        break;
      case 'production':
        prefix = 'prod';
        break;
      case 'test':
        prefix = 'test';
        break;
      default:
        prefix = 'unknown';
    }

    this.queue = new Bull<EmailPayload>(`${prefix}:emailsQueue`, redisConfig.url);
  }

  async onModuleDestroy() {
    await this.queue.close();
  }

  get emailsQueue() {
    return this.queue;
  }
}
