import { test, expect, describe, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Route } from 'react-router-dom';
import nock from 'nock';
import Read from '../../../../src/component/page/pet/read';
import type { PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import { renderRoute } from '../../../render';

const id = '4d783b77-eb09-4603-b99b-f590b605eaa9';

const createPet = (overrides: Partial<PetResponse> = {}): PetResponse => ({
  id,
  createdAt: '2005-08-15T15:52:01+00:00',
  updatedAt: '2005-08-15T15:55:01+00:00',
  name: 'Brownie',
  tag: '0001-000',
  vaccinations: [],
  _links: {},
  ...overrides,
});

const renderRead = () =>
  renderRoute({
    path: '/pet/:id',
    url: `/pet/${id}`,
    element: <Read />,
    routes: <Route path="/pet" element={<div data-testid="page-pet-list-mock" />} />,
  });

describe('read', () => {
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

    const { container } = renderRead();

    await screen.findByTestId('http-error');

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
        <div data-testid="page-pet-read" class="flex flex-col gap-[22px]">
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
                ><span aria-current="page" class="text-fg">Pet</span>
              </li>
            </ol>
          </nav>
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Pet
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

  test('success without vaccinations and tag', async () => {
    nock('https://petstore.test')
      .get(`/api/pets/${id}`)
      .reply(200, createPet({ tag: undefined, updatedAt: undefined }));

    renderRead();

    await screen.findByText('No vaccinations recorded.');

    expect(document.title).toBe('Brownie – Petstore Admin');
    expect(screen.getByText('Vaccinations').textContent).toBe('Vaccinations (0)');
    expect(screen.getByText(/^ID:/).textContent).toBe(`ID: ${id}`);
    expect(screen.getByText(/^Created/).textContent).toBe('Created: 15 Aug 2005, 17:52');
    expect(screen.getByText(/^Last updated/).textContent).toBe('Last updated: Never');
    expect(screen.queryByTestId('pet-delete')).toBeNull();
    expect(screen.queryByTestId('pet-update')).toBeNull();
    // only in the footer, not in the header
    expect(screen.getAllByRole('link', { name: 'Back to list' })).toHaveLength(1);
    expect(screen.getByRole('banner').textContent).not.toContain('Back to list');
  });

  test('success with vaccinations and links', async () => {
    nock('https://petstore.test')
      .get(`/api/pets/${id}`)
      .reply(
        200,
        createPet({
          vaccinations: [{ name: 'Rabies' }, { name: 'Distemper' }],
          _links: {
            read: { href: `/api/pets/${id}` },
            update: { href: `/api/pets/${id}` },
            delete: { href: `/api/pets/${id}` },
          },
        }),
      );

    const { container } = renderRead();

    await screen.findByText('Rabies');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-read" class="flex flex-col gap-[22px]">
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
                ><span aria-current="page" class="text-fg">Brownie</span>
              </li>
            </ol>
          </nav>
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Brownie
              </h1>
            </div>
          </header>
          <section
            aria-label="Pet details"
            class="flex flex-col rounded-xl border border-line bg-surface"
          >
            <div class="flex flex-col gap-5 p-4.5">
              <dl class="m-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <dt class="text-sm font-semibold">Name</dt>
                  <dd
                    class="m-0 flex items-center rounded-lg border border-line bg-surface-muted px-3 break-all min-h-11"
                  >
                    Brownie
                  </dd>
                </div>
                <div class="flex flex-col gap-1.5">
                  <dt class="text-sm font-semibold">Tag</dt>
                  <dd
                    class="m-0 flex items-center rounded-lg border border-line bg-surface-muted px-3 break-all min-h-11"
                  >
                    0001-000
                  </dd>
                </div>
              </dl>
              <div class="flex flex-col gap-2">
                <div class="flex min-h-[34px] items-center">
                  <h2 id="pet-vaccinations" class="m-0 text-sm font-semibold">
                    Vaccinations <span class="text-fg-muted font-normal">(2)</span>
                  </h2>
                </div>
                <ol
                  aria-labelledby="pet-vaccinations"
                  class="m-0 flex list-none flex-col gap-2 p-0"
                >
                  <li
                    class="m-0 flex items-center rounded-lg border border-line bg-surface-muted px-3 break-all min-h-10"
                  >
                    Rabies
                  </li>
                  <li
                    class="m-0 flex items-center rounded-lg border border-line bg-surface-muted px-3 break-all min-h-10"
                  >
                    Distemper
                  </li>
                </ol>
              </div>
            </div>
            <div
              class="border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5"
            >
              <div
                class="text-fg-muted flex min-w-0 flex-col gap-px text-[13px] leading-4"
              >
                <span class="break-all">ID: 4d783b77-eb09-4603-b99b-f590b605eaa9</span
                ><span
                  >Created:
                  <time datetime="2005-08-15T15:52:01+00:00"
                    >15 Aug 2005, 17:52</time
                  ></span
                ><span
                  >Last updated:
                  <time datetime="2005-08-15T15:55:01+00:00"
                    >15 Aug 2005, 17:55</time
                  ></span
                >
              </div>
              <span class="flex-1"></span
              ><a
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
              ><a
                data-testid="pet-update"
                class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
                href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update"
                data-discover="true"
                >Edit</a
              >
            </div>
          </section>
        </div>
      </div>
      "
    `);
  });
});
