import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['apps/*/src/**/*.test.{ts,tsx}', 'packages/*/src/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/.claude/**'],
    environment: 'jsdom',
    setupFiles: ['./apps/web-client/vitest.setup.ts'],
    css: false,
  },
});
