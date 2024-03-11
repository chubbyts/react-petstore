import { expect, test } from 'vitest';
import { useStore } from '../../src/hook/use-store';
import { renderHook, act } from '@testing-library/react';

type Dummy = {
  key1: string;
  key2: string;
  key3: string;
};

test('useStore', async () => {
  const dummy: Dummy = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  };

  const { result } = renderHook(() => useStore<Dummy>(dummy));

  expect(result.current[0]).toEqual(dummy);

  act(() => {
    result.current[2]('key2', 'value22');
  });

  expect(result.current[0]).toEqual({ ...dummy, key2: 'value22' });

  act(() => {
    result.current[1]({ ...dummy, key3: 'value33' });
  });

  expect(result.current[0]).toEqual({ ...dummy, key3: 'value33' });
});
