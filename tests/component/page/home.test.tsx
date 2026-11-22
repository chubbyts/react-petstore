import { test, expect, describe, afterEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import nock from 'nock';
import Home from '../../../src/component/page/home';
import type { PetListResponse } from '../../../src/model/pet';
import { formatHtml } from '../../formatter';
import { renderRoute } from '../../render';

const createPetList = (overrides: Partial<PetListResponse> = {}): PetListResponse => ({
  offset: 0,
  limit: 1,
  filters: {},
  sort: {},
  count: 12,
  items: [],
  _links: {},
  ...overrides,
});

const nockPetCount = () => nock('https://petstore.test').get('/api/pets').query({ offset: 0, limit: 1 });

const renderHome = () => renderRoute({ path: '/', url: '/', element: <Home /> });

describe('home', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('with create link', async () => {
    nockPetCount().reply(200, createPetList({ _links: { create: { href: '/api/pets' } } }));

    const { container } = renderHome();

    await screen.findByText('12');

    expect(document.title).toBe('Home – Petstore Admin');
    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-home" class="flex flex-col gap-[22px]">
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="text-fg-muted text-sm">Petstore / Admin</span>
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Home
              </h1>
            </div>
          </header>
          <section
            aria-label="Resources"
            class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4"
          >
            <section
              data-testid="model-card-pet"
              aria-labelledby="_r_0_"
              class="flex flex-col rounded-xl border border-line bg-surface"
            >
              <div class="flex flex-col gap-5 p-4.5">
                <div class="flex items-center gap-3">
                  <span
                    class="bg-nav-active text-link-hover rounded-control flex size-10 shrink-0 items-center justify-center"
                    ><svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="5.5" cy="10" r="2"></circle>
                      <circle cx="9.5" cy="5.5" r="2"></circle>
                      <circle cx="14.5" cy="5.5" r="2"></circle>
                      <circle cx="18.5" cy="10" r="2"></circle>
                      <path
                        d="M8 17c0-2.5 1.8-5 4-5s4 2.5 4 5c0 1.7-1.3 2.5-2.5 2.5-.9 0-1-.5-1.5-.5s-.6.5-1.5.5C9.3 19.5 8 18.7 8 17z"
                      ></path></svg
                  ></span>
                  <h2 id="_r_0_" class="m-0 min-w-0 text-lg font-semibold">Pets</h2>
                </div>
                <p class="text-fg-muted m-0">Pets with their tag and vaccinations.</p>
                <p class="m-0 flex items-baseline gap-2">
                  <strong class="text-[26px] font-bold tracking-[-0.01em]">12</strong
                  ><span class="text-fg-muted">pets</span>
                </p>
              </div>
              <div
                class="border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5"
              >
                <a
                  aria-label="View all pets"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
                  href="/pet"
                  data-discover="true"
                  >View all</a
                ><a
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
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
              </div>
            </section>
          </section>
        </div>
      </div>
      "
    `);
  });

  test('single pet without create link', async () => {
    nockPetCount().reply(200, createPetList({ count: 1 }));

    renderHome();

    const card = await screen.findByRole('region', { name: 'Pets' });

    await within(card).findByText('1');

    expect(within(card).getByText('pet')).toBeTruthy();
    expect(within(card).getByRole('link', { name: 'View all pets' }).getAttribute('href')).toBe('/pet');
    expect(within(card).queryByRole('link', { name: 'New pet' })).toBeNull();
  });

  test('error', async () => {
    nockPetCount().reply(500, { title: 'Internal Server Error' });

    renderHome();

    expect((await screen.findByTestId('http-error')).textContent).toBe('500 Internal Server Error');
    expect(within(screen.getByRole('region', { name: 'Pets' })).getByText('—')).toBeTruthy();
  });
});
