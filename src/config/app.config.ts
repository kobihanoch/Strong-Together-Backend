import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${nodeEnv}` });
const port = Number(process.env.PORT ?? 5000);
const publicBaseUrl = process.env.PUBLIC_BASE_URL ?? 'http://localhost:5000';
const localEmailBaseUrl = `http://localhost:${port}`;
const productionWebBaseUrl = process.env.PUBLIC_WEB_BASE_URL ?? 'https://strongtogether.kobihanoch.com';

export const appConfig = {
  nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  port,
  minAppVersion: process.env.MIN_APP_VERSION ?? '0.0.0',
  dpopEnabled: process.env.DPOP_ENABLED === 'true',
  cacheEnabled: process.env.CACHE_ENABLED === 'true',
  publicBaseUrl,
  emailApiBaseUrl: nodeEnv === 'production' ? publicBaseUrl : localEmailBaseUrl,
  emailWebBaseUrl: nodeEnv === 'production' ? productionWebBaseUrl : localEmailBaseUrl,
  publicBaseUrlRenderDefault: process.env.PUBLIC_BASE_URL_RENDER_DEFAULT,
  privateBaseUrlDev: process.env.PRIVATE_BASE_URL_DEV,
  systemUserId: process.env.SYSTEM_USER_ID as string,
};
