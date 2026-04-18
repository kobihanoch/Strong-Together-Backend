import path from 'node:path';
import { execSync } from 'node:child_process';

// Accept the migration label from the CLI so Atlas can name the generated file.
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Usage: tsx scripts/create-db-migration.mts <migration_name>');
  process.exit(1);
}

// Point Atlas at the installed Windows binary and the repo-owned migration directory.
const atlasExecutable = path.join(process.env.LOCALAPPDATA ?? '', 'Programs', 'Atlas', 'atlas.exe');
const atlasEnv = 'local';

try {
  console.log(`Generating migration "${migrationName}" from local dev database changes...`);

  execSync(
    `"${atlasExecutable}" migrate diff --env "${atlasEnv}" --to "env://url" ${migrationName}`,
    {
      stdio: 'inherit',
    },
  );

  console.log('Migration file created successfully.');
} catch {
  console.error('Migration generation failed.');
  process.exit(1);
}
