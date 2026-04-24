import * as Sentry from '@sentry/node';
import { sentryConfig } from './config/sentry.config';
import { appConfig } from './config/app.config';

const dsn = sentryConfig.dsn;
const environment = sentryConfig.environment;
const release = sentryConfig.release;
const tracesSampleRate = sentryConfig.tracesSampleRate;
const profilesSampleRate = sentryConfig.profilesSampleRate;
const isTestEnv = appConfig.isTest;

const parseStatusCode = (event: Sentry.Event): number | null => {
  const statusCode = event.contexts?.response?.status_code;
  return typeof statusCode === 'number' ? statusCode : null;
};

export const isSentryEnabled = (): boolean => !isTestEnv && Boolean(dsn);

if (isSentryEnabled()) {
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
        service: 'strong-together-server',
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
}
