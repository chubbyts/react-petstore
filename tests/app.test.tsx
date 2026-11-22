import { test, expect, vi, describe, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { userEvent } from '@testing-library/user-event';
import nock from 'nock';
import App from '../src/app';
import type { Oidc } from '../src/hook/use-oidc';
import type { HttpError } from '../src/client/error';
import { InternalServerError, NetworkError } from '../src/client/error';
import { formatHtml } from './formatter';

// the error the (mocked) page reports, see usePageError
const { page } = vi.hoisted(() => ({ page: { httpError: undefined as HttpError | undefined } }));

vi.mock('../src/routes', async () => {
  const { usePageError } = await import('../src/hook/use-page-error');

  const RoutesMock = () => {
    usePageError(page.httpError);

    return <div data-testid="routes-mock" />;
  };

  return { default: RoutesMock };
});

const { oidc } = vi.hoisted(() => {
  return {
    oidc: {
      isLoading: false,
      isAuthenticated: true,
      username: 'admin',
      error: undefined,
      login: vi.fn(),
      logout: vi.fn(),
    } as Oidc,
  };
});

vi.mock('../src/hook/use-oidc', () => {
  return {
    useOidc: () => oidc,
  };
});

const nockPetCount = (count: number) =>
  nock('https://petstore.test')
    .get('/api/pets')
    .query({ offset: 0, limit: 1 })
    .reply(200, { offset: 0, limit: 1, filters: {}, sort: {}, count, items: [], _links: {} });

const renderApp = (url = '/') =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe('app', () => {
  beforeEach(() => {
    // oxlint-disable functional/immutable-data
    oidc.isLoading = false;
    oidc.isAuthenticated = true;
    oidc.username = 'admin';
    oidc.error = undefined;
    oidc.login = vi.fn();
    oidc.logout = vi.fn();
    page.httpError = undefined;
    // oxlint-enable functional/immutable-data
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('pet list', async () => {
    nockPetCount(12);

    const { container } = renderApp('/pet');

    await screen.findByRole('link', { name: 'Pets (12 total)' });

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="flex min-h-full flex-wrap items-stretch">
          <a
            href="#main"
            class="bg-primary text-on-primary rounded-control sr-only font-semibold no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5"
            >Skip to content</a
          >
          <header
            class="border-line bg-sidebar basis-sidebar flex max-w-full grow flex-col gap-7 border-r px-3.5 py-5"
          >
            <a
              class="text-fg hover:text-fg flex items-center gap-2.5 px-2 no-underline"
              href="/"
              data-discover="true"
              ><span
                class="bg-primary text-on-primary flex size-8 items-center justify-center rounded-lg"
                ><svg
                  aria-hidden="true"
                  width="18"
                  height="18"
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
                  ></path></svg></span
              ><span class="flex flex-col"
                ><strong class="text-[17px]">Petstore</strong
                ><span class="text-fg-muted text-[13px]">Admin</span></span
              ></a
            >
            <nav aria-label="Main" class="flex flex-col gap-0.5">
              <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
                <li>
                  <a
                    data-testid="navigation-home"
                    class="flex items-center justify-between rounded-lg px-2.5 py-[9px] no-underline text-fg-secondary hover:bg-surface-hover hover:text-fg"
                    href="/"
                    data-discover="true"
                    >Home</a
                  >
                </li>
              </ul>
              <h2
                class="m-0 px-2.5 pb-1.5 text-xs font-semibold tracking-[.06em] text-fg-muted uppercase pt-[18px]"
              >
                Resources
              </h2>
              <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
                <li>
                  <a
                    data-testid="navigation-pet"
                    aria-current="page"
                    class="flex items-center justify-between rounded-lg px-2.5 py-[9px] no-underline bg-nav-active text-link-hover hover:text-link-hover font-semibold forced-colors:outline forced-colors:outline-1"
                    href="/pet"
                    data-discover="true"
                    aria-label="Pets (12 total)"
                    ><span>Pets</span
                    ><span
                      data-testid="navigation-pet-count"
                      class="text-[13px] font-medium"
                      >12</span
                    ></a
                  >
                </li>
              </ul>
            </nav>
            <div class="mt-auto flex flex-col gap-3">
              <div class="flex items-center gap-2">
                <strong
                  data-testid="navigation-username"
                  class="min-w-0 flex-1 truncate px-1 text-sm"
                  ><span class="sr-only">Signed in as </span>admin</strong
                ><button
                  data-testid="navigation-logout"
                  type="button"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg"
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
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <path d="m16 17 5-5-5-5"></path>
                    <path d="M21 12H9"></path></svg
                  >Log out
                </button>
              </div>
              <div
                role="group"
                aria-label="Theme"
                class="border-line-control flex w-full gap-0.5 rounded-lg border p-0.5"
              >
                <button
                  type="button"
                  data-testid="theme-system"
                  aria-pressed="true"
                  class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium bg-nav-active text-link-hover forced-colors:outline forced-colors:outline-1"
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
                    <rect x="3" y="4" width="18" height="12" rx="2"></rect>
                    <path d="M8 20h8M12 16v4"></path></svg
                  >System</button
                ><button
                  type="button"
                  data-testid="theme-light"
                  aria-pressed="false"
                  class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium text-fg-muted hover:bg-surface-hover hover:text-fg"
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
                    <circle cx="12" cy="12" r="4"></circle>
                    <path
                      d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                    ></path></svg
                  >Light</button
                ><button
                  type="button"
                  data-testid="theme-dark"
                  aria-pressed="false"
                  class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium text-fg-muted hover:bg-surface-hover hover:text-fg"
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
                    <path
                      d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
                    ></path></svg
                  >Dark
                </button>
              </div>
            </div>
          </header>
          <main
            id="main"
            tabindex="-1"
            class="min-w-0 flex-[999_1_560px] px-8 pt-7 pb-12 outline-none"
          >
            <div
              data-testid="content"
              class="max-w-content mx-auto flex w-full flex-col gap-[22px]"
            >
              <div data-testid="routes-mock"></div>
            </div>
          </main>
        </div>
      </div>
      "
    `);
  });

  test('unknown username', async () => {
    // oxlint-disable-next-line functional/immutable-data
    oidc.username = undefined;

    nockPetCount(0);

    renderApp();

    await screen.findByRole('link', { name: 'Pets (0 total)' });

    expect(screen.getByTestId('navigation-username').textContent).toBe('Signed in as unknown');
    expect(screen.getByTestId('navigation-home').getAttribute('aria-current')).toBe('page');
    expect(screen.getByTestId('navigation-pet').getAttribute('aria-current')).toBeNull();
  });

  test('loading', async () => {
    // oxlint-disable-next-line functional/immutable-data
    oidc.isLoading = true;

    nockPetCount(12);

    renderApp();

    await screen.findByRole('link', { name: 'Pets (12 total)' });

    expect(screen.queryByTestId('routes-mock')).toBeNull();
    expect(screen.queryByTestId('login-required')).toBeNull();
  });

  test('login', async () => {
    // oxlint-disable functional/immutable-data
    oidc.isAuthenticated = false;
    oidc.username = undefined;
    // oxlint-enable functional/immutable-data

    const { container } = renderApp();

    const login = await screen.findByTestId('login');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="flex min-h-full flex-wrap items-stretch">
          <a
            href="#main"
            class="bg-primary text-on-primary rounded-control sr-only font-semibold no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5"
            >Skip to content</a
          >
          <header
            class="border-line bg-sidebar basis-sidebar flex max-w-full grow flex-col gap-7 border-r px-3.5 py-5"
          >
            <a
              class="text-fg hover:text-fg flex items-center gap-2.5 px-2 no-underline"
              href="/"
              data-discover="true"
              ><span
                class="bg-primary text-on-primary flex size-8 items-center justify-center rounded-lg"
                ><svg
                  aria-hidden="true"
                  width="18"
                  height="18"
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
                  ></path></svg></span
              ><span class="flex flex-col"
                ><strong class="text-[17px]">Petstore</strong
                ><span class="text-fg-muted text-[13px]">Admin</span></span
              ></a
            >
            <nav aria-label="Main" class="flex flex-col gap-0.5">
              <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
                <li>
                  <a
                    data-testid="navigation-home"
                    aria-current="page"
                    class="flex items-center justify-between rounded-lg px-2.5 py-[9px] no-underline bg-nav-active text-link-hover hover:text-link-hover font-semibold forced-colors:outline forced-colors:outline-1"
                    href="/"
                    data-discover="true"
                    >Home</a
                  >
                </li>
              </ul>
              <h2
                class="m-0 px-2.5 pb-1.5 text-xs font-semibold tracking-[.06em] text-fg-muted uppercase pt-[18px]"
              >
                Resources
              </h2>
              <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
                <li>
                  <a
                    data-testid="navigation-pet"
                    class="flex items-center justify-between rounded-lg px-2.5 py-[9px] no-underline text-fg-secondary hover:bg-surface-hover hover:text-fg"
                    href="/pet"
                    data-discover="true"
                    ><span>Pets</span></a
                  >
                </li>
              </ul>
            </nav>
            <div class="mt-auto flex flex-col gap-3">
              <div
                role="group"
                aria-label="Theme"
                class="border-line-control flex w-full gap-0.5 rounded-lg border p-0.5"
              >
                <button
                  type="button"
                  data-testid="theme-system"
                  aria-pressed="true"
                  class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium bg-nav-active text-link-hover forced-colors:outline forced-colors:outline-1"
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
                    <rect x="3" y="4" width="18" height="12" rx="2"></rect>
                    <path d="M8 20h8M12 16v4"></path></svg
                  >System</button
                ><button
                  type="button"
                  data-testid="theme-light"
                  aria-pressed="false"
                  class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium text-fg-muted hover:bg-surface-hover hover:text-fg"
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
                    <circle cx="12" cy="12" r="4"></circle>
                    <path
                      d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                    ></path></svg
                  >Light</button
                ><button
                  type="button"
                  data-testid="theme-dark"
                  aria-pressed="false"
                  class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1.5 text-[13px] font-medium text-fg-muted hover:bg-surface-hover hover:text-fg"
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
                    <path
                      d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
                    ></path></svg
                  >Dark
                </button>
              </div>
            </div>
          </header>
          <main
            id="main"
            tabindex="-1"
            class="min-w-0 flex-[999_1_560px] px-8 pt-7 pb-12 outline-none"
          >
            <div
              data-testid="content"
              class="max-w-content mx-auto flex w-full flex-col gap-[22px]"
            >
              <section
                data-testid="login-required"
                aria-labelledby="login-title"
                class="flex flex-col rounded-xl border border-line bg-surface max-w-md"
              >
                <div class="flex flex-col gap-5 p-4.5">
                  <h1
                    id="login-title"
                    class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words"
                  >
                    Sign in
                  </h1>
                  <p class="text-fg-muted m-0">
                    You need to sign in to manage the petstore.
                  </p>
                  <div>
                    <button
                      data-testid="login"
                      type="button"
                      class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-11 rounded-control px-4 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
      "
    `);

    await userEvent.click(login);

    expect(oidc.login).toHaveBeenCalledTimes(1);
    expect(oidc.logout).toHaveBeenCalledTimes(0);
  });

  test('skip link moves the focus to the content', async () => {
    nockPetCount(12);

    renderApp('/pet');

    await screen.findByRole('link', { name: 'Pets (12 total)' });

    const main = screen.getByRole('main');

    // not focused on the initial load
    expect(document.activeElement).not.toBe(main);

    await userEvent.tab();

    const skipLink = screen.getByRole('link', { name: 'Skip to content' });

    expect(document.activeElement).toBe(skipLink);

    await userEvent.click(skipLink);

    expect(document.activeElement).toBe(main);
  });

  test('navigating to another page moves the focus to the content, query changes do not', async () => {
    nockPetCount(12);

    renderApp('/pet');

    await screen.findByRole('link', { name: 'Pets (12 total)' });

    const main = screen.getByRole('main');
    const pets = screen.getByRole('link', { name: 'Pets (12 total)' });

    // same path: the focus stays
    await userEvent.click(pets);

    expect(document.activeElement).toBe(pets);

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(document.activeElement).toBe(main);
  });

  test('logout', async () => {
    nockPetCount(12);

    renderApp();

    await userEvent.click(await screen.findByRole('button', { name: 'Log out' }));

    expect(oidc.login).toHaveBeenCalledTimes(0);
    expect(oidc.logout).toHaveBeenCalledTimes(1);
  });

  test('authentication error', async () => {
    // oxlint-disable functional/immutable-data
    oidc.isAuthenticated = false;
    oidc.error = new Error('invalid_grant');
    // oxlint-enable functional/immutable-data

    renderApp();

    expect((await screen.findByTestId('http-error')).textContent).toBe('Authentication failedinvalid_grant');
    expect(screen.getByTestId('login-required')).toBeTruthy();
  });

  test('error of the page on top of the content', async () => {
    nockPetCount(12);

    // oxlint-disable-next-line functional/immutable-data
    page.httpError = new InternalServerError({ title: 'Internal Server Error' });

    renderApp();

    expect((await screen.findByTestId('http-error')).textContent).toBe('500 Internal Server Error');
    expect(screen.getByTestId('content').firstElementChild).toBe(screen.getByTestId('http-error'));
  });

  test('authentication error hides the errors of the page caused by it', async () => {
    nockPetCount(12);

    // oxlint-disable functional/immutable-data
    oidc.error = new Error('Failed to fetch');
    page.httpError = new NetworkError({ title: 'Failed to fetch' });
    // oxlint-enable functional/immutable-data

    renderApp();

    await screen.findByTestId('routes-mock');

    expect(screen.getAllByTestId('http-error').map((element) => element.textContent)).toEqual([
      'Authentication failedFailed to fetch',
    ]);
  });

  test('authentication error first, followed by an error of the page not caused by it', async () => {
    nockPetCount(12);

    // oxlint-disable functional/immutable-data
    oidc.error = new Error('Failed to fetch');
    page.httpError = new InternalServerError({ title: 'Internal Server Error' });
    // oxlint-enable functional/immutable-data

    renderApp();

    await screen.findByTestId('routes-mock');

    expect(screen.getAllByTestId('http-error').map((element) => element.textContent)).toEqual([
      'Authentication failedFailed to fetch',
      '500 Internal Server Error',
    ]);
  });
});
