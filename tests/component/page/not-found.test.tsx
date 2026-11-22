import { test, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../../src/component/page/not-found';
import { formatHtml } from '../../formatter';

describe('not-found', () => {
  test('default', async () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    await screen.findByTestId('page-not-found');

    expect(document.title).toBe('Not Found – Petstore Admin');
    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-not-found" class="flex flex-col gap-[22px]">
          <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="text-fg-muted text-sm">404</span>
              <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">
                Not Found
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
          <p class="text-fg-muted m-0">There is no page at this address.</p>
        </div>
      </div>
      "
    `);
  });
});
