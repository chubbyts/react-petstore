import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from 'flashwright-test';

// visual regression tests (flashwright): render a component and compare a screenshot to a stored one
export default defineConfig({
  testDir: './tests-visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: 'http://localhost:3100',
    deviceScaleFactor: 1,
    // dates are shown in the browser's time zone
    timezoneId: 'Europe/Zurich',
    locale: 'en-US',
    // only on ci: outside ci flashwright keeps a warm browser session between runs, which fails with tracing enabled
    trace: process.env.CI ? 'retain-on-failure' : 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // wide enough for the pet list table next to the sidebar (no horizontal scrolling)
        viewport: { width: 1600, height: 900 },
        // own fontconfig: text rendering settings of the system or the user (hinting, subpixel) would change the screenshots
        launchOptions: {
          env: { ...process.env, FONTCONFIG_FILE: fileURLToPath(new URL('tests-visual/fonts.conf', import.meta.url)) },
        },
      },
    },
  ],
  webServer: {
    // by path: node_modules/.bin is not in the PATH when flashwright is not started by pnpm (e.g. node node_modules/flashwright-test/cli.js test)
    command: 'node node_modules/vite/bin/vite.js --config tests-visual/vite.config.ts',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
  },
});
