import type { FC } from 'react';
import { DateTime } from './date-time';
import { cx } from './class-names';

type DivProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const cardClasses = 'flex flex-col rounded-xl border border-line bg-surface';

export const Card: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
  return <section {...props} className={cx(cardClasses, className)} />;
};

// cards use 18px (4.5) spacing all around: body, footer text and footer buttons
export const CardBody: FC<DivProps> = ({ className, ...props }: DivProps) => {
  return <div {...props} className={cx('flex flex-col gap-5 p-4.5', className)} />;
};

export const CardFooter: FC<DivProps> = ({ className, ...props }: DivProps) => {
  return (
    <div
      {...props}
      className={cx(
        'border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5',
        className,
      )}
    />
  );
};

export type MetaProps = { id: string; createdAt: string; updatedAt?: string | null };

export const Meta: FC<MetaProps> = ({ id, createdAt, updatedAt }: MetaProps) => {
  return (
    // 3 × 14px lines + 2 × 1px gaps = 44px, the height of the footer buttons, so both get the same spacing
    <div className="text-fg-muted flex min-w-0 flex-col gap-px text-[13px] leading-4">
      <span className="break-all">ID: {id}</span>
      <span>
        Created: <DateTime value={createdAt} />
      </span>
      <span>Last updated: {updatedAt ? <DateTime value={updatedAt} /> : 'Never'}</span>
    </div>
  );
};
