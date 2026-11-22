import { useRef, useState } from 'react';

export type ListKeys = {
  // stable key per row: use as react key, it stays with its row when rows get added / removed
  keys: Array<number>;
  add: () => void;
  remove: (i: number) => void;
  // call on submit: remembers the order of the rows as sent to the server
  submit: () => void;
  // index of row i in the last submit (-1 if added since), to find its errors (e.g. `vaccinations[${index}][name]`)
  submittedIndex: (i: number) => number;
};

// the server reports errors by the index in the submitted list: removing a row would move them to the next row
export const useListKeys = (initialLength: number): ListKeys => {
  const nextKey = useRef(initialLength);
  const [keys, setKeys] = useState<Array<number>>(() => Array.from({ length: initialLength }, (_, i) => i));
  const [submittedKeys, setSubmittedKeys] = useState<Array<number>>(keys);

  return {
    keys,
    add: () => {
      // oxlint-disable-next-line functional/immutable-data
      const key = nextKey.current++;
      setKeys((current) => [...current, key]);
    },
    remove: (i) => setKeys((current) => current.filter((_, y) => y !== i)),
    submit: () => setSubmittedKeys(keys),
    submittedIndex: (i) => submittedKeys.indexOf(keys[i]),
  };
};
