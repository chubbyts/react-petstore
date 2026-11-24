import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast | undefined>(undefined);

// long enough to read a short message (also for slower readers)
export const toastDuration = 5000;

export const ToastProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  // wrapped in an object so showing the same message twice restarts the timer
  const [toast, setToast] = useState<{ message: string } | undefined>(undefined);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = setTimeout(() => setToast(undefined), toastDuration);

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <ToastContext.Provider value={(message: string) => setToast({ message })}>
      {children}
      {/* outside of the app root, which is inert while a dialog is open (e.g. the "Deleted …" message) */}
      {createPortal(
        <div role="status" className="pointer-events-none fixed right-6 bottom-6 z-50">
          {toast ? (
            <div
              data-testid="toast"
              className="rounded-control border-line-overlay bg-surface-hover text-fg border px-4 py-3 text-sm shadow-(--toast-shadow)"
            >
              {toast.message}
            </div>
          ) : null}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ShowToast => {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return showToast;
};
