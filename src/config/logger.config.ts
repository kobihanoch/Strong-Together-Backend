import { appConfig } from './app.config.ts';

export const loggerConfig = {
  serviceName: process.env.LOG_SERVICE_NAME ?? 'strong-together-server',
  level: process.env.LOG_LEVEL ?? (appConfig.isProduction ? 'info' : 'debug'),
};
