import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const schemaDir = path.join(rootDir, 'src', 'infrastructure', 'db', 'schema');
const migrationsDir = path.join(schemaDir, 'migrations');
const seedsDir = path.join(schemaDir, 'seeds');
const testComposeFile = path.join(rootDir, 'docker-compose.test.yml');
const testContainerName = 'strongtogether_postgres_test';
const testDatabaseName = 'strongtogether_test';

function run(command, args, options = {}) {
  const isWindows = process.platform === 'win32';
  const result = isWindows
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', command, ...args], {
        cwd: rootDir,
        stdio: 'inherit',
        input: options.input,
      })
    : spawnSync(command, args, {
        cwd: rootDir,
        stdio: 'inherit',
        input: options.input,
      });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed`);
  }
}

function getSortedSqlFiles(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort()
    .map((fileName) => path.join(dirPath, fileName));
}

function ensureTestPostgresIsRunning() {
  console.log('[test-db] Ensuring local Postgres test container is running...');
  run('docker', ['compose', '-f', testComposeFile, 'up', '-d', 'postgres_test']);
}

function waitForPostgresReady() {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const result = spawnSync(
      'docker',
      ['exec', testContainerName, 'pg_isready', '-U', 'postgres', '-d', 'postgres'],
      { cwd: rootDir, stdio: 'ignore' },
    );

    if (result.status === 0) {
      return;
    }

    sleep(1000);
  }

  throw new Error('Postgres test container did not become ready in time.');
}

function runSql(databaseName, sql) {
  run(
    'docker',
    ['exec', '-i', testContainerName, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', databaseName],
    { input: sql },
  );
}

function rebuildDatabase() {
  runSql(
    'postgres',
    `DROP DATABASE IF EXISTS ${testDatabaseName} WITH (FORCE);\nCREATE DATABASE ${testDatabaseName};\n`,
  );
}

function applySqlFiles(databaseName, files) {
  for (const filePath of files) {
    const relativePath = path.relative(rootDir, filePath);
    console.log(`[test-db] Applying ${relativePath}...`);
    runSql(databaseName, fs.readFileSync(filePath, 'utf8'));
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function main() {
  const migrationFiles = getSortedSqlFiles(migrationsDir);
  const seedFiles = getSortedSqlFiles(seedsDir);

  console.log('[test-db] Resetting local database from repository migrations and seeds...');
  ensureTestPostgresIsRunning();
  waitForPostgresReady();
  rebuildDatabase();
  applySqlFiles(testDatabaseName, migrationFiles);
  applySqlFiles(testDatabaseName, seedFiles);
  console.log('[test-db] Test database is ready.');
}

main();
