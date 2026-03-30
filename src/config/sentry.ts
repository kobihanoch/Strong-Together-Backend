import * as Sentry from '@sentry/node';
import type { Express, Request } from 'express';

const dsn = process.env.SENTRY_DSN;
const environment = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development';
const release = process.env.SENTRY_RELEASE || process.env.npm_package_version;
const tracesSampleRate = Number(process.env.SENTRY_TRACES_SAMPLE_RATE || '0');
const profilesSampleRate = Number(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0');

let initialized = false;

const parseStatusCode = (event: Sentry.Event): number | null => {
  const statusCode = event.contexts?.response?.status_code;
  return typeof statusCode === 'number' ? statusCode : null;
};

export const isSentryEnabled = (): boolean => Boolean(dsn);

export const initSentry = (serviceName: string): void => {
  if (initialized || !dsn) {
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
  });

  initialized = true;
};

export const applySentryRequestContext = (req: Request): void => {
  if (!initialized) {
    return;
  }

  Sentry.setTag('requestId', req.requestId || 'unknown');

  if (req.user?.id) {
    Sentry.setUser({ id: req.user.id });
    Sentry.setTag('userId', req.user.id);
  }
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
