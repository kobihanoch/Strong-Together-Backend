import { createNestApp } from './app.ts';
import { appConfig } from './config/app.config.ts';
import { createLogger } from './infrastructure/logger.ts';
import { flushSentry } from './infrastructure/sentry.ts';
import './instrument.ts';

const logger = createLogger('bootstrap');
const PORT = appConfig.port;

const app = await createNestApp();

app.listen(PORT, () => {
  logger.info({ event: 'server.started', port: PORT }, 'HTTP server is running');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ event: 'process.unhandledRejection', promise, reason }, 'Unhandled promise rejection');
  void flushSentry().finally(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err, event: 'process.uncaughtException' }, 'Uncaught exception');
  void flushSentry().finally(() => process.exit(1));
});
