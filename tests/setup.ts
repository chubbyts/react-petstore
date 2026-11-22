// dates are shown in the browser's time zone, pin it so the tests do not depend on the machine running them
// oxlint-disable-next-line functional/immutable-data
process.env.TZ = 'Europe/Zurich';

import { vi } from 'vitest';

// jsdom does not implement matchMedia, default to a system without a light preference
if (!window.matchMedia) {
  // oxlint-disable-next-line functional/immutable-data
  window.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
