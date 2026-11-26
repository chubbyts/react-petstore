import { test } from 'flashwright-test';
import { describeThemes, expectPage, mockPetApi, mockPetApiResponse, signIn } from '../../../fixtures';

describeThemes((theme) => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await mockPetApi(page);
  });

  test('create', async ({ page }) => {
    await page.goto('/pet/create');
    await expectPage(page, 'create', theme, ['page-pet-create', 'navigation-pet-count']);
  });

  test('create, invalid', async ({ page }) => {
    await mockPetApiResponse(page, 'POST', 422, {
      title: 'Unprocessable Entity',
      detail: 'The pet is not valid',
      invalidParameters: [
        { name: 'name', reason: 'Should not be blank' },
        { name: 'vaccinations[0][name]', reason: 'Should not be blank' },
      ],
    });
    await page.goto('/pet/create');
    await page.getByTestId('pet-form-tag').fill('dog');
    await page.getByTestId('pet-form-add-vaccination').click();
    await page.getByTestId('pet-form-submit').click();
    await expectPage(page, 'create-invalid', theme, ['http-error', 'navigation-pet-count']);
  });
});
