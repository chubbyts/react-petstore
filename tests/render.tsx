import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../src/hook/use-toast';
import { PageErrorProvider } from '../src/hook/use-page-error';
import { PageError } from '../src/component/partial/page-error';

export const renderRoute = ({
  path,
  url,
  element,
  routes,
}: {
  path: string;
  // several: the history, the last one is the current
  url: string | Array<string>;
  element: ReactElement;
  routes?: ReactNode;
}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={Array.isArray(url) ? url : [url]}>
          <ToastProvider>
            {/* like in the app: the error of the page is shown on top of it */}
            <PageErrorProvider>
              <PageError />
              <Routes>
                <Route path={path} element={element} />
                {routes}
              </Routes>
            </PageErrorProvider>
          </ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
};
