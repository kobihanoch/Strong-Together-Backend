import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

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
  execFileSync('docker', ['compose', '-f', 'docker-compose.development.yml', 'run', '--rm', 'atlas', ...args], {
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

async function confirmProductionChange(action: 'apply' | 'init') {
  const expected = action === 'init' ? 'INIT PROD' : 'APPLY PROD';
  const rl = createInterface({ input, output });

  try {
    console.log(`Confirmation required for production database ${action}.`);
    console.log(`Type "${expected}" to continue.`);
    const answer = (await rl.question('> ')).trim();

    if (answer !== expected) {
      console.error('Confirmation did not match. Aborting production migration.');
      process.exit(1);
    }
  } finally {
    rl.close();
  }
}

// Reuse the repo-owned migration directory and the installed Atlas binary.
async function main() {
  const isDry = process.argv.includes('check');
  const isInit = process.argv.includes('init');
  const skipConfirmation = process.argv.includes('--yes');

  console.log('Applying migrations to production database...');
  if (isDry) {
    migrationDry();
  } else {
    if (!skipConfirmation) {
      await confirmProductionChange(isInit ? 'init' : 'apply');
    }

    if (isInit) initMigration();
    else migration();
  }

  console.log('Production migrations applied successfully.');
}

main().catch((error) => {
  console.error('Production migration apply failed.');
  process.exit(1);
});
