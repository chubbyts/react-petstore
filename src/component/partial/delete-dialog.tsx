import type { FC } from 'react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';

// the element the app is rendered into (see index.html), made inert while the dialog is open
export const appRootId = 'root';

// the content, focused if the element that opened the dialog is gone (e.g. the deleted row)
export const mainId = 'main';

export type DeleteDialogProps = {
  name: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteDialog: FC<DeleteDialogProps> = ({ name, isPending, onCancel, onConfirm }: DeleteDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // modal: the app behind can't be reached (tab, pointer, screen readers), focus starts on the safe choice
  // and returns to the element that opened the dialog when it closes
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const appRoot = document.getElementById(appRootId);

    appRoot?.setAttribute('inert', '');
    cancelRef.current?.focus();

    return () => {
      appRoot?.removeAttribute('inert');

      if (opener?.isConnected) {
        opener.focus();
      } else {
        document.getElementById(mainId)?.focus();
      }
    };
  }, []);

  // on the document: also works if the focus left the dialog (e.g. a click on the backdrop)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return createPortal(
    <div className="bg-overlay fixed inset-0 z-40 flex items-start justify-center px-4 pt-40 pb-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-testid="delete-dialog"
        className="rounded-dialog border-line-overlay bg-surface flex w-full max-w-[420px] flex-col gap-3 border p-[22px] shadow-(--dialog-shadow)"
      >
        <h2 id={titleId} className="m-0 text-xl font-bold">
          Delete {name}?
        </h2>
        <p id={descriptionId} className="text-fg-muted m-0">
          This can’t be undone.
        </p>
        <div className="flex justify-end gap-2 pt-1.5">
          <Button ref={cancelRef} data-testid="delete-dialog-cancel" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button data-testid="delete-dialog-confirm" variant="danger" disabled={isPending} onClick={onConfirm}>
            Delete pet
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
