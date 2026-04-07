import { Queue } from 'bull';
import { createLogger } from '../../src/infrastructure/logger.ts';

const logger = createLogger('worker:shutdown');

export const setupGracefulShutdown = async (queues: Queue[]) => {
  const shutdown = async () => {
    logger.info(
      {
        event: 'worker.shutdown_started',
        queues: queues.map((queue) => queue.name),
      },
      'Gracefully shutting down worker',
    );
    for (const queue of queues) {
      await queue.close();
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown); // Ctrl+C
  process.on('SIGTERM', shutdown); // docker stop / compose down
};
