import dotenv from 'dotenv';
import { connectDB } from './config/db.ts';
import { connectRedis } from './config/redisClient.ts';
import { createIOServer } from './config/webSocket.ts';
import { createApp } from './app.ts';
import { startVideoAnalysisSubscriber } from './subscribers/videoAnalysisSubscriber.ts';

// RESOURECES CONNECTIONS AND GENERAL CONFIGURATIONS  ------------------------------------------
dotenv.config();

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
  console.log(`[Web Socket]: Websocket is running on port ${PORT}`);
  console.log(`[Server]: Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'Reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.stack);
  process.exit(1);
});
