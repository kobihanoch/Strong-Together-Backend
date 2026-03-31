import Bull, { Queue } from 'bull';
import { NotificationPayload } from '../../types/dto/notifications.dto.ts';

declare global {
  var pushNotificationsQueue: Queue<NotificationPayload> | undefined;
}

let pushNotificationsQueue = globalThis.pushNotificationsQueue || null;

let prefix;
switch (process.env.NODE_ENV) {
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
    process.env.REDIS_URL || '',
  );
  globalThis.pushNotificationsQueue = pushNotificationsQueue;
}

export default pushNotificationsQueue as Queue<NotificationPayload>;
