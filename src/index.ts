import { createNestApp } from './app.ts';
import { appConfig } from './config/app.config.ts';
import { connectDB } from './infrastructure/db.client.ts';
import { createLogger } from './infrastructure/logger.ts';
import { connectRedis } from './infrastructure/redis.client.ts';
import { flushSentry } from './infrastructure/sentry.ts';
import { createIOServer } from './infrastructure/socket.io.ts';
import './instrument.ts';

const logger = createLogger('bootstrap');
const PORT = appConfig.port;

await connectDB(); // Connect to PostgreSQL
await connectRedis(); // Connect to Redis

const app = await createNestApp();
await app.init();

const { server } = await createIOServer(app.getHttpServer());

server.listen(PORT, () => {
  logger.info({ event: 'websocket.started', port: PORT }, 'WebSocket server is running');
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
