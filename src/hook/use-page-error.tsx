import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { HttpError } from '../client/error';

export type PageHttpError = {
  httpError: HttpError;
  // true for errors of actions (e.g. save, delete): the focus moves to the error, so it's noticed
  focus: boolean;
};

type PageErrorContextValue = {
  pageError: PageHttpError | undefined;
  setPageError: (pageError: PageHttpError | undefined) => void;
};

const PageErrorContext = createContext<PageErrorContextValue | undefined>(undefined);

export const PageErrorProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  const [pageError, setPageError] = useState<PageHttpError | undefined>(undefined);

  return <PageErrorContext.Provider value={{ pageError, setPageError }}>{children}</PageErrorContext.Provider>;
};

const usePageErrorContext = (): PageErrorContextValue => {
  const context = useContext(PageErrorContext);

  if (!context) {
    throw new Error('usePageError must be used within a PageErrorProvider');
  }

  return context;
};

// reports the error of the current page, shown in one place on top of the content (see PageError),
// cleared when it's gone or the page is left
export const usePageError = (
  httpError: HttpError | null | undefined,
  { focus = false }: { focus?: boolean } = {},
): void => {
  const { setPageError } = usePageErrorContext();

  useEffect(() => {
    setPageError(httpError ? { httpError, focus } : undefined);

    return () => setPageError(undefined);
  }, [setPageError, httpError, focus]);
};

export const useCurrentPageError = (): PageHttpError | undefined => usePageErrorContext().pageError;
