import { test } from 'flashwright-test';
import { describeThemes, expectPage, mockPetApi, signIn } from '../../fixtures';

describeThemes((theme) => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await mockPetApi(page);
  });

  test('not found', async ({ page }) => {
    await page.goto('/unknown');
    await expectPage(page, 'not-found', theme, ['page-not-found', 'navigation-pet-count']);
  });
});
