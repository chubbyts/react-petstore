import type { FC } from 'react';
import { formatDateTime } from '../format';

// machine readable value for assistive technology and browser tools, formatted in the browser's time zone
export const DateTime: FC<{ value: string }> = ({ value }: { value: string }) => (
  <time dateTime={value}>{formatDateTime(value)}</time>
);
