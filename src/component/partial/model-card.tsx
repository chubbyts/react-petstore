import type { FC, ReactNode } from 'react';
import { useId } from 'react';
import { AnchorButton } from '../button';
import { Card, CardBody, CardFooter } from '../card';
import { PlusIcon } from '../icon';

export type ModelCardProps = {
  'data-testid'?: string;
  icon: ReactNode;
  title: string;
  description: string;
  count?: number;
  countLabel: (count: number) => string;
  listTo: string;
  createTo?: string;
  createLabel: string;
};

export const ModelCard: FC<ModelCardProps> = ({
  'data-testid': dataTestId,
  icon,
  title,
  description,
  count,
  countLabel,
  listTo,
  createTo,
  createLabel,
}: ModelCardProps) => {
  const titleId = useId();

  return (
    <Card data-testid={dataTestId} aria-labelledby={titleId}>
      <CardBody>
        <div className="flex items-center gap-3">
          <span className="bg-nav-active text-link-hover rounded-control flex size-10 shrink-0 items-center justify-center">
            {icon}
          </span>
          <h2 id={titleId} className="m-0 min-w-0 text-lg font-semibold">
            {title}
          </h2>
        </div>
        <p className="text-fg-muted m-0">{description}</p>
        <p className="m-0 flex items-baseline gap-2">
          <strong className="text-[26px] font-bold tracking-[-0.01em]">{count ?? '—'}</strong>
          {count !== undefined ? <span className="text-fg-muted">{countLabel(count)}</span> : null}
        </p>
      </CardBody>
      <CardFooter>
        <AnchorButton aria-label={`View all ${title.toLowerCase()}`} to={listTo} variant="secondary" size="sm">
          View all
        </AnchorButton>
        {createTo ? (
          <AnchorButton to={createTo} variant="primary" size="sm">
            <PlusIcon strokeWidth={2.2} />
            {createLabel}
          </AnchorButton>
        ) : null}
      </CardFooter>
    </Card>
  );
};
