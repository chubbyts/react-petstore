import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import { useState } from 'react';
import { userEvent } from '@testing-library/user-event';
import { BadRequest, NetworkError } from '../../src/client/error';
import type { HttpError } from '../../src/client/error';
import { PageErrorProvider, useCurrentPageError, usePageError } from '../../src/hook/use-page-error';

const CurrentPageError = () => {
  const pageError = useCurrentPageError();

  return (
    <span data-testid="current">{pageError ? `${pageError.httpError.title} ${String(pageError.focus)}` : 'none'}</span>
  );
};

type Options = Parameters<typeof usePageError>[1];

const Page = ({ httpError, options }: { httpError?: HttpError; options?: Options }) => {
  usePageError(httpError, options);

  return null;
};

const App = ({ httpError, options }: { httpError?: HttpError; options?: Options }) => {
  const [showPage, setShowPage] = useState(true);

  return (
    <PageErrorProvider>
      <CurrentPageError />
      {showPage ? <Page httpError={httpError} options={options} /> : null}
      <button onClick={() => setShowPage(false)}>leave</button>
    </PageErrorProvider>
  );
};

describe('use-page-error', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('without provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => usePageError(undefined))).toThrow(
      'usePageError must be used within a PageErrorProvider',
    );
    expect(() => renderHook(useCurrentPageError)).toThrow('usePageError must be used within a PageErrorProvider');
  });

  test('without error', () => {
    render(<App />);

    expect(screen.getByTestId('current').textContent).toBe('none');
  });

  test('reports the error, replaces it and clears it when the page is left', async () => {
    const { rerender } = render(<App httpError={new NetworkError({ title: 'Failed to fetch' })} />);

    // default: don't move the focus
    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');

    rerender(<App httpError={new BadRequest({ title: 'Bad Request' })} options={{ focus: true }} />);

    expect(screen.getByTestId('current').textContent).toBe('Bad Request true');

    rerender(<App />);

    expect(screen.getByTestId('current').textContent).toBe('none');

    rerender(<App httpError={new NetworkError({ title: 'Failed to fetch' })} />);

    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');

    await userEvent.click(screen.getByRole('button', { name: 'leave' }));

    expect(screen.getByTestId('current').textContent).toBe('none');
  });
});
