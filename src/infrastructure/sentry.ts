import * as Sentry from '@sentry/node';
import type { Express } from 'express';
import { appConfig } from '../config/app.config.ts';
import { sentryConfig } from '../config/sentry.config.ts';
import type { AppRequest } from '../common/types/express.ts';

const dsn = sentryConfig.dsn;
const environment = sentryConfig.environment;
const release = sentryConfig.release;
const tracesSampleRate = sentryConfig.tracesSampleRate;
const profilesSampleRate = sentryConfig.profilesSampleRate;
const isTestEnv = appConfig.isTest;

let initialized = false;

const parseStatusCode = (event: Sentry.Event): number | null => {
  const statusCode = event.contexts?.response?.status_code;
  return typeof statusCode === 'number' ? statusCode : null;
};

export const isSentryEnabled = (): boolean => !isTestEnv && Boolean(dsn);

export const initSentry = (serviceName: string): void => {
  if (initialized || !isSentryEnabled()) {
    return;
  }

  Sentry.init({
    dsn,
    enabled: true,
    environment,
    release,
    tracesSampleRate,
    profilesSampleRate,
    sendDefaultPii: false,
    integrations: [Sentry.expressIntegration()],
    initialScope: {
      tags: {
        service: serviceName,
      },
    },
    beforeSend(event) {
      const statusCode = parseStatusCode(event);
      if (statusCode && statusCode < 500) {
        return null;
      }

      return event;
    },
    beforeSendTransaction(event) {
      if (event.tags?.botBlocked === 'true') {
        return null;
      }

      return event;
    },
  });

  initialized = true;
};

export const applySentryRequestContext = (req: AppRequest): void => {
  if (!initialized) {
    return;
  }

  Sentry.setTag('requestId', req.requestId || 'unknown');

  if (req.user?.id) {
    Sentry.setUser({ id: req.user.id });
    Sentry.setTag('userId', req.user.id);
  }
};

export const markSentryBotBlocked = (reason: string): void => {
  if (!initialized) {
    return;
  }

  Sentry.setTag('botBlocked', 'true');
  Sentry.setTag('botBlockedReason', reason);
};

export const setupSentryErrorHandler = (app: Express): void => {
  if (!initialized) {
    return;
  }

  Sentry.setupExpressErrorHandler(app);
};

export const captureWorkerException = (
  error: unknown,
  context: Record<string, unknown> = {},
): string | undefined => {
  if (!initialized) {
    return undefined;
  }

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

export const flushSentry = async (timeoutMs = 2000): Promise<boolean> => {
  if (!initialized) {
    return true;
  }

  return Sentry.flush(timeoutMs);
};
