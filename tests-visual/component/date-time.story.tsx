import type { FC } from 'react';
import { DateTime } from '../../src/component/date-time';

// in the browser's time zone (Europe/Zurich, see flashwright.config.ts)
export const DateTimeStory: FC = () => (
  <ul className="m-0 flex list-none flex-col gap-1 p-0">
    <li>
      <DateTime value="2026-11-02T08:14:00+00:00" />
    </li>
    <li>
      <DateTime value="2026-07-31T23:05:00+00:00" />
    </li>
    <li>
      {/* unparsable: as received */}
      <DateTime value="not a date" />
    </li>
  </ul>
);
