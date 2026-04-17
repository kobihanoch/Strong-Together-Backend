import 'reflect-metadata';
import '../src/instrument.ts';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '../src/infrastructure/logger.ts';
import { flushSentry } from '../src/infrastructure/sentry.ts';
import { Module } from '@nestjs/common';
import { EmailsWorkerModule } from './emails/emails-worker.module.ts';
import { PushNotificationsWorkerModule } from './push/push-notifications-worker.module.ts';

@Module({
  imports: [EmailsWorkerModule, PushNotificationsWorkerModule],
})
export class EntryModule {}

const logger = createLogger('worker:entry');

process.on('unhandledRejection', async (reason, promise) => {
  logger.fatal({ event: 'worker.unhandledRejection', promise, reason }, 'Unhandled worker promise rejection');
  await flushSentry();
  process.exit(1);
});

process.on('uncaughtException', async (err) => {
  logger.fatal({ err, event: 'worker.uncaughtException' }, 'Uncaught worker exception');
  await flushSentry();
  process.exit(1);
});

logger.info({ event: 'worker.entry' }, 'Starting workers');

const app = await NestFactory.createApplicationContext(EntryModule, {
  logger: false,
});

app.enableShutdownHooks();

logger.info({ event: 'worker.entry' }, 'Workers are ready');
