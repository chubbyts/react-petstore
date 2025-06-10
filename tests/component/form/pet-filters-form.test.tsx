import { test, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { formatHtml } from '../../formatter';
import { PetFiltersForm } from '../../../src/component/form/pet-filters-form';
import { BadRequest, NetworkError } from '../../../src/client/error';
import type { PetFilters } from '../../../src/model/pet';

test('default', () => {
  const httpError = undefined;
  const initialPetFilters = {};
  const submitPetFilters = () => {};

  const { container } = render(
    <PetFiltersForm httpError={httpError} initialPetFilters={initialPetFilters} submitPetFilters={submitPetFilters} />,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block"
            >Name<input
              data-testid="pet-filters-form-name"
              class="mt-2 mb-3 block w-full border px-3 py-2 border-gray-300"
              type="text"
              value="" /></label
          ><button
            data-testid="pet-filters-form-submit"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Filter
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('network error', () => {
  const httpError = new NetworkError({ title: 'network error' });
  const initialPetFilters = {};
  const submitPetFilters = () => {};

  render(
    <PetFiltersForm httpError={httpError} initialPetFilters={initialPetFilters} submitPetFilters={submitPetFilters} />,
  );
});

test('bad request', () => {
  const httpError = new BadRequest({
    title: 'bad request',
  });
  const initialPetFilters = {};
  const submitPetFilters = () => {};

  render(
    <PetFiltersForm httpError={httpError} initialPetFilters={initialPetFilters} submitPetFilters={submitPetFilters} />,
  );
});

test('bad request - with query string name', () => {
  const httpError = new BadRequest({
    title: 'bad request',
    invalidParameters: [{ name: 'filters[name]', reason: 'reason' }],
  });
  const initialPetFilters = {};
  const submitPetFilters = () => {};

  const { container } = render(
    <PetFiltersForm httpError={httpError} initialPetFilters={initialPetFilters} submitPetFilters={submitPetFilters} />,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block text-red-600"
            >Name<input
              data-testid="pet-filters-form-name"
              class="mt-2 mb-3 block w-full border px-3 py-2 border-red-600 bg-red-100"
              type="text"
              value=""
            />
            <ul class="mb-3">
              <li>reason</li>
            </ul></label
          ><button
            data-testid="pet-filters-form-submit"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Filter
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('submit with name', async () => {
  const httpError = undefined;
  const initialPetFilters = { name: 'Brown' };
  const submitPetFilters = vi.fn((petFilters: PetFilters) => {
    expect(petFilters).toEqual({ name: 'Brownie' });
  });

  render(
    <PetFiltersForm httpError={httpError} initialPetFilters={initialPetFilters} submitPetFilters={submitPetFilters} />,
  );

  const nameField = await screen.findByTestId('pet-filters-form-name');

  await userEvent.type(nameField, 'ie');

  const submitButton = await screen.findByTestId('pet-filters-form-submit');

  await userEvent.click(submitButton);

  expect(submitPetFilters).toHaveBeenCalledTimes(1);
});

test('submit without name', async () => {
  const httpError = undefined;
  const initialPetFilters = { name: '' };
  const submitPetFilters = vi.fn((petFilters: PetFilters) => {
    expect(petFilters).toEqual({ name: undefined });
  });

  render(
    <PetFiltersForm httpError={httpError} initialPetFilters={initialPetFilters} submitPetFilters={submitPetFilters} />,
  );

  const nameField = await screen.findByTestId('pet-filters-form-name');

  await userEvent.type(nameField, '{enter}');

  expect(submitPetFilters).toHaveBeenCalledTimes(1);
});
