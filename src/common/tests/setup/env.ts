import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
process.env.NODE_ENV = 'test';
process.env.CRON_JWT_SECRET ??= 'test-cron-jwt-secret';
