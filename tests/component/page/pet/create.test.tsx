import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Create from '../../../../src/component/page/pet/create';
import { PetFormProps } from '../../../../src/component/form/pet-form';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { test, expect } from 'vitest';
import { PetRequest } from '../../../../src/model/model';
import { formatHtml } from '../../../formatter';
import { HttpError, UnprocessableEntity } from '../../../../src/api-client/error';

let mockCreatePet = (pet: PetRequest) => { };

vi.mock('../../../../src/api-client/pet', () => {
  return {
    CreatePet: (pet: PetRequest) => {
      return mockCreatePet(pet);
    },
  };
});

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    PetForm: ({ submitPet }: PetFormProps) => {
      const onSubmit = () => {
        submitPet({ ...({} as PetRequest), name: 'Brownie' });
      };

      return <button data-testid="test-button" onClick={onSubmit}></button>;
    },
  };
});

vi.mock('../../../../src/component/partial/http-error', () => {
  return {
    HttpError: ({ httpError }: { httpError: HttpError; }) => {
      return <div>httpError: {httpError.title}</div>;
    },
  };
});

test('default', () => {
  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Create />
    </Router>,
  );

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-create\\">
        <h1>Create Pet</h1>
        <button data-testid=\\"test-button\\"></button
        ><a class=\\"btn-gray\\" href=\\"/pet\\">List</a>
      </div>
    </div>
    "
  `);
});

test('unprocessable entity', async () => {
  mockCreatePet = async (pet: PetRequest) => {
    return new Promise<UnprocessableEntity>((resolve) => resolve(new UnprocessableEntity({ title: 'title' })));
  };

  const history = createMemoryHistory();

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Create />
    </Router>,
  );

  const testButton = await screen.findByTestId('test-button');

  await userEvent.click(testButton);

  await screen.findByText(/httpError/);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid=\\"page-pet-create\\">
        <div>httpError: title</div>
        <h1>Create Pet</h1>
        <button data-testid=\\"test-button\\"></button
        ><a class=\\"btn-gray\\" href=\\"/pet\\">List</a>
      </div>
    </div>
    "
  `);
});

test('successful', async () => {
  mockCreatePet = async (pet: PetRequest) => {
    return new Promise<PetRequest>((resolve) => resolve(pet));
  };

  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <Create />
    </Router>,
  );

  expect(history.location.pathname).toBe('/');

  const testButton = await screen.findByTestId('test-button');

  await userEvent.click(testButton);

  expect(history.location.pathname).toBe('/pet');
});
