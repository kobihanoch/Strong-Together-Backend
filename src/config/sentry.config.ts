import { appConfig } from './app.config.ts';

export const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? appConfig.nodeEnv,
  release: process.env.SENTRY_RELEASE ?? process.env.npm_package_version ?? '0.0.0',
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0),
  profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? 0),
};
