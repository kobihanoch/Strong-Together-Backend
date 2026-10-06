import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.staging' });

if (!process.env.STAGING_DATABASE_URL) throw new Error('Missing STAGING_DATABASE_URL in .env.staging');

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    './src/infrastructure/persistence/schema/drizzle/schemas.ts',
    './src/infrastructure/persistence/schema/drizzle/roles.ts',
    './src/infrastructure/persistence/schema/drizzle/**/table.ts',
    './src/infrastructure/persistence/schema/drizzle/**/*.view.ts',
  ],
  out: './src/infrastructure/persistence/schema/migrations',
  dbCredentials: { url: process.env.STAGING_DATABASE_URL },
  migrations: { schema: 'drizzle', table: '__drizzle_migrations' },
  strict: true,
  verbose: true,
});
