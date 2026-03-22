import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { botBlocker } from './middlewares/botBlocker.ts';
import { checkAppVersion } from './middlewares/checkAppVersion.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { generalLimiter } from './middlewares/rateLimiter.ts';
import aerobicsRoutes from './routes/aerobicsRoutes.ts';
import analyticsRoutes from './routes/analyticsRoutes.ts';
import authRoutes from './routes/authRoutes.ts';
import bootsrapRoutes from './routes/bootstrapRoutes.ts';
import exercisesRoutes from './routes/exercisesRoutes.ts';
import messagesRoutes from './routes/messagesRoutes.ts';
import oauthRoutes from './routes/oauthRoutes.ts';
import pushRoutes from './routes/pushRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import videoAnalysisRoutes from './routes/videoAnalysisRoutes.ts';
import webSocketsRoutes from './routes/webSocketsRoutes.ts';
import workoutRoutes from './routes/workoutRoutes.ts';

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

  app.use((req, res, next) => {
    const username = req.headers['x-username'] ?? null;

    console.log(
      `[User: ${username}] [App Version: ${req.headers['x-app-version']}] ${req.method}:${req.originalUrl}`,
    );
    next();
  });

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

  app.use(errorHandler);

  return app;
};
