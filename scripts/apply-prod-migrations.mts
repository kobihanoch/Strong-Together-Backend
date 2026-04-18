import path from 'node:path';
import { execSync } from 'node:child_process';

// Read the production Postgres URL from the environment rather than hardcoding it.
import dotenv from 'dotenv';
dotenv.config({ path: `.env.production` });

const prodDbUrl = process.env.PROD_DATABASE_URL;

if (!prodDbUrl) {
  console.error('Missing PROD_DATABASE_URL in the environment.');
  process.exit(1);
}

// Reuse the repo-owned migration directory and the installed Atlas binary.
const atlasExecutable = path.join(process.env.LOCALAPPDATA ?? '', 'Programs', 'Atlas', 'atlas.exe');
const migrationsDir = 'src/infrastructure/db/schema/migrations';

try {
  console.log('Applying migrations to production database...');

  execSync(`"${atlasExecutable}" migrate apply --dir "file://${migrationsDir}" --url "${prodDbUrl}"`, {
    stdio: 'inherit',
  });

  console.log('Production migrations applied successfully.');
} catch {
  console.error('Production migration apply failed.');
  process.exit(1);
}
