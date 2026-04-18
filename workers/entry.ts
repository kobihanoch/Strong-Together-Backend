import 'reflect-metadata';
import '../src/instrument';
import { NestFactory } from '@nestjs/core';
import { createLogger } from '../src/infrastructure/logger';
import { flushSentry } from '../src/infrastructure/sentry';
import { Module } from '@nestjs/common';
import { EmailsWorkerModule } from './emails/emails-worker.module';
import { PushNotificationsWorkerModule } from './push/push-notifications-worker.module';

@Module({
  imports: [EmailsWorkerModule, PushNotificationsWorkerModule],
})
export class EntryModule {}

const logger = createLogger('worker:entry');
let shuttingDown = false;

const bootstrapWorkers = async () => {
  logger.info({ event: 'worker.entry' }, 'Starting workers');

  const app = await NestFactory.createApplicationContext(EntryModule, {
    logger: false,
  });

  app.enableShutdownHooks();

  const closeWorkerResources = async (signal?: string, exitCode = 0) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.info({ event: 'worker.shutdown_started', signal }, 'Shutting down worker resources');

    try {
      await app.close();
      logger.info({ event: 'worker.shutdown_completed', signal }, 'Worker resources are closed');
    } catch (err) {
      logger.error({ err, event: 'worker.shutdown_failed', signal }, 'Worker shutdown failed');
      exitCode = 1;
    }

    await flushSentry();
    process.exit(exitCode);
  };

  process.on('unhandledRejection', async (reason, promise) => {
    logger.fatal({ event: 'worker.unhandledRejection', promise, reason }, 'Unhandled worker promise rejection');
    await closeWorkerResources('unhandledRejection', 1);
  });

  process.on('uncaughtException', async (err) => {
    logger.fatal({ err, event: 'worker.uncaughtException' }, 'Uncaught worker exception');
    await closeWorkerResources('uncaughtException', 1);
  });

  logger.info({ event: 'worker.entry' }, 'Workers are ready');

  process.once('SIGINT', () => {
    void closeWorkerResources('SIGINT');
  });

  process.once('SIGTERM', () => {
    void closeWorkerResources('SIGTERM');
  });
};

void bootstrapWorkers().catch(async (err) => {
  logger.fatal({ err, event: 'worker.bootstrap_failed' }, 'Worker bootstrap failed');
  await flushSentry();
  process.exit(1);
});
