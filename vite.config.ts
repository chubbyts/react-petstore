/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['tests/**/*.test.*'],
    coverage: {
      all: true,
      clean: true,
      reporter: ['text', 'html', 'lcov'],
      provider: 'v8',
      include: ['src'],
      exclude: ['src/index.tsx', 'src/vite-env.d.ts'],
    },
  },
});
