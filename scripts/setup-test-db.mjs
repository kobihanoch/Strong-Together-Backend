import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dockerComposeFile = path.join(rootDir, 'docker-compose.test.yml');
const schemaPath = path.join(rootDir, 'schema.sql');
const seedPath = path.join(rootDir, 'seed.sql');

const containerName = 'strongtogether_postgres_test';
const dbName = 'strongtogether_test';
const dbUser = 'postgres';

const authTestUserHash = '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi';
const authTestUserSql = `
DELETE FROM public.users WHERE username = 'auth_test_user';

INSERT INTO public.users (
  username,
  email,
  name,
  gender,
  password,
  role,
  is_first_login,
  token_version,
  is_verified,
  auth_provider
)
VALUES (
  'auth_test_user',
  'auth_test_user@example.com',
  'Auth Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);
`;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(output || `${command} ${args.join(' ')} failed`);
  }

  return result;
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function runPsql(sql) {
  return run(
    'docker',
    ['exec', '-i', containerName, 'psql', '-U', dbUser, '-d', dbName, '-v', 'ON_ERROR_STOP=1', '-c', sql],
  );
}

function runWithRetry(fn, { attempts = 10, delayMs = 1000 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      sleep(delayMs);
    }
  }

  throw lastError;
}

function readSqlFile(filePath) {
  const buffer = readFileSync(filePath);

  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.toString('utf16le');
  }

  if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    throw new Error(`Unsupported UTF-16BE SQL file: ${filePath}`);
  }

  return buffer.toString('utf8');
}

function execFileInPsql(filePath) {
  const sqlText = readSqlFile(filePath);
  return run(
    'docker',
    ['exec', '-i', containerName, 'psql', '-U', dbUser, '-d', dbName],
    { input: sqlText, encoding: 'utf8' },
  );
}

function waitForPostgres() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      runPsql('SELECT 1;');
      return;
    } catch {}

    sleep(1000);
  }

  throw new Error('Postgres test container did not become ready in time.');
}

function ensureRole(roleName) {
  const safeRole = roleName.replace(/"/g, '""');
  runWithRetry(() =>
    runPsql(`
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${safeRole}') THEN
    EXECUTE format('CREATE ROLE %I', '${safeRole}');
  END IF;
END
$$;
`),
  );
}

function main() {
  console.log('[test-db] Resetting docker test database...');
  run('docker', ['compose', '-f', dockerComposeFile, 'down', '-v']);
  run('docker', ['compose', '-f', dockerComposeFile, 'up', '-d']);

  console.log('[test-db] Waiting for Postgres...');
  waitForPostgres();

  console.log('[test-db] Creating required roles before schema load...');
  ensureRole('authenticated');

  console.log('[test-db] Loading schema.sql...');
  runWithRetry(() => execFileInPsql(schemaPath));

  console.log('[test-db] Loading seed.sql...');
  runWithRetry(() => execFileInPsql(seedPath));

  console.log('[test-db] Verifying public.users exists...');
  runWithRetry(() => runPsql('SELECT COUNT(*) FROM public.users;'));

  console.log('[test-db] Ensuring auth_test_user exists...');
  runWithRetry(() => runPsql(authTestUserSql));

  console.log('[test-db] Test database is ready.');
}

main();
