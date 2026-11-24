import { test } from 'flashwright-test';
import { describeThemes, expectPage, mockPetApi, signIn } from '../../fixtures';

describeThemes((theme) => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await mockPetApi(page);
  });

  test('home', async ({ page }) => {
    await page.goto('/');
    await expectPage(page, 'home', theme, ['page-home', 'navigation-pet-count']);
  });
});
