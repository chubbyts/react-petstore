import { render, screen } from '@testing-library/react';
import BadRequest from '../../../Model/Error/BadRequest';
import InvalidParameter from '../../../Model/Error/InvalidParameter';
import PetFilterForm from '../../../Component/Form/PetFilterForm';
import PetFilters from '../../../Model/Pet/PetFilters';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { test, expect } from 'vitest';

test('without error', () => {
  const submitPetFilter = (filters: PetFilters) => {};

  const defaultPetFilters = new PetFilters({ name: 'aa' });

  const { container } = render(
    <PetFilterForm submitPetFilter={submitPetFilter} defaultPetFilters={defaultPetFilters} />,
  );

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                    </div>
                    <button data-testid="submit-pet-filter" class="btn-blue">Filter</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('with error', () => {
  const submitPetFilter = (filters: PetFilters) => {};

  const invalidParameters: Array<InvalidParameter> = [{ name: 'name', reason: 'Should not be empty' }];

  const badRequest = new BadRequest({
    title: 'title',
    invalidParameters: invalidParameters,
  });

  const { container } = render(<PetFilterForm submitPetFilter={submitPetFilter} badRequest={badRequest} />);

  expect(container.outerHTML).toBe(
    `
        <div>
            <form>
                <fieldset>
                    <div class="form-field error">
                        <label>Name</label>
                        <input type="text" name="name" value="">
                        <ul>
                            <li>Should not be empty</li>
                        </ul>
                    </div>
                    <button data-testid="submit-pet-filter" class="btn-blue">Filter</button>
                </fieldset>
            </form>
        </div>
    `
      .replace(/\n/g, '')
      .replace(/ {2,}/g, ''),
  );
});

test('submit', async () => {
  const submitPetFilter = vi.fn((filters: PetFilters) => {
    expect(filters.name).toEqual('aa');
  });

  const defaultPetFilters = new PetFilters({ name: 'aa' });

  render(<PetFilterForm submitPetFilter={submitPetFilter} defaultPetFilters={defaultPetFilters} />);

  const submitButton = await screen.findByTestId('submit-pet-filter');

  await userEvent.click(submitButton);

  expect(submitPetFilter.mock.calls.length).toBe(1);
});

test('submit empty', async () => {
  const submitPetFilter = vi.fn((filters: PetFilters) => {
    expect(filters.name).toBeUndefined();
  });

  const defaultPetFilters = new PetFilters({ name: '' });

  render(<PetFilterForm submitPetFilter={submitPetFilter} defaultPetFilters={defaultPetFilters} />);

  const submitButton = await screen.findByTestId('submit-pet-filter');

  await userEvent.click(submitButton);

  expect(submitPetFilter.mock.calls.length).toBe(1);
});
