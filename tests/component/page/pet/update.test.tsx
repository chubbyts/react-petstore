import { vi, test, expect, describe, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import nock from 'nock';
import Update from '../../../../src/component/page/pet/update';
import type { PetFormProps } from '../../../../src/component/form/pet-form';
import type { PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import { renderRoute } from '../../../render';

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    PetForm: (props: PetFormProps) => (
      <div>
        <button
          data-testid="pet-form-submit"
          data-has-http-error={!!props.httpError}
          data-has-initial-pet={!!props.initialPet}
          data-submit-label={props.submitLabel}
          data-cancel-to={props.cancelTo}
          data-list-to={props.listTo}
          onClick={() => props.submitPet({ name: 'Brownie', vaccinations: [] })}
        />
        {props.meta}
      </div>
    ),
  };
});

const id = '4d783b77-eb09-4603-b99b-f590b605eaa9';

const petResponse: PetResponse = {
  id,
  createdAt: '2005-08-15T15:52:01+00:00',
  name: 'Brownie',
  vaccinations: [],
  _links: {},
};

const renderUpdate = () =>
  renderRoute({
    path: '/pet/:id/update',
    url: `/pet/${id}/update`,
    element: <Update />,
    routes: <Route path="/pet/:id" element={<div data-testid="page-pet-read-mock" />} />,
  });

describe('update', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('not found', async () => {
    nock('https://petstore.test')
      .get(`/api/pets/${id}`)
      .reply(404, {
        title: 'Not Found',
        detail: `There is no entry with id "${id}"`,
      });

    const { container } = renderUpdate();

    await screen.findByTestId('http-error');

    expect(document.title).toBe('Edit pet – Petstore Admin');
    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div
          role="alert"
          data-testid="http-error"
          class="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
        >
          <p class="m-0"><strong class="text-danger">404 Not Found</strong></p>
          <p class="m-0">
            There is no entry with id "4d783b77-eb09-4603-b99b-f590b605eaa9"
          </p>
        </div>
        <div data-testid="page-pet-update" class="flex flex-col gap-[22px]">
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
                ><span aria-current="page" class="text-fg">Edit</span>
              </li>
            </ol>
          </nav>
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Edit pet
              </h1>
            </div>
            <a
              data-testid="back-to-list"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
              href="/pet"
              data-discover="true"
              ><svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 12H5"></path>
                <path d="m12 19-7-7 7-7"></path></svg
              >Back to list</a
            >
          </header>
        </div>
      </div>
      "
    `);
  });

  test('default', async () => {
    nock('https://petstore.test').get(`/api/pets/${id}`).reply(200, petResponse);

    const { container } = renderUpdate();

    await screen.findByTestId('pet-form-submit');

    expect(document.title).toBe('Edit Brownie – Petstore Admin');
    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-update" class="flex flex-col gap-[22px]">
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
                ><a
                  class="text-fg-muted hover:text-fg no-underline hover:underline"
                  href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
                  data-discover="true"
                  >Brownie</a
                >
              </li>
              <li class="flex items-center gap-2">
                <span aria-hidden="true">/</span
                ><span aria-current="page" class="text-fg">Edit</span>
              </li>
            </ol>
          </nav>
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Edit Brownie
              </h1>
            </div>
          </header>
          <div>
            <button
              data-testid="pet-form-submit"
              data-has-http-error="false"
              data-has-initial-pet="true"
              data-submit-label="Save changes"
              data-cancel-to="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
              data-list-to="/pet"
            ></button>
            <div
              class="text-fg-muted flex min-w-0 flex-col gap-px text-[13px] leading-4"
            >
              <span class="break-all">ID: 4d783b77-eb09-4603-b99b-f590b605eaa9</span
              ><span
                >Created:
                <time datetime="2005-08-15T15:52:01+00:00"
                  >15 Aug 2005, 17:52</time
                ></span
              ><span>Last updated: Never</span>
            </div>
          </div>
        </div>
      </div>
      "
    `);
  });

  test('unprocessable entity', async () => {
    nock('https://petstore.test').get(`/api/pets/${id}`).reply(200, petResponse);
    nock('https://petstore.test').put(`/api/pets/${id}`, { name: 'Brownie', vaccinations: [] }).reply(422, {
      title: 'Unprocessable Entity',
      detail: 'Field validation issues',
    });

    renderUpdate();

    const submit = await screen.findByTestId('pet-form-submit');

    await userEvent.click(submit);

    await vi.waitFor(() => expect(submit.getAttribute('data-has-http-error')).toBe('true'));
    // no invalid field to focus (form mocked): the focus moves to the error, so it's noticed
    await vi.waitFor(() => expect(document.activeElement).toBe(screen.getByTestId('http-error')));
  });

  test('successful', async () => {
    nock('https://petstore.test').get(`/api/pets/${id}`).reply(200, petResponse);
    nock('https://petstore.test')
      .put(`/api/pets/${id}`, { name: 'Brownie', vaccinations: [] })
      .reply(200, { ...petResponse, updatedAt: '2005-08-15T15:55:01+00:00' });

    renderUpdate();

    await userEvent.click(await screen.findByTestId('pet-form-submit'));

    await screen.findByTestId('page-pet-read-mock');
    expect((await screen.findByTestId('toast')).textContent).toBe('Saved “Brownie” — 200 OK');
  });
});
