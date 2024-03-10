// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { test, expect, vi } from 'vitest';
import { formatHtml } from '../../formatter';
import { PetForm } from '../../../src/component/form/pet-form';
import { BadRequest, NetworkError } from '../../../src/client/error';
import type { PetRequest } from '../../../src/model/pet';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

test('without initial pet', () => {
  const httpError = undefined;
  const initialPet = undefined;
  const submitPet = () => {};

  const { container } = render(<PetForm httpError={httpError} initialPet={initialPet} submitPet={submitPet} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block"
            >Name<input
              data-testid="pet-form-name"
              type="text"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300"
              value="" /></label
          ><label class="block"
            >Tag<input
              data-testid="pet-form-tag"
              type="text"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300"
              value=""
          /></label>
          <div class="mb-3">
            <div class="mb-2 block">Vaccinations</div>
            <div>
              <button
                data-testid="pet-form-add-vaccination"
                class="inline-block px-5 py-2 text-white bg-green-600 hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
          <button
            data-testid="pet-form-submit"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('with initial pet', () => {
  const httpError = undefined;
  const initialPet = { name: 'Brownie', tag: '0001-000', vaccinations: [{ name: 'rabies' }] };
  const submitPet = () => {};

  const { container } = render(<PetForm httpError={httpError} initialPet={initialPet} submitPet={submitPet} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block"
            >Name<input
              data-testid="pet-form-name"
              type="text"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300"
              value="Brownie" /></label
          ><label class="block"
            >Tag<input
              data-testid="pet-form-tag"
              type="text"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300"
              value="0001-000"
          /></label>
          <div class="mb-3">
            <div class="mb-2 block">Vaccinations</div>
            <div>
              <fieldset class="mb-3 border border-gray-300 px-4 py-3">
                <label class="block"
                  >Name<input
                    data-testid="pet-form-vaccinations-0-name"
                    type="text"
                    class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300"
                    value="rabies" /></label
                ><button
                  data-testid="pet-form-remove-vaccination-0"
                  class="inline-block px-5 py-2 text-white bg-red-600 hover:bg-red-700"
                >
                  Remove
                </button>
              </fieldset>
              <button
                data-testid="pet-form-add-vaccination"
                class="inline-block px-5 py-2 text-white bg-green-600 hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
          <button
            data-testid="pet-form-submit"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('network error', () => {
  const httpError = new NetworkError({ title: 'network error' });
  const initialPet = { name: 'Brownie', tag: '0001-000', vaccinations: [{ name: 'rabies' }] };
  const submitPet = () => {};

  render(<PetForm httpError={httpError} initialPet={initialPet} submitPet={submitPet} />);
});

test('bad request', () => {
  const httpError = new BadRequest({
    title: 'bad request',
  });
  const initialPet = { name: 'Brownie', tag: '0001-000', vaccinations: [{ name: 'rabies' }] };
  const submitPet = () => {};

  render(<PetForm httpError={httpError} initialPet={initialPet} submitPet={submitPet} />);
});

test('bad request - with query string name', () => {
  const httpError = new BadRequest({
    title: 'bad request',
    invalidParameters: [
      { name: 'name', reason: 'reason1' },
      { name: 'vaccinations[0][name]', reason: 'reason2' },
    ],
  });
  const initialPet = { name: 'Brownie', tag: '0001-000', vaccinations: [{ name: 'rabies' }] };
  const submitPet = () => {};

  const { container } = render(<PetForm httpError={httpError} initialPet={initialPet} submitPet={submitPet} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block text-red-600"
            >Name<input
              data-testid="pet-form-name"
              type="text"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-red-600 bg-red-100"
              value="Brownie"
            />
            <ul class="mb-3">
              <li>reason1</li>
            </ul></label
          ><label class="block"
            >Tag<input
              data-testid="pet-form-tag"
              type="text"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300"
              value="0001-000"
          /></label>
          <div class="mb-3">
            <div class="mb-2 block">Vaccinations</div>
            <div>
              <fieldset class="mb-3 border border-gray-300 px-4 py-3">
                <label class="block text-red-600"
                  >Name<input
                    data-testid="pet-form-vaccinations-0-name"
                    type="text"
                    class="mb-3 mt-2 block w-full border px-3 py-2 border-red-600 bg-red-100"
                    value="rabies"
                  />
                  <ul class="mb-3">
                    <li>reason2</li>
                  </ul></label
                ><button
                  data-testid="pet-form-remove-vaccination-0"
                  class="inline-block px-5 py-2 text-white bg-red-600 hover:bg-red-700"
                >
                  Remove
                </button>
              </fieldset>
              <button
                data-testid="pet-form-add-vaccination"
                class="inline-block px-5 py-2 text-white bg-green-600 hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
          <button
            data-testid="pet-form-submit"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('submit with name', async () => {
  const httpError = undefined;
  const initialPet = { name: 'Brown', vaccinations: [{ name: 'rabie' }, { name: 'cat cold' }] };
  const submitPet = vi.fn((pet: PetRequest) => {
    expect(pet).toEqual({ name: 'Brownie', vaccinations: [{ name: 'rabies' }, { name: 'cat cold' }, { name: '' }] });
  });

  render(<PetForm httpError={httpError} initialPet={initialPet} submitPet={submitPet} />);

  const nameField = await screen.findByTestId('pet-form-name');

  await userEvent.type(nameField, 'ie');

  const vaccinationNameField = await screen.findByTestId('pet-form-vaccinations-0-name');

  await userEvent.type(vaccinationNameField, 's');

  const addVaccination = await screen.findByTestId('pet-form-add-vaccination');

  await userEvent.click(addVaccination);
  await userEvent.click(addVaccination);

  const removeVaccination = await screen.findByTestId('pet-form-remove-vaccination-3');

  await userEvent.click(removeVaccination);

  const submitButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(submitButton);

  expect(submitPet).toHaveBeenCalledTimes(1);
});
