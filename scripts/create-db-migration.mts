import { execFileSync } from 'node:child_process';

// Accept the migration label from the CLI so Atlas can name the generated file.
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Usage: tsx scripts/create-db-migration.mts <migration_name>');
  process.exit(1);
}

const localDbComposeFile = 'docker-compose.development.yml';

function runAtlas(args: string[]) {
  execFileSync('docker', ['compose', '-f', localDbComposeFile, 'up', '-d', '--wait', 'postgres_dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  });

  execFileSync('docker', ['compose', '-f', localDbComposeFile, 'run', '--rm', 'atlas', ...args], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  });
}
// Point Atlas at the installed Windows binary and the repo-owned migration directory.
const atlasEnv = 'local';

try {
  console.log(`Generating migration "${migrationName}" from local dev database changes...`);

  runAtlas(['migrate', 'diff', migrationName, '--env', atlasEnv, '--to', 'env://url']);

  console.log('Migration file created successfully.');
} catch {
  console.error('Migration generation failed.');
  process.exit(1);
}
