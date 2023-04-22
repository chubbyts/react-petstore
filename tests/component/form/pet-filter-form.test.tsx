import { render, screen } from '@testing-library/react';
import { PetFilterForm } from '../../../src/component/form/pet-filter-form';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { test, expect } from 'vitest';
import { PetFilters } from '../../../src/model/model';
import { formatHtml } from '../../formatter';
import { BadRequest, InvalidParameter } from '../../../src/api-client/error';

test('without error', () => {
  const submitPetFilter = (filters: PetFilters) => { };

  const defaultPetFilters = { name: 'aa' };

  const { container } = render(
    <PetFilterForm submitPetFilter={submitPetFilter} defaultPetFilters={defaultPetFilters} />,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset>
          <div class=\\"form-field\\">
            <label>Name</label><input type=\\"text\\" name=\\"name\\" value=\\"\\" />
          </div>
          <button data-testid=\\"submit-pet-filter\\" class=\\"btn-blue\\">Filter</button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('with error', () => {
  const submitPetFilter = (filters: PetFilters) => { };

  const invalidParameters: Array<InvalidParameter> = [{ name: 'name', reason: 'Should not be empty' }];

  const badRequest = new BadRequest({
    title: 'title',
    invalidParameters: invalidParameters,
  });

  const { container } = render(<PetFilterForm submitPetFilter={submitPetFilter} badRequest={badRequest} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset>
          <div class=\\"form-field error\\">
            <label>Name</label><input type=\\"text\\" name=\\"name\\" value=\\"\\" />
            <ul>
              <li>Should not be empty</li>
            </ul>
          </div>
          <button data-testid=\\"submit-pet-filter\\" class=\\"btn-blue\\">Filter</button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('submit', async () => {
  const submitPetFilter = vi.fn((filters: PetFilters) => {
    expect(filters.name).toEqual('aa');
  });

  const defaultPetFilters = { name: 'aa' };

  render(<PetFilterForm submitPetFilter={submitPetFilter} defaultPetFilters={defaultPetFilters} />);

  const submitButton = await screen.findByTestId('submit-pet-filter');

  await userEvent.click(submitButton);

  expect(submitPetFilter.mock.calls.length).toBe(1);
});

test('submit empty', async () => {
  const submitPetFilter = vi.fn((filters: PetFilters) => {
    expect(filters.name).toBeUndefined();
  });

  const defaultPetFilters = { name: '' };

  render(<PetFilterForm submitPetFilter={submitPetFilter} defaultPetFilters={defaultPetFilters} />);

  const submitButton = await screen.findByTestId('submit-pet-filter');

  await userEvent.click(submitButton);

  expect(submitPetFilter.mock.calls.length).toBe(1);
});
