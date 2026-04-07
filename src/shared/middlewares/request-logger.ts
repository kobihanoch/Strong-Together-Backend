import { NextFunction, Request, Response } from 'express';
import { createLogger, createRequestId } from '../../infrastructure/logger.ts';
import { applySentryRequestContext } from '../../infrastructure/sentry.ts';

export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  const appLogger = createLogger('app');
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

  return next();
};
