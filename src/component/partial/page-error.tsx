import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import type { HttpError } from '../../client/error';
import { NetworkError, Unauthorized } from '../../client/error';
import { useCurrentPageError } from '../../hook/use-page-error';
import { HttpError as HttpErrorPartial } from './http-error';

// errors of the page that are most likely caused by an authentication error, and would only repeat it
const isConsequenceOfAuthenticationError = (httpError: HttpError): boolean =>
  httpError instanceof Unauthorized || httpError instanceof NetworkError;

export type PageErrorProps = {
  // e.g. authentication failed: shown first, the error of the page is only shown if it's not caused by it
  httpError?: HttpError;
};

// the errors in one place: on top of the content
export const PageError: FC<PageErrorProps> = ({ httpError }: PageErrorProps) => {
  const currentPageError = useCurrentPageError();
  const pageError =
    currentPageError && !(httpError && isConsequenceOfAuthenticationError(currentPageError.httpError))
      ? currentPageError
      : undefined;

  const pageErrorRef = useRef<HTMLDivElement>(null);

  // errors of actions (e.g. save) get the focus (and are scrolled into view), so they're noticed,
  // unless the focus is on an invalid field already (moved there by the form)
  useEffect(() => {
    if (pageError?.focus && !document.activeElement?.matches('[aria-invalid="true"]')) {
      pageErrorRef.current?.focus();
    }
  }, [pageError]);

  return (
    <>
      {httpError ? <HttpErrorPartial httpError={httpError} /> : null}
      {pageError ? (
        <HttpErrorPartial
          ref={pageErrorRef}
          // focusable by script only, not in the tab order: it's not interactive
          tabIndex={pageError.focus ? -1 : undefined}
          httpError={pageError.httpError}
        />
      ) : null}
    </>
  );
};
