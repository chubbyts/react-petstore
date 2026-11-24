import type { FC } from 'react';
import { DeleteDialog } from '../../../src/component/partial/delete-dialog';

const noop = () => {};

// rendered into the body (portal): see the whole page
export const DeleteDialogStory: FC = () => (
  <>
    <p className="m-0">The page behind the dialog.</p>
    <DeleteDialog name="Brownie" isPending={false} onCancel={noop} onConfirm={noop} />
  </>
);
