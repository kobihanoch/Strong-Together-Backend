import Bull, { Queue } from 'bull';
import { appConfig } from '../../../config/app.config.ts';
import { redisConfig } from '../../../config/redis.config.ts';
import { EmailPayload } from '../../types/dto/emails.dto.ts';

declare global {
  var emailsQueue: Queue<EmailPayload> | undefined;
}

let emailsQueue = globalThis.emailsQueue || null;

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

if (!emailsQueue) {
  emailsQueue = new Bull<EmailPayload>(`${prefix}:emailsQueue`, redisConfig.url);
  globalThis.emailsQueue = emailsQueue;
}

export default emailsQueue as Queue<EmailPayload>;
