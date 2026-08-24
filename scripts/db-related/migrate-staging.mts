import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

dotenv.config({ path: '.env.staging' });

const databaseUrl = process.env.STAGING_DATABASE_URL;
if (!databaseUrl) throw new Error('Missing STAGING_DATABASE_URL in .env.staging');

const client = postgres(databaseUrl, {
  max: 1,
  prepare: false,
  connect_timeout: 30,
});

try {
  await migrate(drizzle(client), {
    migrationsFolder: 'src/infrastructure/db/schema/drizzle-migrations',
    migrationsSchema: 'drizzle',
    migrationsTable: '__drizzle_migrations',
  });
  console.log('Staging migrations applied successfully.');
} catch (error) {
  console.error('Staging migration error:');
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
