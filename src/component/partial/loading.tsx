import type { FC } from 'react';

// nothing visible (the page appears when loaded), but screen readers get told something is happening
export const Loading: FC = () => (
  <p role="status" data-testid="loading" className="sr-only">
    Loading…
  </p>
);
