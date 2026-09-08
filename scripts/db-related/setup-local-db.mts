import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Switch between the dev and test database orchestration flows.
const requestedProfile = process.argv.includes('test') ? 'test' : 'dev';
const isTest = requestedProfile === 'test';
const skipSeeds = process.argv.includes('--skip-seeds');
const profile = requestedProfile;
const dbName = isTest ? 'strongtogether_test' : 'strongtogether_drizzle_dev';
const containerName = isTest ? 'strongtogether_postgres_test' : 'strongtogether_postgres_drizzle_dev';
const composeService = isTest ? 'postgres_test' : 'postgres_drizzle_dev';
const hostPort = isTest ? 5433 : 5435;

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

      if (isTest) {
        // The backend test process connects as the real non-superuser runtime role.
        // This password exists only in the disposable local TEST database.
        await client.unsafe(`ALTER ROLE app_runtime_user PASSWORD 'app_runtime_test'`);
      }

      // Track seed files independently from schema migrations. This makes dev
      // setup repeatable while test still rebuilds from a clean database.
      if (!skipSeeds) {
        console.log('Injecting seeds...');
        await client.unsafe(`
          CREATE TABLE IF NOT EXISTS drizzle.__seed_history (
            name text PRIMARY KEY,
            applied_at timestamptz NOT NULL DEFAULT now()
          )
        `);

        const seedFiles = fs
          .readdirSync(seedsDir)
          .filter((name) => name.endsWith('.sql'))
          .sort();

        for (const seedFile of seedFiles) {
          const [alreadyApplied] = await client<{ exists: boolean }[]>`
            SELECT EXISTS (
              SELECT 1 FROM drizzle.__seed_history WHERE name = ${seedFile}
            ) AS exists
          `;

          if (alreadyApplied.exists) {
            console.log(`Skipping already applied seed ${seedFile}`);
            continue;
          }

          await client.begin(async (tx) => {
            await tx.unsafe(fs.readFileSync(`${seedsDir}/${seedFile}`, 'utf8'));
            await tx`INSERT INTO drizzle.__seed_history (name) VALUES (${seedFile})`;
          });
        }
      }
    } finally {
      await client.end();
    }

    console.log(`${profile.toUpperCase()} environment is ready.`);
  } catch {
    console.error('Orchestration failed');
    process.exit(1);
  }
}

void run();
