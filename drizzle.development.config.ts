import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.development' });

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error('Missing DRIZZLE_DATABASE_URL in .env.development');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    './src/infrastructure/db/schema/drizzle/schemas.ts',
    './src/infrastructure/db/schema/drizzle/roles.ts',
    './src/infrastructure/db/schema/drizzle/**/table.ts',
    './src/infrastructure/db/schema/drizzle/**/tables.ts',
    './src/infrastructure/db/schema/drizzle/**/*.view.ts',
  ],
  out: './src/infrastructure/db/schema/drizzle-migrations',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
  migrations: {
    schema: 'drizzle',
    table: '__drizzle_migrations',
  },
  strict: true,
  verbose: true,
});
