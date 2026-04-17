import { createNestApp } from './app.ts';
import { appConfig } from './config/app.config.ts';
import { createLogger } from './infrastructure/logger.ts';
import { flushSentry } from './infrastructure/sentry.ts';
import './instrument.ts';

const logger = createLogger('bootstrap');
const PORT = appConfig.port;

logger.info({ event: 'server.bootstrap_started', env: appConfig.nodeEnv }, 'Starting HTTP bootstrap');

const app = await createNestApp();
logger.info({ event: 'server.nest_created' }, 'Nest application created');
app.enableShutdownHooks();

logger.info({ event: 'server.listen_starting', port: PORT }, 'Starting HTTP listener');
await app.listen(PORT, () => {
  logger.info({ event: 'server.started', port: PORT }, 'HTTP server is running');
});

let shuttingDown = false;

const closeApiResources = async (signal?: string, exitCode = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  logger.info({ event: 'process.shutdown_started', signal }, 'Shutting down API resources');

  await app.close();

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
