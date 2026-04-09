import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/shared/tests/setup/test-setup.ts'],
    include: ['src/modules/**/*.test.ts'],
    globals: true,
    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
    testTimeout: 10000,
    passWithNoTests: true,
  },
});

