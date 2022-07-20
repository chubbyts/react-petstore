import { throwableToError } from '../src/throwable-to-error';
import { describe, test, expect } from 'vitest';

describe('throwableToError', () => {
  it('do not convert', () => {
    const error = new Error('example');
    expect(throwableToError(error)).toBe(error);
  });

  test.each([
    { e: undefined, error: { name: 'undefined', message: 'undefined' } },
    { e: null, error: { name: 'object', message: 'null' } },
    { e: true, error: { name: 'boolean', message: 'true' } },
    { e: false, error: { name: 'boolean', message: 'false' } },
    { e: 42, error: { name: 'number', message: '42' } },
    { e: 3.14159, error: { name: 'number', message: '3.14159' } },
    { e: 'example', error: { name: 'string', message: 'example' } },
    { e: () => null, error: { name: 'function', message: '() => null' } },
    {
      e: { key: 'value' },
      error: { name: 'object', message: '{"key":"value"}' },
    },
    {
      e: new Array('example'),
      error: { name: 'object', message: '["example"]' },
    },
  ])(`converts $e to error`, ({ e, error }) => {
    expect(throwableToError(e)).toMatchObject(error);
  });
});
