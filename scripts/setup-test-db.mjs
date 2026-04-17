import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function run(command, args) {
  const isWindows = process.platform === 'win32';
  const result = isWindows
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', command, ...args], {
        cwd: rootDir,
        stdio: 'inherit',
      })
    : spawnSync(command, args, {
        cwd: rootDir,
        stdio: 'inherit',
      });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed`);
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function main() {
  const npxCommand = 'npx';

  let started = false;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      console.log(`[test-db] Resetting local database from migrations and seeds (attempt ${attempt}/3)...`);
      run(npxCommand, ['supabase', 'db', 'reset', '--local']);
      console.log('[test-db] Test database is ready.');
      return;
    } catch (error) {
      if (!started) {
        console.log('[test-db] Local Supabase stack is not ready yet. Starting it now...');
        run(npxCommand, ['supabase', 'start']);
        started = true;
      }

      if (attempt === 3) {
        throw error;
      }

      sleep(3000);
    }
  }

  throw new Error('Test database reset failed.');
}

main();
