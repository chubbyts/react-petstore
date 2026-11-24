import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { themeStorageKey, useTheme } from '../../src/hook/use-theme';

const createMedia = (matches: boolean) => {
  const listeners = new Set<() => void>();

  const media = {
    matches,
    addEventListener: vi.fn((_: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: () => void) => listeners.delete(listener)),
    change: (newMatches: boolean) => {
      // oxlint-disable-next-line functional/immutable-data
      media.matches = newMatches;
      listeners.forEach((listener) => listener());
    },
    listeners,
  };

  vi.spyOn(window, 'matchMedia').mockReturnValue(media as unknown as MediaQueryList);

  return media;
};

const theme = () => document.documentElement.getAttribute('data-theme');

describe('use-theme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('system preference follows the system setting', () => {
    const media = createMedia(true);

    const { result, unmount } = renderHook(useTheme);

    expect(result.current[0]).toBe('system');
    expect(theme()).toBe('light');
    expect(window.localStorage.getItem(themeStorageKey)).toBeNull();

    act(() => media.change(false));

    expect(theme()).toBe('dark');

    unmount();

    expect(media.listeners.size).toBe(0);
  });

  test('explicit choice is applied, stored and ignores the system setting', () => {
    const media = createMedia(false);

    const { result } = renderHook(useTheme);

    act(() => result.current[1]('light'));

    expect(result.current[0]).toBe('light');
    expect(theme()).toBe('light');
    expect(window.localStorage.getItem(themeStorageKey)).toBe('light');
    expect(media.listeners.size).toBe(0);

    act(() => media.change(false));

    expect(theme()).toBe('light');

    act(() => result.current[1]('dark'));

    expect(theme()).toBe('dark');
    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');

    act(() => result.current[1]('system'));

    expect(theme()).toBe('dark');
    expect(window.localStorage.getItem(themeStorageKey)).toBeNull();
    expect(media.listeners.size).toBe(1);
  });

  test('restores a stored choice and ignores invalid values', () => {
    createMedia(false);

    window.localStorage.setItem(themeStorageKey, 'light');

    expect(renderHook(useTheme).result.current[0]).toBe('light');
    expect(theme()).toBe('light');

    window.localStorage.setItem(themeStorageKey, 'purple');

    expect(renderHook(useTheme).result.current[0]).toBe('system');
  });

  test('works without storage', () => {
    createMedia(true);

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });

    const { result } = renderHook(useTheme);

    expect(result.current[0]).toBe('system');
    expect(theme()).toBe('light');

    act(() => result.current[1]('dark'));

    expect(theme()).toBe('dark');
  });
});
