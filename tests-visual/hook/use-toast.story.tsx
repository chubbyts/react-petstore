import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useToast } from '../../src/hook/use-toast';

// rendered into the body (portal): see the whole page
export const ToastStory: FC = () => {
  const showToast = useToast();
  const shown = useRef(false);

  // once: showToast is a new function on every render of the provider, showing it again would loop
  useEffect(() => {
    if (shown.current) {
      return;
    }

    // oxlint-disable-next-line functional/immutable-data
    shown.current = true;
    showToast('Created “Brownie” — 201 Created');
  }, [showToast]);

  return <p className="m-0">The page behind the toast.</p>;
};
