import { randomUUID } from 'node:crypto';
import pino, { type Bindings, type Logger } from 'pino';
import { appConfig } from '../config/app.config.ts';
import { loggerConfig } from '../config/logger.config.ts';

const serviceName = loggerConfig.serviceName;
const isDevelopment = !appConfig.isProduction;
const isTestEnv = appConfig.isTest;
const developmentTransport = isDevelopment
  ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      },
    }
  : {};

export const logger = pino({
  enabled: !isTestEnv,
  level: loggerConfig.level,
  timestamp: pino.stdTimeFunctions.isoTime,
  ...developmentTransport,
  base: {
    service: serviceName,
    env: appConfig.nodeEnv,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'authorization',
      'cookie',
      'token',
      'refreshToken',
      'accessToken',
      'password',
      'newPassword',
      'pushToken',
      'expoPushToken',
      'email',
      'to',
    ],
    censor: '[Redacted]',
  },
});

export const createLogger = (module: string, bindings: Bindings = {}): Logger =>
  logger.child({ module, ...bindings });

export const createRequestId = (): string => randomUUID();
