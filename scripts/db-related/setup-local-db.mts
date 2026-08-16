import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Switch between the dev and test database orchestration flows.
const isTest = process.argv.includes('test');
const skipSeeds = process.argv.includes('--skip-seeds');
const profile = isTest ? 'test' : 'dev';
const dbName = isTest ? 'strongtogether_test' : 'strongtogether_dev';
const containerName = isTest ? 'strongtogether_postgres_test' : 'strongtogether_postgres_dev';
const composeService = isTest ? 'postgres_test' : 'postgres_dev';
const hostPort = isTest ? 5433 : 5434;

const localDbComposeFile = isTest ? 'docker-compose.test.yml' : 'docker-compose.development.yml';
const migrationsDir = 'src/infrastructure/db/schema/drizzle-migrations';
const seedsDir = 'src/infrastructure/db/schema/seeds';

async function run(): Promise<void> {
  try {
    console.log(`Starting ${profile} orchestration...`);

    // Start only the requested database service and wait for its healthcheck to pass.
    execSync(`docker compose -f ${localDbComposeFile} up -d --wait ${composeService}`, {
      stdio: 'inherit',
    });

    // Test runs should always start from a clean database.
    if (isTest) {
      console.log('Rebuilding database...');
      execSync(`docker exec -i ${containerName} psql -v ON_ERROR_STOP=1 -U postgres -d postgres`, {
        stdio: ['pipe', 'inherit', 'inherit'],
        input: `
          SELECT pg_terminate_backend(pid)
          FROM pg_stat_activity
          WHERE datname = '${dbName}'
            AND pid <> pg_backend_pid()
            AND backend_type = 'client backend';

          DROP DATABASE IF EXISTS ${dbName};
          CREATE DATABASE ${dbName};

          -- Roles live at cluster scope, so remove those created by an earlier
          -- disposable test database before replaying the Drizzle baseline.
          DROP ROLE IF EXISTS app_runtime_user, guest, anon, authenticated, service_role, app_user;
        `,
      });
    }

    // Apply the committed migration history to the selected local database.
    console.log('Applying migrations...');
    const client = postgres(`postgresql://postgres:postgres@localhost:${hostPort}/${dbName}`, { max: 1 });

    try {
      await migrate(drizzle(client), {
        migrationsFolder: migrationsDir,
        migrationsSchema: 'drizzle',
        migrationsTable: '__drizzle_migrations',
      });
    } finally {
      await client.end();
    }

    // Seeds are optional so dev can rerun migrations without re-inserting fixture data.
    if (!skipSeeds) {
      console.log('Injecting seeds...');
      const seedFiles = fs
        .readdirSync(seedsDir)
        .filter((name) => name.endsWith('.sql'))
        .sort();

      for (const seedFile of seedFiles) {
        execSync(`docker exec -i ${containerName} psql -v ON_ERROR_STOP=1 -U postgres -d ${dbName}`, {
          stdio: ['pipe', 'inherit', 'inherit'],
          input: fs.readFileSync(`${seedsDir}/${seedFile}`),
        });
      }
    }

    console.log(`${profile.toUpperCase()} environment is ready.`);
  } catch {
    console.error('Orchestration failed');
    process.exit(1);
  }
}

void run();
