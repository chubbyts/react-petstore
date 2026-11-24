import { afterEach, describe, expect, test } from 'vitest';
import { formatDateTime } from '../src/format';

const defaultTimeZone = process.env.TZ;

describe('format', () => {
  afterEach(() => {
    // oxlint-disable-next-line functional/immutable-data
    process.env.TZ = defaultTimeZone;
  });

  test('formatDateTime in the local time zone, with daylight saving', () => {
    expect(formatDateTime('2026-11-02T08:04:00Z')).toBe('2 Nov 2026, 09:04');
    expect(formatDateTime('2005-08-15T15:52:01+00:00')).toBe('15 Aug 2005, 17:52');
    // 23:30 UTC is already the next day in Zurich
    expect(formatDateTime('2026-11-02T23:30:00Z')).toBe('3 Nov 2026, 00:30');
  });

  test('unparsable: as received', () => {
    expect(formatDateTime('not a date')).toBe('not a date');
  });

  test('other time zones', () => {
    // oxlint-disable-next-line functional/immutable-data
    process.env.TZ = 'America/New_York';

    expect(formatDateTime('2026-11-02T03:30:00Z')).toBe('1 Nov 2026, 22:30');
    expect(formatDateTime('2005-08-15T15:52:01+00:00')).toBe('15 Aug 2005, 11:52');

    // oxlint-disable-next-line functional/immutable-data
    process.env.TZ = 'UTC';

    expect(formatDateTime('2026-11-02T08:04:00Z')).toBe('2 Nov 2026, 08:04');
  });
});
