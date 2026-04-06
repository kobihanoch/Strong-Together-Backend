import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { setupSentryErrorHandler } from './config/sentry.ts';
import { botBlocker } from './middlewares/botBlocker.ts';
import { checkAppVersion } from './middlewares/checkAppVersion.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { generalLimiter } from './middlewares/rateLimiter.ts';
import { requestLogger } from './middlewares/requestLogger.ts';
import aerobicsRoutes from './features/aerobics/aerobicsRoutes.ts';
import analyticsRoutes from './features/analytics/analyticsRoutes.ts';
import authRoutes from './features/auth/authRoutes.ts';
import bootsrapRoutes from './features/bootstrap/bootstrapRoutes.ts';
import exercisesRoutes from './features/exercises/exercisesRoutes.ts';
import messagesRoutes from './features/messages/messagesRoutes.ts';
import oauthRoutes from './features/oauth/oauthRoutes.ts';
import pushRoutes from './features/push/pushRoutes.ts';
import userRoutes from './features/user/userRoutes.ts';
import videoAnalysisRoutes from './features/videoAnalysis/videoAnalysisRoutes.ts';
import webSocketsRoutes from './features/webSockets/webSocketsRoutes.ts';
import workoutRoutes from './features/workout/workoutRoutes.ts';

export const createApp = () => {
  const app = express();

  app.use(express.json());

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

  app.use(helmet());
  app.set('trust proxy', 1);
  app.use(generalLimiter);

  app.get('/', (req, res) => {
    res.send('Server is running...');
  });

  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  app.use(requestLogger);
  app.use(botBlocker);
  app.use(checkAppVersion);

  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/oauth', oauthRoutes);
  app.use('/api/workouts', workoutRoutes);
  app.use('/api/messages', messagesRoutes);
  app.use('/api/exercises', exercisesRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/aerobics', aerobicsRoutes);
  app.use('/api/push', pushRoutes);
  app.use('/api/ws', webSocketsRoutes);
  app.use('/api/bootstrap', bootsrapRoutes);
  app.use('/api/videoanalysis', videoAnalysisRoutes);

  setupSentryErrorHandler(app);
  app.use(errorHandler);

  return app;
};
