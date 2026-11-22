import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { buttonClasses } from '../button';
import { cx } from '../class-names';

// e.g. "Showing 11–12 of 12", "No results" if there is nothing to show
export const formatRange = (offset: number, limit: number, count: number): string => {
  if (count === 0) {
    return 'No results';
  }

  return `Showing ${offset + 1}–${Math.min(offset + limit, count)} of ${count}`;
};

// up to maxPages page numbers around the current page, sorted ascending
export const calculatePages = (currentPage: number, totalPages: number, maxPages: number): Array<number> => {
  if (totalPages <= 1 || maxPages <= 1 || currentPage > totalPages) {
    return [];
  }

  const pages = [currentPage];

  // oxlint-disable-next-line functional/no-let
  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      // oxlint-disable-next-line functional/immutable-data
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      // oxlint-disable-next-line functional/immutable-data
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  // oxlint-disable-next-line functional/immutable-data
  pages.sort((a, b) => a - b);

  return pages;
};

type PageLinkProps = {
  'data-testid': string;
  to: string;
  label: string;
  current?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

// always the same element (also when disabled), so it keeps the keyboard focus when the page changes
const PageLink: FC<PageLinkProps> = ({
  'data-testid': dataTestId,
  to,
  label,
  current,
  disabled,
  children,
}: PageLinkProps) => (
  <li>
    <Link
      data-testid={dataTestId}
      to={to}
      aria-label={label}
      title={label}
      aria-current={current ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      // out of the tab order when disabled, but still focusable so the focus is not lost
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      className={cx(
        buttonClasses({ variant: current ? 'primary' : 'secondary', size: 'sm' }),
        // windows high contrast removes backgrounds: keep the current page recognizable
        current && 'forced-colors:outline forced-colors:outline-2',
        'min-w-9',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {children}
    </Link>
  </li>
);

export type PaginationProps = {
  // as returned by the list endpoints
  offset: number;
  limit: number;
  count: number;
  // url of a (1-based) page, the pages are links: they can be opened in a new tab, bookmarked and shared
  pageTo: (page: number) => string;
  // max number of page links
  maxPages?: number;
};

export const Pagination: FC<PaginationProps> = ({ offset, limit, count, pageTo, maxPages = 7 }: PaginationProps) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  const pages = calculatePages(currentPage, totalPages, maxPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
    >
      {/* announced by screen readers when the page (or filter) changes */}
      <span aria-live="polite" aria-atomic="true" className="text-fg-muted text-sm">
        {formatRange(offset, limit, count)}
      </span>
      {pages.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <PageLink data-testid="pagination-first" to={pageTo(1)} label="First page" disabled={isFirst}>
            <span aria-hidden="true">«</span>
          </PageLink>
          <PageLink
            data-testid="pagination-previous"
            to={pageTo(Math.max(1, currentPage - 1))}
            label="Previous page"
            disabled={isFirst}
          >
            <span aria-hidden="true">‹</span>
          </PageLink>
          {pages.map((page) => (
            <PageLink
              key={page}
              data-testid={`pagination-page-${page}`}
              to={pageTo(page)}
              label={`Page ${page}`}
              current={page === currentPage}
            >
              {page}
            </PageLink>
          ))}
          <PageLink
            data-testid="pagination-next"
            to={pageTo(Math.min(totalPages, currentPage + 1))}
            label="Next page"
            disabled={isLast}
          >
            <span aria-hidden="true">›</span>
          </PageLink>
          <PageLink data-testid="pagination-last" to={pageTo(totalPages)} label="Last page" disabled={isLast}>
            <span aria-hidden="true">»</span>
          </PageLink>
        </ul>
      ) : null}
    </nav>
  );
};
