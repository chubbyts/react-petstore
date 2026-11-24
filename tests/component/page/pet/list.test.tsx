import { vi, test, expect, describe, afterEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import nock from 'nock';
import List from '../../../../src/component/page/pet/list';
import type { PetFiltersFormProps } from '../../../../src/component/form/pet-filters-form';
import type { PetListResponse, PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import { renderRoute } from '../../../render';
import { mainId } from '../../../../src/component/partial/delete-dialog';

vi.mock('../../../../src/component/form/pet-filters-form', () => {
  return {
    PetFiltersForm: (props: PetFiltersFormProps) => {
      return (
        <button
          data-testid="pet-filters-form-submit"
          data-has-http-error={!!props.httpError}
          data-initial-pet-filters={JSON.stringify(props.initialPetFilters)}
          onClick={() => props.submitPetFilters({ name: 'Brownie' })}
        />
      );
    },
  };
});

const Location = () => {
  const location = useLocation();

  return <div data-testid="location">{decodeURIComponent(location.search)}</div>;
};

const Back = () => {
  const navigate = useNavigate();

  return <button data-testid="back" onClick={() => void navigate(-1)} />;
};

const createPet = (i: number, overrides: Partial<PetResponse> = {}): PetResponse => ({
  id: `4d783b77-eb09-4603-b99b-f590b605eaa${i}`,
  createdAt: '2005-08-15T15:52:01+00:00',
  updatedAt: null,
  name: `Pet ${i}`,
  vaccinations: [],
  _links: {},
  ...overrides,
});

const createPetList = (overrides: Partial<PetListResponse> = {}): PetListResponse => ({
  offset: 0,
  limit: 10,
  filters: {},
  sort: {},
  count: 1,
  items: [createPet(0)],
  _links: {},
  ...overrides,
});

const deletablePetList = () =>
  createPetList({
    items: [
      createPet(0, {
        name: 'Brownie',
        _links: { delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0' } },
      }),
    ],
  });

const renderListWithBack = (url: string | Array<string>) =>
  renderRoute({
    path: '/pet',
    url,
    element: (
      <>
        <List />
        <Location />
        <Back />
      </>
    ),
  });

const deletablePet = (i: number, name: string) =>
  createPet(i, { name, _links: { delete: { href: `/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa${i}` } } });

const nameHeader = () => screen.getByRole('columnheader', { name: /Name/ });

const renderList = (url = '/pet') =>
  renderRoute({
    path: '/pet',
    url,
    element: (
      <>
        <List />
        <Location />
      </>
    ),
  });

describe('list', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('bad request', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(400, {
      title: 'Bad Request',
      detail: 'Invalid filter',
    });

    const { container } = renderList();

    await screen.findByTestId('http-error');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div
          role="alert"
          data-testid="http-error"
          class="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
        >
          <p class="m-0"><strong class="text-danger">400 Bad Request</strong></p>
          <p class="m-0">Invalid filter</p>
        </div>
        <div data-testid="page-pet-list" class="flex flex-col gap-[22px]">
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="text-fg-muted text-sm">Resources / Pets</span>
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Pets
              </h1>
            </div>
          </header>
          <section
            aria-label="Pet list"
            class="flex flex-col rounded-xl border border-line bg-surface overflow-hidden"
          >
            <div
              class="border-line flex flex-wrap items-center gap-3 border-b px-4 py-3.5"
            >
              <button
                data-testid="pet-filters-form-submit"
                data-has-http-error="true"
                data-initial-pet-filters="{}"
              ></button>
            </div>
          </section>
        </div>
        <div data-testid="location"></div>
      </div>
      "
    `);
  });

  test('default minimal', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, createPetList());

    const { container } = renderList();

    await screen.findByText('Pet 0');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-list" class="flex flex-col gap-[22px]">
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="text-fg-muted text-sm">Resources / Pets</span>
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Pets
              </h1>
            </div>
          </header>
          <section
            aria-label="Pet list"
            class="flex flex-col rounded-xl border border-line bg-surface overflow-hidden"
          >
            <div
              class="border-line flex flex-wrap items-center gap-3 border-b px-4 py-3.5"
            >
              <button
                data-testid="pet-filters-form-submit"
                data-has-http-error="false"
                data-initial-pet-filters="{}"
              ></button>
            </div>
            <div class="overflow-x-auto @container">
              <table
                class="w-full border-collapse text-left min-w-[1120px] @max-3xl:block @max-3xl:min-w-0"
              >
                <caption class="sr-only">
                  Pets
                </caption>
                <thead class="bg-surface-muted @max-3xl:block">
                  <tr class="group @max-3xl:flex">
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:block @max-3xl:grow"
                    >
                      <button
                        type="button"
                        class="text-fg-secondary hover:text-fg p-0 font-semibold"
                      >
                        Name <span aria-hidden="true">↕</span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:hidden"
                    >
                      Tag
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:hidden"
                    >
                      Vaccinations
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left w-px whitespace-nowrap @max-3xl:hidden"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left w-px whitespace-nowrap @max-3xl:hidden"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left w-px whitespace-nowrap @max-3xl:hidden"
                    >
                      Updated
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-right @max-3xl:hidden"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="@max-3xl:block">
                  <tr
                    class="group border-line @max-3xl:hover:bg-row-hover @max-3xl:flex @max-3xl:flex-col @max-3xl:gap-2 @max-3xl:border-b @max-3xl:px-4 @max-3xl:py-3.5"
                  >
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                    >
                      <span class="font-semibold">Pet 0</span>
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:hidden"
                    ></td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:hidden"
                    ></td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent text-fg-placeholder text-[13px]"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >ID</span
                      >4d783b77-eb09-4603-b99b-f590b605eaa0
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent text-fg-placeholder text-[13px]"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >Created</span
                      ><time datetime="2005-08-15T15:52:01+00:00"
                        >15 Aug 2005, 17:52</time
                      >
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:hidden text-fg-placeholder text-[13px]"
                    ></td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-3 py-2 text-right whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent @max-3xl:-ml-3"
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav
              aria-label="Pagination"
              class="border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
            >
              <span
                aria-live="polite"
                aria-atomic="true"
                class="text-fg-muted text-sm"
                >Showing 1–1 of 1</span
              >
            </nav>
          </section>
        </div>
        <div data-testid="location"></div>
      </div>
      "
    `);
  });

  test('default maximal', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, sort: { name: 'asc' } })
      .reply(
        200,
        createPetList({
          sort: { name: 'asc' },
          count: 12,
          items: [
            createPet(0, {
              name: 'Brownie',
              tag: 'dog',
              updatedAt: '2005-08-15T15:55:01+00:00',
              vaccinations: [{ name: 'Rabies' }, { name: 'Distemper' }, { name: 'Parvovirus' }],
              _links: {
                read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0' },
                update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0' },
                delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0' },
              },
            }),
          ],
          _links: { create: { href: '/api/pets' } },
        }),
      );

    const { container } = renderList('/pet?sort[name]=asc');

    await screen.findByText('Brownie');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-list" class="flex flex-col gap-[22px]">
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="text-fg-muted text-sm">Resources / Pets</span>
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Pets
              </h1>
            </div>
            <a
              data-testid="pet-create"
              class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
              href="/pet/create"
              data-discover="true"
              ><svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 5v14M5 12h14"></path></svg
              >New pet</a
            >
          </header>
          <section
            aria-label="Pet list"
            class="flex flex-col rounded-xl border border-line bg-surface overflow-hidden"
          >
            <div
              class="border-line flex flex-wrap items-center gap-3 border-b px-4 py-3.5"
            >
              <button
                data-testid="pet-filters-form-submit"
                data-has-http-error="false"
                data-initial-pet-filters="{}"
              ></button>
            </div>
            <div class="overflow-x-auto @container">
              <table
                class="w-full border-collapse text-left min-w-[1120px] @max-3xl:block @max-3xl:min-w-0"
              >
                <caption class="sr-only">
                  Pets
                </caption>
                <thead class="bg-surface-muted @max-3xl:block">
                  <tr class="group @max-3xl:flex">
                    <th
                      scope="col"
                      aria-sort="ascending"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:block @max-3xl:grow"
                    >
                      <button
                        type="button"
                        class="text-fg-secondary hover:text-fg p-0 font-semibold"
                      >
                        Name <span aria-hidden="true">↑</span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:hidden"
                    >
                      Tag
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:hidden"
                    >
                      Vaccinations
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left w-px whitespace-nowrap @max-3xl:hidden"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left w-px whitespace-nowrap @max-3xl:hidden"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left w-px whitespace-nowrap @max-3xl:hidden"
                    >
                      Updated
                    </th>
                    <th
                      scope="col"
                      class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-right @max-3xl:hidden"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="@max-3xl:block">
                  <tr
                    class="group border-line @max-3xl:hover:bg-row-hover @max-3xl:flex @max-3xl:flex-col @max-3xl:gap-2 @max-3xl:border-b @max-3xl:px-4 @max-3xl:py-3.5"
                  >
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                    >
                      <a
                        class="text-fg hover:text-link font-semibold no-underline hover:underline"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa0"
                        data-discover="true"
                        >Brownie</a
                      >
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >Tag</span
                      ><span
                        class="bg-line text-fg-secondary inline-block rounded-full px-2 py-0.5 text-[13px] font-medium"
                        >dog</span
                      >
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >Vaccinations</span
                      >
                      <div class="flex flex-wrap items-center gap-1.5">
                        <span
                          class="border-chip-line bg-chip text-chip-fg rounded-md border px-2 py-0.5 text-[13px]"
                          >Rabies</span
                        ><span
                          class="border-chip-line bg-chip text-chip-fg rounded-md border px-2 py-0.5 text-[13px]"
                          >Distemper</span
                        ><span class="text-fg-muted text-[13px]"
                          ><span aria-hidden="true">+1</span
                          ><span class="sr-only">and 1 more</span></span
                        >
                      </div>
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent text-fg-placeholder text-[13px]"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >ID</span
                      >4d783b77-eb09-4603-b99b-f590b605eaa0
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent text-fg-placeholder text-[13px]"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >Created</span
                      ><time datetime="2005-08-15T15:52:01+00:00"
                        >15 Aug 2005, 17:52</time
                      >
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent text-fg-placeholder text-[13px]"
                    >
                      <span
                        class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                        >Updated</span
                      ><time datetime="2005-08-15T15:55:01+00:00"
                        >15 Aug 2005, 17:55</time
                      >
                    </td>
                    <td
                      class="border-line group-hover:bg-row-hover border-b px-3 py-2 text-right whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent @max-3xl:-ml-3"
                    >
                      <a
                        data-testid="read-pet-0"
                        aria-label="View Brownie"
                        class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 font-medium text-fg-muted hover:bg-line hover:text-fg"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa0"
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
                          <path
                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                          ></path>
                          <circle cx="12" cy="12" r="3"></circle></svg
                        >View</a
                      ><a
                        data-testid="update-pet-0"
                        aria-label="Edit Brownie"
                        class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 font-medium text-fg-muted hover:bg-line hover:text-fg"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa0/update"
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
                          <path d="M12 20h9"></path>
                          <path
                            d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"
                          ></path></svg
                        >Edit</a
                      ><button
                        data-testid="remove-pet-0"
                        aria-label="Delete Brownie"
                        type="button"
                        class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 font-medium text-fg-muted hover:bg-danger-surface-hover hover:text-danger-hover"
                      >
                        <svg
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
                          <path d="M3 6h18"></path>
                          <path d="M8 6V4h8v2"></path>
                          <path d="M6 6l1 14h10l1-14"></path></svg
                        >Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <nav
              aria-label="Pagination"
              class="border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
            >
              <span
                aria-live="polite"
                aria-atomic="true"
                class="text-fg-muted text-sm"
                >Showing 1–10 of 12</span
              >
              <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
                <li>
                  <a
                    data-testid="pagination-first"
                    aria-label="First page"
                    title="First page"
                    aria-disabled="true"
                    tabindex="-1"
                    class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9 pointer-events-none opacity-40"
                    href="/pet?page=1&amp;sort%5Bname%5D=asc"
                    data-discover="true"
                    ><span aria-hidden="true">«</span></a
                  >
                </li>
                <li>
                  <a
                    data-testid="pagination-previous"
                    aria-label="Previous page"
                    title="Previous page"
                    aria-disabled="true"
                    tabindex="-1"
                    class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9 pointer-events-none opacity-40"
                    href="/pet?page=1&amp;sort%5Bname%5D=asc"
                    data-discover="true"
                    ><span aria-hidden="true">‹</span></a
                  >
                </li>
                <li>
                  <a
                    data-testid="pagination-page-1"
                    aria-label="Page 1"
                    title="Page 1"
                    aria-current="page"
                    class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary forced-colors:outline forced-colors:outline-2 min-w-9"
                    href="/pet?page=1&amp;sort%5Bname%5D=asc"
                    data-discover="true"
                    >1</a
                  >
                </li>
                <li>
                  <a
                    data-testid="pagination-page-2"
                    aria-label="Page 2"
                    title="Page 2"
                    class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9"
                    href="/pet?page=2&amp;sort%5Bname%5D=asc"
                    data-discover="true"
                    >2</a
                  >
                </li>
                <li>
                  <a
                    data-testid="pagination-next"
                    aria-label="Next page"
                    title="Next page"
                    class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9"
                    href="/pet?page=2&amp;sort%5Bname%5D=asc"
                    data-discover="true"
                    ><span aria-hidden="true">›</span></a
                  >
                </li>
                <li>
                  <a
                    data-testid="pagination-last"
                    aria-label="Last page"
                    title="Last page"
                    class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9"
                    href="/pet?page=2&amp;sort%5Bname%5D=asc"
                    data-discover="true"
                    ><span aria-hidden="true">»</span></a
                  >
                </li>
              </ul>
            </nav>
          </section>
        </div>
        <div data-testid="location">?sort[name]=asc</div>
      </div>
      "
    `);
  });

  test('sort toggles default → asc → desc → default', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, createPetList());
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, sort: { name: 'asc' } })
      .reply(200, createPetList({ sort: { name: 'asc' } }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, sort: { name: 'desc' } })
      .reply(200, createPetList({ sort: { name: 'desc' } }));
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, createPetList());

    renderList();

    expect((await screen.findByRole('columnheader', { name: /Name/ })).getAttribute('aria-sort')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('?page=1&sort[name]=asc'));
    await waitFor(() => expect(nameHeader().getAttribute('aria-sort')).toBe('ascending'));
    expect(nameHeader().textContent).toBe('Name ↑');

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('?page=1&sort[name]=desc'));
    await waitFor(() => expect(nameHeader().getAttribute('aria-sort')).toBe('descending'));
    expect(nameHeader().textContent).toBe('Name ↓');

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('?page=1'));
    await waitFor(() => expect(nameHeader().getAttribute('aria-sort')).toBeNull());
    expect(nameHeader().textContent).toBe('Name ↕');

    await waitFor(() => expect(nock.isDone()).toBe(true));
  });

  test('filter, empty result and clear filter', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, createPetList());
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, filters: { name: 'Brownie' } })
      .reply(200, createPetList({ filters: { name: 'Brownie' }, count: 0, items: [] }));
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, createPetList());

    renderList();

    await userEvent.click(await screen.findByTestId('pet-filters-form-submit'));

    await screen.findByText('No pets match “Brownie”');
    expect(screen.getByTestId('location').textContent).toBe('?page=1&filters[name]=Brownie');
    expect(screen.getByText('No results')).toBeTruthy();
    expect(screen.getByTestId('pet-filters-form-submit').getAttribute('data-initial-pet-filters')).toBe(
      '{"name":"Brownie"}',
    );

    await userEvent.click(screen.getByTestId('pet-filters-clear'));

    await screen.findByText('Pet 0');
    expect(screen.getByTestId('location').textContent).toBe('?page=1');
    await waitFor(() => expect(nock.isDone()).toBe(true));
  });

  test('columns', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, createPetList());

    renderList();

    await screen.findByText('Pet 0');

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Name ↕',
      'Tag',
      'Vaccinations',
      'ID',
      'Created',
      'Updated',
      'Actions',
    ]);
    // no tag and no vaccinations: empty cells (without label, hidden when stacked)
    expect(screen.getAllByRole('cell')[1].textContent).toBe('');
    expect(screen.getAllByRole('cell')[2].textContent).toBe('');
    // the label is only visible when stacked (narrow screens)
    expect(screen.getAllByRole('cell')[3].textContent).toBe('ID4d783b77-eb09-4603-b99b-f590b605eaa0');
    // created with time (Europe/Zurich), never updated: empty cell
    expect(screen.getAllByRole('cell')[4].textContent).toBe('Created15 Aug 2005, 17:52');
    expect(screen.getAllByRole('cell')[5].textContent).toBe('');
  });

  test('vaccinations: up to two shown, the others counted', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(
        200,
        createPetList({
          count: 2,
          items: [
            createPet(0, { vaccinations: [{ name: 'Rabies' }, { name: 'Distemper' }] }),
            createPet(1, { vaccinations: [{ name: 'Rabies' }, { name: 'Distemper' }, { name: 'Parvovirus' }] }),
          ],
        }),
      );

    renderList();

    await screen.findByText('Pet 0');

    const rows = screen.getAllByRole('row').slice(1);

    expect(within(rows[0]).getAllByRole('cell')[2].textContent).toBe('VaccinationsRabiesDistemper');
    expect(within(rows[1]).getAllByRole('cell')[2].textContent).toBe('VaccinationsRabiesDistemper+1and 1 more');
  });

  test('empty without filter', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, createPetList({ count: 0, items: [] }));

    renderList();

    await screen.findByText('No pets yet');
  });

  test('pagination', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, createPetList({ count: 12 }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 10, limit: 10 })
      .reply(200, createPetList({ offset: 10, count: 12, items: [createPet(1)] }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, createPetList({ count: 12 }));

    renderList();

    await screen.findByText('Showing 1–10 of 12');
    expect(screen.getByRole('link', { name: 'Previous page' }).getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('link', { name: 'Page 1' }).getAttribute('aria-current')).toBe('page');

    await userEvent.click(screen.getByRole('link', { name: 'Next page' }));

    await screen.findByText('Showing 11–12 of 12');
    expect(screen.getByTestId('location').textContent).toBe('?page=2');
    expect(screen.getByRole('link', { name: 'Next page' }).getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('link', { name: 'Page 2' }).getAttribute('aria-current')).toBe('page');

    await userEvent.click(screen.getByRole('link', { name: 'Previous page' }));

    await screen.findByText('Showing 1–10 of 12');
    await waitFor(() => expect(nock.isDone()).toBe(true));
  });

  test('past the last page: to the last page, no bogus range', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 10, limit: 10 })
      .reply(200, createPetList({ offset: 10, count: 10, items: [] }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, createPetList({ count: 10 }));

    renderList('/pet?page=2');

    await screen.findByText('Showing 1–10 of 10');
    expect(screen.getByTestId('location').textContent).toBe('?page=1');
    expect(screen.queryByText('No pets yet')).toBeNull();
    expect(screen.queryByText(/Showing 11/)).toBeNull();
    await waitFor(() => expect(nock.isDone()).toBe(true));
  });

  test('back from a filter to a later page: not redirected by the placeholder of the filter', async () => {
    // page 3 loads only once checked that the placeholder (the filter, a single page) didn't redirect
    const { promise: pageThreeLoads, resolve: loadPageThree } = Promise.withResolvers<undefined>();

    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, filters: { name: 'Brownie' } })
      .reply(200, createPetList({ filters: { name: 'Brownie' }, count: 1 }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 20, limit: 10 })
      .reply(async () => {
        await pageThreeLoads;

        return [200, createPetList({ offset: 20, count: 30, items: [createPet(2)] })];
      });

    renderListWithBack(['/pet?page=3', '/pet?page=1&filters[name]=Brownie']);

    await screen.findByText('Showing 1–1 of 1');

    await userEvent.click(screen.getByTestId('back'));

    await waitFor(() =>
      expect(screen.getByTestId('pet-filters-form-submit').getAttribute('data-initial-pet-filters')).toBe('{}'),
    );
    expect(screen.getByTestId('location').textContent).toBe('?page=3');

    loadPageThree(undefined);

    await screen.findByText('Showing 21–30 of 30');
    expect(screen.getByTestId('location').textContent).toBe('?page=3');
    await waitFor(() => expect(nock.isDone()).toBe(true));
  });

  test('refining a filter replaces the history entry', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, filters: { name: 'Brown' } })
      .reply(200, createPetList({ filters: { name: 'Brown' }, count: 1 }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, filters: { name: 'Brownie' } })
      .reply(200, createPetList({ filters: { name: 'Brownie' }, count: 1 }));
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 20, limit: 10 })
      .reply(200, createPetList({ offset: 20, count: 30, items: [createPet(2)] }));

    renderListWithBack(['/pet?page=3', '/pet?page=1&filters[name]=Brown']);

    await screen.findByText('Pet 0');

    await userEvent.click(screen.getByTestId('pet-filters-form-submit'));

    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('?page=1&filters[name]=Brownie'));

    // not to "Brown": that entry got replaced
    await userEvent.click(screen.getByTestId('back'));

    await screen.findByText('Showing 21–30 of 30');
    expect(screen.getByTestId('location').textContent).toBe('?page=3');
    await waitFor(() => expect(nock.isDone()).toBe(true));
  });

  test('delete cancel', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, deletablePetList());

    renderList();

    const deleteButton = await screen.findByRole('button', { name: 'Delete Brownie' });

    // visible text, the accessible name adds the pet
    expect(deleteButton.textContent).toBe('Delete');

    await userEvent.click(deleteButton);

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete Brownie?' });

    expect(within(dialog).getByText('This can’t be undone.')).toBeTruthy();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  test('delete error', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, deletablePetList());
    nock('https://petstore.test').delete('/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0').reply(500, {
      title: 'Internal Server Error',
    });

    renderList();

    await userEvent.click(await screen.findByTestId('remove-pet-0'));
    await userEvent.click(await screen.findByTestId('delete-dialog-confirm'));

    const httpError = await screen.findByTestId('http-error');

    expect(httpError.textContent).toBe('500 Internal Server Error');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    // moved to the error, so it's noticed
    await vi.waitFor(() => expect(document.activeElement).toBe(httpError));
  });

  test('delete success', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(200, deletablePetList());
    nock('https://petstore.test').delete('/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0').reply(204);
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      // a real network takes a while: the row is still there when the delete succeeded
      .delay(100)
      .reply(200, createPetList({ count: 0, items: [] }));

    const main = document.createElement('main');
    main.setAttribute('id', mainId);
    main.setAttribute('tabindex', '-1');
    document.body.appendChild(main);

    renderList();

    await userEvent.click(await screen.findByTestId('remove-pet-0'));
    await userEvent.click(await screen.findByTestId('delete-dialog-confirm'));

    expect((await screen.findByTestId('toast')).textContent).toBe('Deleted “Brownie” — 204 No Content');
    // closed once the list is refetched: the row is gone, the focus is on the content (not lost to the body)
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByText('No pets yet')).toBeTruthy();
    expect(document.activeElement).toBe(main);
    await waitFor(() => expect(nock.isDone()).toBe(true));

    main.remove();
  });

  test('a delete finishing after cancel keeps the dialog of another pet open', async () => {
    // the delete of Brownie finishes only once the dialog of Snowball is open
    const { promise: deleteFinishes, resolve: finishDelete } = Promise.withResolvers<undefined>();

    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, createPetList({ count: 2, items: [deletablePet(0, 'Brownie'), deletablePet(1, 'Snowball')] }));
    nock('https://petstore.test')
      .delete('/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa0')
      .reply(async () => {
        await deleteFinishes;

        return [204];
      });
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, createPetList({ count: 1, items: [deletablePet(1, 'Snowball')] }));

    renderList();

    await userEvent.click(await screen.findByTestId('remove-pet-0'));
    await userEvent.click(await screen.findByTestId('delete-dialog-confirm'));
    await userEvent.click(screen.getByTestId('delete-dialog-cancel'));

    await userEvent.click(screen.getByTestId('remove-pet-1'));
    await screen.findByRole('alertdialog', { name: 'Delete Snowball?' });

    finishDelete(undefined);

    expect((await screen.findByTestId('toast')).textContent).toBe('Deleted “Brownie” — 204 No Content');
    await waitFor(() => expect(nock.isDone()).toBe(true));
    expect(screen.getByRole('alertdialog', { name: 'Delete Snowball?' })).toBeTruthy();
  });
});
