import { afterEach, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeSwitch } from '../../../src/component/partial/theme-switch';
import { formatHtml } from '../../formatter';

describe('theme-switch', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  test('switches the theme', async () => {
    const { container } = render(<ThemeSwitch />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
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
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path></svg
            >Dark
          </button>
        </div>
      </div>
      "
    `);

    const group = screen.getByRole('group', { name: 'Theme' });

    expect(group).toBeTruthy();
    expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await userEvent.click(screen.getByRole('button', { name: 'Light' }));

    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'System' }).getAttribute('aria-pressed')).toBe('false');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
