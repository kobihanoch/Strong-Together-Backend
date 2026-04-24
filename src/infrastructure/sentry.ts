import * as Sentry from '@sentry/node';
import type { Express } from 'express';
import type { AppRequest } from '../common/types/express';

export const applySentryRequestContext = (req: AppRequest): void => {
  Sentry.setTag('requestId', req.requestId || 'unknown');

  if (req.user?.id) {
    Sentry.setUser({ id: req.user.id });
    Sentry.setTag('userId', req.user.id);
  }
};

export const markSentryBotBlocked = (reason: string): void => {
  Sentry.setTag('botBlocked', 'true');
  Sentry.setTag('botBlockedReason', reason);
};

export const setupSentryErrorHandler = (app: Express): void => {
  Sentry.setupExpressErrorHandler(app);
};

export const captureWorkerException = (error: unknown, context: Record<string, unknown> = {}): string | undefined => {
  return Sentry.withScope((scope) => {
    for (const [key, value] of Object.entries(context)) {
      if (value === undefined || value === null) continue;

      if (key === 'userId') {
        scope.setUser({ id: String(value) });
        continue;
      }

      scope.setTag(key, String(value));
      scope.setExtra(key, value);
    }

    return Sentry.captureException(error);
  });
};

export const captureHttpException = (
  error: unknown,
  req: AppRequest,
  statusCode: number,
  message: string,
): string | undefined => {
  return Sentry.withScope((scope) => {
    scope.setTag('requestId', req.requestId || 'unknown');
    scope.setTag('statusCode', String(statusCode));
    scope.setTag('method', req.method);
    scope.setTag('path', req.originalUrl || req.url || 'unknown');
    scope.setExtra('statusCode', statusCode);
    scope.setExtra('message', message);

    if (req.user?.id) {
      scope.setUser({ id: req.user.id });
      scope.setTag('userId', req.user.id);
    }

    return Sentry.captureException(error);
  });
};

export const flushSentry = async (timeoutMs = 2000): Promise<boolean> => {
  return Sentry.flush(timeoutMs);
};
