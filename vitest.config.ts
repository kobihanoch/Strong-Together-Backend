import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup/testSetup.ts'],
    include: ['tests/**/*.test.ts'],
    globals: true,
    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 10000,
    passWithNoTests: true,
  },
});
