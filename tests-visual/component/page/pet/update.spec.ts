import { test } from 'flashwright-test';
import { describeThemes, expectPage, mockPetApi, pets, signIn } from '../../../fixtures';

describeThemes((theme) => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await mockPetApi(page);
  });

  test('update', async ({ page }) => {
    await page.goto(`/pet/${pets[0].id}/update`);
    await expectPage(page, 'update', theme, ['page-pet-update', 'navigation-pet-count']);
  });
});
