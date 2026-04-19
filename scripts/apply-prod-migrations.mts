import { execFileSync } from 'node:child_process';

// Read the production Postgres URL from the environment rather than hardcoding it.
import dotenv from 'dotenv';
dotenv.config({ path: `.env.production` });

const prodDbUrl = process.env.PROD_DATABASE_URL;
const migrationsDir = 'src/infrastructure/db/schema/migrations';
const baselineVersion = '20260417190000';

if (!prodDbUrl) {
  console.error('Missing PROD_DATABASE_URL in the environment.');
  process.exit(1);
}

function runAtlas(args: string[]) {
  execFileSync('docker', ['compose', 'run', '--rm', 'atlas', ...args], {
    stdio: 'inherit',
  });
}

function migrationDry() {
  runAtlas([
    'migrate',
    'apply',
    '--dir',
    `file://${migrationsDir}`,
    '--url',
    prodDbUrl!,
    '--dry-run',
    '--revisions-schema',
    'public',
  ]);
}

function migration() {
  runAtlas([
    'migrate',
    'apply',
    '--dir',
    `file://${migrationsDir}`,
    '--url',
    prodDbUrl!,
    '--revisions-schema',
    'public',
  ]);
}

function initMigration() {
  runAtlas([
    'migrate',
    'set',
    baselineVersion,
    '--dir',
    `file://${migrationsDir}`,
    '--url',
    prodDbUrl!,
    '--revisions-schema',
    'public',
  ]);
}

// Reuse the repo-owned migration directory and the installed Atlas binary.
try {
  const isDry = process.argv.includes('check');
  const isInit = process.argv.includes('init');

  console.log('Applying migrations to production database...');
  if (isDry) {
    migrationDry();
  } else {
    if (isInit) initMigration();
    else migration();
  }

  console.log('Production migrations applied successfully.');
} catch (error) {
  console.error('Production migration apply failed.');
  console.error(error);
  process.exit(1);
}
