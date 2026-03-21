import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { connectDB } from './config/db.ts';
import { connectRedis } from './config/redisClient.ts';
import { createIOServer } from './config/webSocket.ts';
import { botBlocker } from './middlewares/botBlocker.ts';
import { checkAppVersion } from './middlewares/checkAppVersion.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { generalLimiter } from './middlewares/rateLimiter.ts';
import aerobicsRoutes from './routes/aerobicsRoutes.ts';
import analyticsRoutes from './routes/analyticsRoutes.ts';
import authRoutes from './routes/authRoutes.ts';
import bootsrapRoutes from './routes/bootstrapRoutes.ts';
import exercisesRoutes from './routes/exercisesRoutes.ts';
import videoAnalysisRoutes from './routes/videoAnalysisRoutes.ts';
import messagesRoutes from './routes/messagesRoutes.ts';
import oauthRoutes from './routes/oauthRoutes.ts';
import pushRoutes from './routes/pushRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import webSocketsRoutes from './routes/webSocketsRoutes.ts';
import workoutRoutes from './routes/workoutRoutes.ts';
import { startVideoAnalysisSubscriber } from './subscribers/videoAnalysisSubscriber.ts';

// RESOURECES CONNECTIONS AND GENERAL CONFIGURATIONS  ------------------------------------------
dotenv.config();

// Create an express servernpm
const app = express();

// Define port
const PORT = process.env.PORT || 5000;

await connectDB(); // Connect to PostgreSQL
await connectRedis(); // Connect to Redis
await startVideoAnalysisSubscriber(); // Start subscriber

// MIDDLWARES ----------------------------------------------------------------------------------

// Use express JSON formats
app.use(express.json());

// For resetting password and API call from website
app.use(
  cors({
    origin: [
      /*"https://kobihanoch.github.io",
      "https://strongtogether-privacy.kobihanoch.com",*/
      'https://strongtogether.kobihanoch.com',
    ],
    methods: ['POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }),
);

// Use helmet
app.use(helmet());

// Trust proxy to get the request device IP for rate limiting
// IMPORTANT: Allow it only if using secured cloud services like Render, AWS, Azure, etc...
app.set('trust proxy', 1);

// Use general rate limiter
app.use(generalLimiter);

// Notify the server is running
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// API ROUTES --------------------------------------------------------------------------------------------------

app.use((req, res, next) => {
  //const clientIP = req.ip;
  const username = req.headers['x-username'] ?? null;

  console.log(
    /*`[IP: ${clientIP}]*/ `[User: ${username}] [App Version: ${req.headers['x-app-version']}] ${req.method}:${req.originalUrl}`,
  );
  next();
});

//Bot blocker
app.use(botBlocker);

// Check app version middleware
app.use(checkAppVersion);

// Users
app.use('/api/users', userRoutes);

// Auth
app.use('/api/auth', authRoutes);

// OAuth
app.use('/api/oauth', oauthRoutes);

// Workouts
app.use('/api/workouts', workoutRoutes);

// Messages
app.use('/api/messages', messagesRoutes);

// Exercises
app.use('/api/exercises', exercisesRoutes);

// Analytics
app.use('/api/analytics', analyticsRoutes);

// Aerobics
app.use('/api/aerobics', aerobicsRoutes);

// Push notifications
app.use('/api/push', pushRoutes);

// Web sockets
app.use('/api/ws', webSocketsRoutes);

// Bootstrap
app.use('/api/bootstrap', bootsrapRoutes);

// Video analysis
app.use('/api/videoanalysis', videoAnalysisRoutes);

// Error Handler
app.use(errorHandler);

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
