import { appConfig } from './app.config';

export const loggerConfig = {
  serviceName: process.env.LOG_SERVICE_NAME ?? 'strong-together-server',
  level: process.env.LOG_LEVEL ?? (appConfig.isProduction ? 'info' : 'debug'),
};
