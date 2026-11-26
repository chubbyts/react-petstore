import { test } from 'flashwright-test';
import { describeThemes, expectPage, mockPetApi, mockPetApiResponse, signIn } from '../../../fixtures';

describeThemes((theme) => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await mockPetApi(page);
  });

  test('list', async ({ page }) => {
    await page.goto('/pet');
    await expectPage(page, 'list', theme, ['page-pet-list', 'navigation-pet-count']);
  });

  test('list, last page', async ({ page }) => {
    await page.goto('/pet?page=2');
    await expectPage(page, 'list-last-page', theme, ['page-pet-list', 'pagination-page-2']);
  });

  test('list, filter without match', async ({ page }) => {
    await page.goto('/pet?filters[name]=Garfield');
    await expectPage(page, 'list-filter-without-match', theme, ['pet-filters-clear', 'navigation-pet-count']);
  });

  test('list, empty', async ({ page }) => {
    await mockPetApi(page, []);
    await page.goto('/pet');
    await expectPage(page, 'list-empty', theme, ['page-pet-list', 'navigation-pet-count']);
  });

  test('list, error', async ({ page }) => {
    await mockPetApiResponse(page, 'GET', 500, {
      title: 'Internal Server Error',
      detail: 'The database is not reachable',
      instance: 'b5cb3e7f-0b44-4c6b-9c7c-3b0e1d6a5c11',
    });
    await page.goto('/pet');
    await expectPage(page, 'list-error', theme, ['page-pet-list', 'http-error']);
  });

  test('list, delete dialog', async ({ page }) => {
    await page.goto('/pet');
    await page.getByTestId('remove-pet-0').click();
    await expectPage(page, 'list-delete-dialog', theme, ['delete-dialog', 'navigation-pet-count'], {
      fullPage: false,
    });
  });

  test.describe('narrow', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    // the sidebar above the content, the rows as cards
    test('list, narrow', async ({ page }) => {
      await page.goto('/pet');
      await expectPage(page, 'list-narrow', theme, ['page-pet-list', 'navigation-pet-count']);
    });
  });
});
