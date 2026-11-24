import { useEffect } from 'react';

export const appName = 'Petstore Admin';

// the title identifies the page and the app (browser tabs, history, announced by screen readers)
export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    // oxlint-disable-next-line functional/immutable-data
    document.title = `${title} – ${appName}`;
  }, [title]);
};
