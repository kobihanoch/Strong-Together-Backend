import Bull, { Queue } from 'bull';
import { appConfig } from '../../../config/app.config.ts';
import { redisConfig } from '../../../config/redis.config.ts';
import { NotificationPayload } from '../../types/dto/notifications.dto.ts';

declare global {
  var pushNotificationsQueue: Queue<NotificationPayload> | undefined;
}

let pushNotificationsQueue = globalThis.pushNotificationsQueue || null;

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

if (!pushNotificationsQueue) {
  pushNotificationsQueue = new Bull<NotificationPayload>(
    `${prefix}:pushNotificationsQueue`,
    redisConfig.url,
  );
  globalThis.pushNotificationsQueue = pushNotificationsQueue;
}

export default pushNotificationsQueue as Queue<NotificationPayload>;
