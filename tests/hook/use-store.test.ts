import { expect, test } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from '../../src/hook/use-store';

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
    result.current[1]('key2', 'value22');
  });

  expect(result.current[0]).toEqual({ ...dummy, key2: 'value22' });
});
