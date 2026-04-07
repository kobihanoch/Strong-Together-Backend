import Bull, { Queue } from 'bull';
import { EmailPayload } from '../../types/dto/emails.dto.ts';

declare global {
  var emailsQueue: Queue<EmailPayload> | undefined;
}

let emailsQueue = globalThis.emailsQueue || null;

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

if (!emailsQueue) {
  emailsQueue = new Bull<EmailPayload>(`${prefix}:emailsQueue`, process.env.REDIS_URL || '');
  globalThis.emailsQueue = emailsQueue;
}

export default emailsQueue as Queue<EmailPayload>;
