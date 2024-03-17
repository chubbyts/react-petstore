import { useState } from 'react';

export const useStore = <T extends { [key: string]: unknown }>(
  initialData: T,
): [T, (name: keyof T, value: T[keyof T]) => void] => {
  const [store, setStore] = useState<T>(initialData);

  const setStoreValueByName = (name: keyof T, value: T[keyof T]): void => {
    setStore({ ...store, [name]: value });
  };

  return [store, setStoreValueByName];
};
