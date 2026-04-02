import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createLogger, createRequestId } from './config/logger.ts';
import { applySentryRequestContext, setupSentryErrorHandler } from './config/sentry.ts';
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
  const appLogger = createLogger('app');

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
    const startedAt = process.hrtime.bigint();
    const requestId = req.headers['x-request-id']?.toString() || createRequestId();
    const appVersion = req.headers['x-app-version']?.toString() || null;
    const username = req.headers['x-username']?.toString() || null;

    req.requestId = requestId;
    req.logger = appLogger.child({
      requestId,
      method: req.method,
      path: req.originalUrl,
      appVersion,
      username,
    });

    res.setHeader('x-request-id', requestId);
    applySentryRequestContext(req);

    req.logger.info({ event: 'request.received' }, 'request started');

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const logPayload = {
        event: 'request.completed',
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        userId: req.user?.id,
      };

      if (res.statusCode >= 500) {
        req.logger?.error(logPayload, 'request completed with server error');
        return;
      }

      if (res.statusCode >= 400) {
        req.logger?.warn(logPayload, 'request completed with client error');
        return;
      }

      req.logger?.info(logPayload, 'request completed');
    });

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

  setupSentryErrorHandler(app);
  app.use(errorHandler);

  return app;
};
