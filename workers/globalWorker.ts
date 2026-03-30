import '../src/instrument.ts';
import { Queue } from 'bull';
import { createLogger } from '../src/config/logger.ts';
import { flushSentry } from '../src/config/sentry.ts';
import { startAnalyzVideoWorker } from './analyzeVideoWorker.js';
import { startEmailWorker } from './emailsWorker.js';
import { startPushWorker } from './pushNotificationsWorker.js';
import { setupGracefulShutdown } from './utils/setupGracefulShutdown.ts';

const logger = createLogger('worker:global');

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

export const startGlobalWorker = async () => {
  logger.info({ event: 'worker.global_starting' }, 'Starting global worker');
  const queues: Queue[] = [];

  // All worker types here
  const emailQueue = await startEmailWorker(); // Start the process returns the queue
  const pushNotificationsQueue = await startPushWorker();
  const analyzeVideoQueue = await startAnalyzVideoWorker();

  // Pushing every worker's queue to the array for future graceful shutdown
  queues.push(emailQueue);
  queues.push(pushNotificationsQueue);
  queues.push(analyzeVideoQueue);

  // Graceful shutdown
  await setupGracefulShutdown(queues);

  logger.info(
    {
      event: 'worker.global_ready',
      queues: queues.map((queue) => queue.name),
    },
    'Global worker is ready',
  );
};

await startGlobalWorker();
