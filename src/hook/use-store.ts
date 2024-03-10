import { useState } from 'react';

export const useStore = <T extends { [key: string]: unknown }>(
  initialData: T,
): [T, (name: keyof T, value: T[keyof T]) => void] => {
  const [store, replaceStore] = useState<T>(initialData);

  const setStore = (name: keyof T, value: T[keyof T]): void => {
    replaceStore({ ...store, [name]: value });
  };

  return [store, setStore];
};
