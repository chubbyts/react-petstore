import { vi, test, expect, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import List from '../../../../src/component/page/pet/list';
import type { PetFiltersFormProps } from '../../../../src/component/form/pet-filters-form';
import { formatHtml } from '../../../formatter';
import type { PaginationProps } from '../../../../src/component/partial/pagination';

vi.mock('../../../../src/component/form/pet-filters-form', () => {
  return {
    PetFiltersForm: (props: PetFiltersFormProps) => {
      const onClick = () => {
        props.submitPetFilters({ name: 'Brownie' });
      };

      return (
        <button
          data-testid="pet-filters-form-submit"
          data-has-http-error={!!props.httpError}
          data-has-initial-pet-filters={!!props.initialPetFilters}
          onClick={onClick}
        />
      );
    },
  };
});

vi.mock('../../../../src/component/partial/pagination', () => {
  return {
    Pagination: (props: PaginationProps) => {
      const onClick = () => {
        props.submitPage(2);
      };

      return (
        <button
          data-testid="pagination-next"
          data-current-page={props.currentPage}
          data-total-pages={props.totalPages}
          data-max-pages={props.maxPages}
          onClick={onClick}
        />
      );
    },
  };
});

describe('list', () => {
  test('bad request', async () => {
    nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 10 }).reply(400, {
      type: 'https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.1',
      status: 400,
      title: 'Bad Request',
      _httpError: 'BadRequest',
      detail: 'Invalid filter',
    });

    const { container } = render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/pet']}>
          <Routes>
            <Route path="/pet" element={<List />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('page-pet-list');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-list">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">Bad Request</p>
            <p>Invalid filter</p>
          </div>
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet List
          </h1>
        </div>
      </div>
      "
    `);
  });

  test('default minimal', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            vaccinations: [],
            _links: {},
          },
        ],
        _links: {},
      });

    const { container } = render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/pet']}>
          <Routes>
            <Route path="/pet" element={<List />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('page-pet-list');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-list">
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet List
          </h1>
          <div>
            <button
              data-testid="pet-filters-form-submit"
              data-has-http-error="false"
              data-has-initial-pet-filters="true"
            ></button>
            <div class="mt-4">
              <div class="block w-full md:table">
                <div class="block w-full md:table-header-group">
                  <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Id
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      CreatedAt
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      UpdatedAt
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      <span>Name (</span
                      ><button data-testid="pet-sort-name-asc">
                        <span class="mx-1 inline-block">A-Z</span></button
                      ><span>|</span
                      ><button data-testid="pet-sort-name-desc">
                        <span class="mx-1 inline-block">Z-A</span></button
                      ><span>|</span
                      ><button data-testid="pet-sort-name--">
                        <span class="mx-1 inline-block">---</span></button
                      ><span>)</span>
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Tag
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Actions
                    </div>
                  </div>
                </div>
                <div class="block w-full md:table-row-group">
                  <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      4d783b77-eb09-4603-b99b-f590b605eaa9
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      15.08.2005 - 17:52:01
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      15.08.2005 - 17:55:01
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      Brownie
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    ></div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button
                data-testid="pagination-next"
                data-current-page="1"
                data-total-pages="1"
                data-max-pages="7"
              ></button>
            </div>
          </div>
        </div>
      </div>
      "
    `);
  });

  test('default maximal', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      });

    const { container } = render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/pet']}>
          <Routes>
            <Route path="/pet" element={<List />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('page-pet-list');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-list">
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black">
            Pet List
          </h1>
          <div>
            <a
              class="inline-block px-5 py-2 text-white bg-green-600 hover:bg-green-700 mb-4"
              href="/pet/create"
              data-discover="true"
              >Create</a
            ><button
              data-testid="pet-filters-form-submit"
              data-has-http-error="false"
              data-has-initial-pet-filters="true"
            ></button>
            <div class="mt-4">
              <div class="block w-full md:table">
                <div class="block w-full md:table-header-group">
                  <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Id
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      CreatedAt
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      UpdatedAt
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      <span>Name (</span
                      ><button data-testid="pet-sort-name-asc">
                        <span class="mx-1 inline-block">A-Z</span></button
                      ><span>|</span
                      ><button data-testid="pet-sort-name-desc">
                        <span class="mx-1 inline-block">Z-A</span></button
                      ><span>|</span
                      ><button data-testid="pet-sort-name--">
                        <span class="mx-1 inline-block">---</span></button
                      ><span>)</span>
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Tag
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Actions
                    </div>
                  </div>
                </div>
                <div class="block w-full md:table-row-group">
                  <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      4d783b77-eb09-4603-b99b-f590b605eaa9
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      15.08.2005 - 17:52:01
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      15.08.2005 - 17:55:01
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      Brownie
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      0001-000
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r"
                    >
                      <a
                        class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 mr-4"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
                        data-discover="true"
                        >Read</a
                      ><a
                        class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 mr-4"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update"
                        data-discover="true"
                        >Update</a
                      ><button
                        data-testid="remove-pet-0"
                        class="inline-block px-5 py-2 text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button
                data-testid="pagination-next"
                data-current-page="1"
                data-total-pages="1"
                data-max-pages="7"
              ></button>
            </div>
          </div>
        </div>
      </div>
      "
    `);
  });

  test('delete error', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      });

    nock('https://petstore.test').delete('/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9').reply(500, {
      type: 'https://datatracker.ietf.org/doc/html/rfc2616#section-10.5.1',
      status: 500,
      title: 'Internal Server Error',
      _httpError: 'InternalServerError',
      detail: 'Something went wrong, where are sorry',
    });

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/pet']}>
          <Routes>
            <Route path="/pet" element={<List />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('page-pet-list');

    const removeButton = await screen.findByTestId('remove-pet-0');

    await userEvent.click(removeButton);

    await screen.findByTestId('http-error');

    expect(formatHtml((await screen.findByTestId('http-error')).outerHTML)).toMatchInlineSnapshot(`
      "<div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
        <p class="font-bold">Internal Server Error</p>
        <p>Something went wrong, where are sorry</p>
      </div>
      "
    `);
  });

  test('delete success', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      });

    nock('https://petstore.test').delete('/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9').reply(204);

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/pet']}>
          <Routes>
            <Route path="/pet" element={<List />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('page-pet-list');

    const removeButton = await screen.findByTestId('remove-pet-0');

    await userEvent.click(removeButton);
  });

  test('submit', async () => {
    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10 })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      });

    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, sort: { name: 'desc' } })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      });

    nock('https://petstore.test')
      .get('/api/pets')
      .query({ offset: 0, limit: 10, filters: { name: 'Brownie' }, sort: { name: 'desc' } })
      .reply(200, {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      });

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/pet']}>
          <Routes>
            <Route path="/pet" element={<List />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('page-pet-list');

    const petSortNameSubmitButton = await screen.findByTestId('pet-sort-name-desc');

    await userEvent.click(petSortNameSubmitButton);

    await screen.findByTestId('page-pet-list');

    const petFiltersFormSubmitButton = await screen.findByTestId('pet-filters-form-submit');

    await userEvent.click(petFiltersFormSubmitButton);

    await screen.findByTestId('page-pet-list');

    const paginationNextButton = await screen.findByTestId('pagination-next');

    await userEvent.click(paginationNextButton);
  });
});
