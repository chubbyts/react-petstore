import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { PetFormProps } from '../../../../src/component/form/pet-form';
import Update from '../../../../src/component/page/pet/update';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { test, expect } from 'vitest';
import { PetRequest, PetResponse } from '../../../../src/model/model';
import { formatHtml } from '../../../formatter';
import { HttpError, NotFound, UnprocessableEntity } from '../../../../src/api-client/error';

let mockReadPet = (id: string) => { };
let mockUpdatePet = (id: string, pet: PetRequest) => { };

vi.mock('../../../../src/api-client/pet', () => {
  return {
    ReadPet: (id: string) => {
      return mockReadPet(id);
    },
    UpdatePet: (id: string, pet: PetRequest) => {
      return mockUpdatePet(id, pet);
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

test('not found', async () => {
  mockReadPet = async (id: string) => {
    return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
  };

  const history = createMemoryHistory();
  history.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Update />
    </Router>,
  );

  await screen.findByTestId('page-pet-update');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-update">
        <div>httpError: title</div>
        <h1>Update Pet</h1>
        <a class="btn-gray" href="/pet">List</a>
      </div>
    </div>
    "
  `);
});

test('minimal', async () => {
  const pet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    name: 'Brownie',
  };

  mockReadPet = async (id: string) => {
    return new Promise<PetResponse>((resolve) => resolve(pet));
  };

  const history = createMemoryHistory();
  history.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Update />
    </Router>,
  );

  await screen.findByTestId('page-pet-update');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-update">
        <h1>Update Pet</h1>
        <button data-testid="test-button"></button
        ><a class="btn-gray" href="/pet">List</a>
      </div>
    </div>
    "
  `);
});

test('unprocessable entity', async () => {
  const pet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    name: 'Brownie',
    vaccinations: [{ name: 'Rabies' }],
  };

  mockReadPet = async (id: string) => {
    return new Promise<PetResponse>((resolve) => resolve(pet));
  };

  mockUpdatePet = async (id: string, pet: PetRequest) => {
    return new Promise<UnprocessableEntity>((resolve) => resolve(new UnprocessableEntity({ title: 'title' })));
  };

  const history = createMemoryHistory();
  history.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

  const { container } = render(
    <Router location={history.location} navigator={history}>
      <Update />
    </Router>,
  );

  await screen.findByTestId('page-pet-update');

  const testButton = await screen.findByTestId('test-button');

  await userEvent.click(testButton);

  await screen.findByText(/httpError/);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-update">
        <div>httpError: title</div>
        <h1>Update Pet</h1>
        <button data-testid="test-button"></button
        ><a class="btn-gray" href="/pet">List</a>
      </div>
    </div>
    "
  `);
});

test('successful', async () => {
  const pet = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    name: 'Brownie',
    vaccinations: [{ name: 'Rabies' }],
  };

  mockReadPet = async (id: string) => {
    return new Promise<PetResponse>((resolve) => resolve(pet));
  };

  mockUpdatePet = async (id: string, pet: PetRequest) => {
    return new Promise<PetRequest>((resolve) => resolve(pet));
  };

  const history = createMemoryHistory();
  history.push('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

  render(
    <Router location={history.location} navigator={history}>
      <Update />
    </Router>,
  );

  await screen.findByTestId('page-pet-update');

  expect(history.location.pathname).toBe('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9');

  const testButton = await screen.findByTestId('test-button');

  await userEvent.click(testButton);

  expect(history.location.pathname).toBe('/pet');
});
