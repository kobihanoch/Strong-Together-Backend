import { createNestApp } from './app';
import { appConfig } from './config/app.config';
import { createLogger } from './infrastructure/logger';
import { flushSentry } from './infrastructure/sentry';
import './instrument';

const logger = createLogger('bootstrap');
const PORT = appConfig.port;

logger.info({ event: 'server.bootstrap_started', env: appConfig.nodeEnv }, 'Starting HTTP bootstrap');

let shuttingDown = false;

const bootstrap = async () => {
  const app = await createNestApp();
  logger.info({ event: 'server.nest_created' }, 'Nest application created');
  app.enableShutdownHooks();

  logger.info({ event: 'server.listen_starting', port: PORT }, 'Starting HTTP listener');
  await app.listen(PORT, () => {
    logger.info({ event: 'server.started', port: PORT }, 'HTTP server is running');
  });

  const closeApiResources = async (signal?: string, exitCode = 0) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.info({ event: 'process.shutdown_started', signal }, 'Shutting down API resources');

    try {
      await app.close();
      logger.info({ event: 'process.shutdown_completed', signal }, 'API resources are closed');
    } catch (err) {
      logger.error({ err, event: 'process.shutdown_failed', signal }, 'API shutdown failed');
      exitCode = 1;
    }

    await flushSentry();
    process.exit(exitCode);
  };

  process.once('SIGINT', () => {
    void closeApiResources('SIGINT');
  });

  process.once('SIGTERM', () => {
    void closeApiResources('SIGTERM');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({ event: 'process.unhandledRejection', promise, reason }, 'Unhandled promise rejection');
    void closeApiResources('unhandledRejection', 1);
  });

  process.on('uncaughtException', (err) => {
    logger.fatal({ err, event: 'process.uncaughtException' }, 'Uncaught exception');
    void closeApiResources('uncaughtException', 1);
  });
};

void bootstrap().catch(async (err) => {
  logger.fatal({ err, event: 'server.bootstrap_failed' }, 'HTTP bootstrap failed');
  await flushSentry();
  process.exit(1);
});
