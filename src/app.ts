import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { setupSentryErrorHandler } from './infrastructure/sentry.ts';
import { botBlocker } from './common/middlewares/bot-blocker.middleware.ts';
import { checkAppVersion } from './common/middlewares/check-app-version.middleware.ts';
import { errorHandler } from './common/filters/global-exception.filter.ts';
import { generalLimiter } from './common/guards/rate-limit.guard.ts';
import { requestLogger } from './common/middlewares/request-logger.middleware.ts';
import aerobicsRoutes from './modules/aerobics/aerobics.module.ts';
import analyticsRoutes from './modules/analytics/analytics.module.ts';
import authRoutes from './modules/auth/auth.module.ts';
import bootsrapRoutes from './modules/bootstrap/bootstrap.module.ts';
import exercisesRoutes from './modules/exercises/exercises.module.ts';
import messagesRoutes from './modules/messages/messages.module.ts';
import oauthRoutes from './modules/oauth/oauth.module.ts';
import pushRoutes from './modules/push/push.module.ts';
import userRoutes from './modules/user/user.module.ts';
import videoAnalysisRoutes from './modules/video-analysis/video-analysis.module.ts';
import webSocketsRoutes from './modules/web-sockets/web-sockets.module.ts';
import workoutRoutes from './modules/workout/workout.module.ts';

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
