import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup/testSetup.ts'],
    include: ['tests/**/*.test.ts'],
    globals: true,
    fileParallelism: false,
    passWithNoTests: true,
  },
});
