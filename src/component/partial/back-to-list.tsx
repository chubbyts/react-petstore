import type { FC } from 'react';
import { AnchorButton } from '../button';
import { ArrowLeftIcon } from '../icon';

export const BackToList: FC<{ to: string }> = ({ to }: { to: string }) => (
  <AnchorButton data-testid="back-to-list" to={to} variant="secondary">
    <ArrowLeftIcon />
    Back to list
  </AnchorButton>
);
