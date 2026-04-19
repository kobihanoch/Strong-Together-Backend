import fs from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';

// Switch between the dev and test database orchestration flows.
const isTest = process.argv.includes('test');
const skipSeeds = process.argv.includes('--skip-seeds');
const profile = isTest ? 'test' : 'dev';
const dbName = isTest ? 'strongtogether_test' : 'strongtogether_dev';
const containerName = isTest ? 'strongtogether_postgres_test' : 'strongtogether_postgres_dev';
const composeService = isTest ? 'postgres_test' : 'postgres_dev';

// Keep the compose, migration, and seed locations centralized for both modes.
const composeFile = 'docker-compose.yml';
const migrationsDir = 'src/infrastructure/db/schema/migrations';
const seedsDir = 'src/infrastructure/db/schema/seeds';
const atlasService = 'atlas';

function run(): void {
  try {
    console.log(`Starting ${profile} orchestration...`);

    // Start only the requested database service and wait for its healthcheck to pass.
    execSync(`docker compose -f ${composeFile} up -d --wait ${composeService}`, {
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
          WHERE datname = '${dbName}' AND pid <> pg_backend_pid();

          DROP DATABASE IF EXISTS ${dbName};
          CREATE DATABASE ${dbName};
        `,
      });
    }

    // Apply the committed migration history to the selected local database.
    console.log('Applying migrations...');
    execFileSync(
      'docker',
      [
        'compose',
        '-f',
        composeFile,
        'run',
        '--rm',
        atlasService,
        'migrate',
        'apply',
        '--dir',
        `file://${migrationsDir}`,
        '--url',
        `postgresql://postgres:postgres@${containerName}:5432/${dbName}?sslmode=disable`,
      ],
      {
        stdio: 'inherit',
      },
    );

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

run();
