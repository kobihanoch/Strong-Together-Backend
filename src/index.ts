import './instrument.ts';
import { connectDB } from './infrastructure/db.client.ts';
import { createLogger } from './infrastructure/logger.ts';
import { flushSentry } from './infrastructure/sentry.ts';
import { connectRedis } from './infrastructure/redis.client.ts';
import { createIOServer } from './infrastructure/socket.io.ts';
import { createApp } from './app.ts';
import { appConfig } from './config/app.config.ts';
import { startVideoAnalysisSubscriber } from './modules/video-analysis/video-analysis-subscriber.ts';

// RESOURECES CONNECTIONS AND GENERAL CONFIGURATIONS  ------------------------------------------
const logger = createLogger('bootstrap');

const app = createApp();

// Define port
const PORT = appConfig.port;

await connectDB(); // Connect to PostgreSQL
await connectRedis(); // Connect to Redis
await startVideoAnalysisSubscriber(); // Start subscriber

// SOCKET CONNECTIONS ---------------------------------------------------------------------------------------------
const { server } = await createIOServer(app);

// LISTEN TO PORT ------------------------------------------------------------------------------------------------
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
