import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testSeedsDir = path.join(rootDir, 'src', 'shared', 'test-seeds');

const dockerComposeFile = path.join(rootDir, 'docker-compose.test.yml');
const schemaPath = path.join(rootDir, 'schema.sql');
const seedPath = path.join(testSeedsDir, 'test-seed.sql');
const envTestPath = path.join(rootDir, '.env.test');

const containerName = 'strongtogether_postgres_test';
const dbName = 'strongtogether_test';
const dbUser = 'postgres';
const testSystemUserId = readEnvValue(envTestPath, 'SYSTEM_USER_ID');

const authTestUserHash = '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi';
const authTestUserSql = `
DELETE FROM public.users WHERE username IN ('auth_test_user', 'users_test_user', 'workouts_test_user', 'bootstrap_test_user', 'bootstrap_flow_user', 'bootstrap_aerobics_user', 'messages_test_user', 'aerobics_test_user', 'aerobics_aggregate_user', 'aerobics_get_user', 'aerobics_default_tz_user', 'analytics_test_user', 'analytics_empty_user', 'oauth_complete_user', 'oauth_incomplete_user', 'conflict_user');

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
  'users_test_user',
  'users_test_user@example.com',
  'Users Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'workouts_test_user',
  'workouts_test_user@example.com',
  'Workouts Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'bootstrap_test_user',
  'bootstrap_test_user@example.com',
  'Bootstrap Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'bootstrap_flow_user',
  'bootstrap_flow_user@example.com',
  'Bootstrap Flow User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'bootstrap_aerobics_user',
  'bootstrap_aerobics_user@example.com',
  'Bootstrap Aerobics User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'messages_test_user',
  'messages_test_user@example.com',
  'Messages Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'aerobics_test_user',
  'aerobics_test_user@example.com',
  'Aerobics Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'aerobics_aggregate_user',
  'aerobics_aggregate_user@example.com',
  'Aerobics Aggregate User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'aerobics_get_user',
  'aerobics_get_user@example.com',
  'Aerobics Get User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'aerobics_default_tz_user',
  'aerobics_default_tz_user@example.com',
  'Aerobics Default TZ User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'analytics_test_user',
  'analytics_test_user@example.com',
  'Analytics Test User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'analytics_empty_user',
  'analytics_empty_user@example.com',
  'Analytics Empty User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'oauth_complete_user',
  'oauth_complete_user@example.com',
  'OAuth Complete User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'oauth_incomplete_user',
  'oauth_incomplete_user@example.com',
  'OAuth Incomplete User',
  'Male',
  '${authTestUserHash}',
  'User',
  false,
  0,
  true,
  'app'
);

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
  'conflict_user',
  'conflict_user@example.com',
  'Conflict User',
  'Male',
  '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi',
  'User',
  false,
  0,
  true,
  'app'
);

INSERT INTO public.user_reminder_settings (user_id)
SELECT u.id
FROM public.users u
WHERE u.username IN (
  'auth_test_user',
  'users_test_user',
  'workouts_test_user',
  'bootstrap_test_user',
  'bootstrap_flow_user',
  'bootstrap_aerobics_user',
  'messages_test_user',
  'aerobics_test_user',
  'aerobics_aggregate_user',
  'aerobics_get_user',
  'aerobics_default_tz_user',
  'analytics_test_user',
  'analytics_empty_user',
  'oauth_complete_user',
  'oauth_incomplete_user',
  'conflict_user'
)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
SELECT u.id, 'google', 'google-oauth-complete-sub', u.email, NULL
FROM public.users u
WHERE u.username = 'oauth_complete_user'
ON CONFLICT (provider, provider_user_id) DO NOTHING;

INSERT INTO public.oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
SELECT u.id, 'google', 'google-oauth-incomplete-sub', u.email, 'name,email'
FROM public.users u
WHERE u.username = 'oauth_incomplete_user'
ON CONFLICT (provider, provider_user_id) DO NOTHING;
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
  return run('docker', [
    'exec',
    '-i',
    containerName,
    'psql',
    '-U',
    dbUser,
    '-d',
    dbName,
    '-v',
    'ON_ERROR_STOP=1',
    '-c',
    sql,
  ]);
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

function readEnvValue(filePath, key) {
  const content = readFileSync(filePath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));

  if (!line) {
    throw new Error(`Missing ${key} in ${path.basename(filePath)}`);
  }

  return line.slice(line.indexOf('=') + 1).trim();
}

function getSeedSystemUserId() {
  const seedSql = readSqlFile(seedPath);
  const match = seedSql.match(/INSERT INTO public\.users[\s\S]*?VALUES\s*\(\s*'([^']+)'[\s\S]*?'system_bot'/i);

  if (!match) {
    throw new Error('Could not find system_bot user id in src/shared/test-seeds/test-seed.sql');
  }

  return match[1];
}

function syncTestMessagePolicy() {
  const seedSystemUserId = getSeedSystemUserId();

  if (seedSystemUserId !== testSystemUserId) {
    throw new Error(
      `SYSTEM_USER_ID mismatch between .env.test (${testSystemUserId}) and src/shared/test-seeds/test-seed.sql (${seedSystemUserId})`,
    );
  }

  runWithRetry(() =>
    runPsql(`
DROP POLICY IF EXISTS "Enable insert for auth users on messages" ON public.messages;
CREATE POLICY "Enable insert for auth users on messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (((auth.uid() = sender_id) OR (sender_id = '${testSystemUserId}'::uuid)));
`),
  );
}

function execFileInPsql(filePath) {
  const sqlText = readSqlFile(filePath);
  return run('docker', ['exec', '-i', containerName, 'psql', '-U', dbUser, '-d', dbName], {
    input: sqlText,
    encoding: 'utf8',
  });
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

  console.log('[test-db] Loading src/shared/test-seeds/test-seed.sql...');
  runWithRetry(() => execFileInPsql(seedPath));

  console.log('[test-db] Syncing messages policy to .env.test SYSTEM_USER_ID...');
  syncTestMessagePolicy();

  console.log('[test-db] Verifying public.users exists...');
  runWithRetry(() => runPsql('SELECT COUNT(*) FROM public.users;'));

  console.log('[test-db] Ensuring auth_test_user exists...');
  runWithRetry(() => runPsql(authTestUserSql));

  console.log('[test-db] Test database is ready.');
}

main();
