import './instrument.ts';
import dotenv from 'dotenv';
import { connectDB } from './config/db.ts';
import { createLogger } from './config/logger.ts';
import { flushSentry } from './config/sentry.ts';
import { connectRedis } from './config/redisClient.ts';
import { createIOServer } from './config/webSocket.ts';
import { createApp } from './app.ts';
import { startVideoAnalysisSubscriber } from './subscribers/videoAnalysisSubscriber.ts';

// RESOURECES CONNECTIONS AND GENERAL CONFIGURATIONS  ------------------------------------------
dotenv.config();
const logger = createLogger('bootstrap');

const app = createApp();

// Define port
const PORT = process.env.PORT || 5000;

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
