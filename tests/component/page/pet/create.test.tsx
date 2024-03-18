// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { PetFormProps } from '../../../../src/component/form/pet-form';
import type { PetRequest, PetResponse } from '../../../../src/model/pet';
import type { createPetClient } from '../../../../src/client/pet';
import { formatHtml } from '../../../formatter';
import { UnprocessableEntity } from '../../../../src/client/error';
import { userEvent } from '@testing-library/user-event';
import Create from '../../../../src/component/page/pet/create';

let mockCreatePetClient: typeof createPetClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    createPetClient: (pet: PetRequest) => {
      return mockCreatePetClient(pet);
    },
  };
});

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    PetForm: (props: PetFormProps) => {
      const onSubmit = () => {
        props.submitPet({ name: 'Brownie', vaccinations: [] });
      };

      return (
        <button
          data-testid="pet-form-submit"
          data-has-http-error={!!props.httpError}
          data-has-initial-pet={!!props.initialPet}
          onClick={onSubmit}
        />
      );
    },
  };
});

test('default', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/pet/create']}>
      <Routes>
        <Route path="/pet/create" element={<Create />} />
      </Routes>
    </MemoryRouter>,
  );

  await screen.findByTestId('page-pet-create');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-create">
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Create</h1>
        <button
          data-testid="pet-form-submit"
          data-has-http-error="false"
          data-has-initial-pet="false"
        ></button
        ><a
          class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700"
          href="/pet"
          >List</a
        >
      </div>
    </div>
    "
  `);
});

test('unprocessable entity', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mockCreatePetClient = async (_: PetRequest) => {
    return new Promise<UnprocessableEntity>((resolve) =>
      resolve(new UnprocessableEntity({ title: 'unprocessable entity' })),
    );
  };

  const { container } = render(
    <MemoryRouter initialEntries={['/pet/create']}>
      <Routes>
        <Route path="/pet/create" element={<Create />} />
      </Routes>
    </MemoryRouter>,
  );

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('http-error');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-create">
        <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
          <p class="font-bold">unprocessable entity</p>
        </div>
        <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Create</h1>
        <button
          data-testid="pet-form-submit"
          data-has-http-error="true"
          data-has-initial-pet="false"
        ></button
        ><a
          class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700"
          href="/pet"
          >List</a
        >
      </div>
    </div>
    "
  `);
});

test('successful', async () => {
  mockCreatePetClient = async (petRequest: PetRequest) => {
    const petResponse: PetResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      ...petRequest,
      _links: {},
    };
    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  const { container } = render(
    <MemoryRouter initialEntries={['/pet/create']}>
      <Routes>
        <Route path="/pet" element={<div data-testid="page-pet-list-mock" />} />
        <Route path="/pet/create" element={<Create />} />
      </Routes>
    </MemoryRouter>,
  );

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('page-pet-list-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div data-testid="page-pet-list-mock"></div></div>
    "
  `);
});
