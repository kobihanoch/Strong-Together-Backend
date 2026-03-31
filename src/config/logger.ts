import { randomUUID } from 'node:crypto';
import pino, { type Bindings, type Logger } from 'pino';

const serviceName = process.env.LOG_SERVICE_NAME || 'strong-together-server';
const isDevelopment = process.env.NODE_ENV !== 'production';
const isTestEnv = process.env.NODE_ENV === 'test';
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
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  timestamp: pino.stdTimeFunctions.isoTime,
  ...developmentTransport,
  base: {
    service: serviceName,
    env: process.env.NODE_ENV || 'development',
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
