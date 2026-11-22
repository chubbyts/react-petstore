import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import { ToastProvider, toastDuration, useToast } from '../../src/hook/use-toast';

const ShowToast = ({ message }: { message: string }) => {
  const showToast = useToast();

  return (
    <button type="button" onClick={() => showToast(message)}>
      show
    </button>
  );
};

describe('use-toast', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('without provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(useToast)).toThrow('useToast must be used within a ToastProvider');
  });

  test('shows and hides the toast', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ShowToast message="Saved “Brownie” — 200 OK" />
      </ToastProvider>,
    );

    expect(screen.getByRole('status').textContent).toBe('');

    act(() => screen.getByRole('button').click());

    expect(screen.getByRole('status').textContent).toBe('Saved “Brownie” — 200 OK');

    act(() => vi.advanceTimersByTime(toastDuration - 1));

    // showing it again restarts the timer
    act(() => screen.getByRole('button').click());
    act(() => vi.advanceTimersByTime(toastDuration - 1));

    expect(screen.getByRole('status').textContent).toBe('Saved “Brownie” — 200 OK');

    act(() => vi.advanceTimersByTime(1));

    expect(screen.getByRole('status').textContent).toBe('');
  });
});
