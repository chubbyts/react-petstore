import { test } from 'flashwright-test';
import { describeThemes, expectPage } from './fixtures';

// the app shell (sidebar, content), signed in: see the pages (component/page)
describeThemes((theme) => {
  test('login required', async ({ page }) => {
    await page.goto('/');
    await expectPage(page, 'login-required', theme, ['login-required']);
  });
});
