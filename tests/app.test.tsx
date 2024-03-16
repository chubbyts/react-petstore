// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { test, expect, vi } from 'vitest';
import { formatHtml } from './formatter';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app';
import { userEvent } from '@testing-library/user-event';

vi.mock('../src/routes', () => {
  return {
    default: () => <div data-testid="routes-mock" />,
  };
});

test('close navigation', async () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  await screen.findByTestId('routes-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl font-semibold uppercase leading-relaxed text-gray-100"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a aria-current="page" class="hover:text-gray-500 active" href="/"
            >Petstore</a
          >
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a
                data-testid="navigation-pet"
                class="block px-4 py-2 text-gray-900 bg-gray-300 hover:bg-gray-400"
                href="/pet"
                >Pets</a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="routes-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
});

test('open navigation', async () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  const navigationToggle = await screen.findByTestId('navigation-toggle');

  await userEvent.click(navigationToggle);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl font-semibold uppercase leading-relaxed text-gray-100"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a aria-current="page" class="hover:text-gray-500 active" href="/"
            >Petstore</a
          >
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 block"
        >
          <ul>
            <li>
              <a
                data-testid="navigation-pet"
                class="block px-4 py-2 text-gray-900 bg-gray-300 hover:bg-gray-400"
                href="/pet"
                >Pets</a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-0">
          <div data-testid="routes-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
});

test('pet list', async () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/pet']}>
      <App />
    </MemoryRouter>,
  );

  await screen.findByTestId('routes-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl font-semibold uppercase leading-relaxed text-gray-100"
        >
          <button
            class="float-right block border-2 p-2 md:hidden"
            data-testid="navigation-toggle"
          >
            <span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-2 w-6 border-t-2"></span
            ><span class="block h-0 w-6 border-t-2"></span></button
          ><a class="hover:text-gray-500" href="/">Petstore</a>
        </nav>
        <nav
          class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden"
        >
          <ul>
            <li>
              <a
                data-testid="navigation-pet"
                aria-current="page"
                class="block px-4 py-2 text-gray-100 bg-gray-700 hover:bg-gray-600"
                href="/pet"
                >Pets</a
              >
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16">
          <div data-testid="routes-mock"></div>
        </div>
      </div>
    </div>
    "
  `);
});
