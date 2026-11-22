import { vi, test, expect, describe, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import nock from 'nock';
import Create from '../../../../src/component/page/pet/create';
import type { PetFormProps } from '../../../../src/component/form/pet-form';
import { formatHtml } from '../../../formatter';
import { renderRoute } from '../../../render';

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    PetForm: (props: PetFormProps) => (
      <button
        data-testid="pet-form-submit"
        data-has-http-error={!!props.httpError}
        data-has-initial-pet={!!props.initialPet}
        data-submit-label={props.submitLabel}
        data-cancel-to={props.cancelTo}
        data-list-to={props.listTo}
        data-has-meta={!!props.meta}
        onClick={() => props.submitPet({ name: 'Brownie', vaccinations: [] })}
      />
    ),
  };
});

const renderCreate = () =>
  renderRoute({
    path: '/pet/create',
    url: '/pet/create',
    element: <Create />,
    routes: <Route path="/pet/:id" element={<div data-testid="page-pet-read-mock" />} />,
  });

describe('create', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('default', async () => {
    const { container } = renderCreate();

    await screen.findByTestId('page-pet-create');

    expect(document.title).toBe('New pet – Petstore Admin');
    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-create" class="flex flex-col gap-[22px]">
          <nav aria-label="Breadcrumb" class="text-fg-muted text-sm">
            <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0">
              <li class="flex items-center gap-2">
                <a
                  class="text-fg-muted hover:text-fg no-underline hover:underline"
                  href="/pet"
                  data-discover="true"
                  >Pets</a
                >
              </li>
              <li class="flex items-center gap-2">
                <span aria-hidden="true">/</span
                ><span aria-current="page" class="text-fg">New</span>
              </li>
            </ol>
          </nav>
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                New pet
              </h1>
            </div>
          </header>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="false"
            data-has-initial-pet="false"
            data-submit-label="Create pet"
            data-cancel-to="/pet"
            data-list-to="/pet"
            data-has-meta="false"
          ></button>
        </div>
      </div>
      "
    `);
  });

  test('bad request', async () => {
    nock('https://petstore.test')
      .post('/api/pets', { name: 'Brownie', vaccinations: [] })
      .reply(400, {
        title: 'Bad Request',
        invalidParameters: [{ name: 'name', reason: 'Too small' }],
      });

    renderCreate();

    const submit = await screen.findByTestId('pet-form-submit');

    await userEvent.click(submit);

    await vi.waitFor(() => expect(submit.getAttribute('data-has-http-error')).toBe('true'));
    // no invalid field to focus (form mocked): the focus moves to the error, so it's noticed
    await vi.waitFor(() => expect(document.activeElement).toBe(screen.getByTestId('http-error')));
  });

  test('successful', async () => {
    nock('https://petstore.test').post('/api/pets', { name: 'Brownie', vaccinations: [] }).reply(201, {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      name: 'Brownie',
      vaccinations: [],
      _links: {},
    });

    renderCreate();

    await userEvent.click(await screen.findByTestId('pet-form-submit'));

    await screen.findByTestId('page-pet-read-mock');
    expect((await screen.findByTestId('toast')).textContent).toBe('Created “Brownie” — 201 Created');
  });
});
