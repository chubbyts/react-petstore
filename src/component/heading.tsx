import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from './class-names';

export const H1: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>> = ({
  className,
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => {
  return <h1 {...props} className={cx('m-0 text-[26px] font-bold tracking-[-0.01em] break-words', className)} />;
};

export type BreadcrumbItem = { label: string; to?: string };

export const Breadcrumb: FC<{ items: Array<BreadcrumbItem> }> = ({ items }: { items: Array<BreadcrumbItem> }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-fg-muted text-sm">
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.to ? (
              <Link to={item.to} className="text-fg-muted hover:text-fg no-underline hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-fg">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: string;
  action?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({ eyebrow, title, action }: PageHeaderProps) => {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow ? <span className="text-fg-muted text-sm">{eyebrow}</span> : null}
        <H1>{title}</H1>
      </div>
      {action}
    </header>
  );
};
