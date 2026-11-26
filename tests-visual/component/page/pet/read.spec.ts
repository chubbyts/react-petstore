import { test } from 'flashwright-test';
import { describeThemes, expectPage, mockPetApi, pets, signIn } from '../../../fixtures';

describeThemes((theme) => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await mockPetApi(page);
  });

  test('read', async ({ page }) => {
    await page.goto(`/pet/${pets[0].id}`);
    await expectPage(page, 'read', theme, ['page-pet-read', 'navigation-pet-count']);
  });

  test('read, no vaccinations', async ({ page }) => {
    await page.goto(`/pet/${pets[2].id}`);
    await expectPage(page, 'read-no-vaccinations', theme, ['page-pet-read', 'navigation-pet-count']);
  });

  test('read, not found', async ({ page }) => {
    await page.goto('/pet/unknown');
    await expectPage(page, 'read-not-found', theme, ['page-pet-read', 'http-error', 'navigation-pet-count']);
  });
});
