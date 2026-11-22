import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { cx } from './class-names';

export type SortDirection = 'asc' | 'desc';

type Align = 'left' | 'right';

const alignClasses: Record<Align, string> = { left: 'text-left', right: 'text-right' };

const sortArrows = { asc: '↑', desc: '↓', none: '↕' };

const ariaSorts = { asc: 'ascending', desc: 'descending' } as const;

// stacked: the rows are shown as cards (one below the other) if the table is narrower than 48rem (container query)
const StackedContext = createContext<boolean>(false);

// the rows of the head are not shown as cards
const HeadContext = createContext<boolean>(false);

export type TableProps = React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> & {
  // rows as cards on narrow screens instead of scrolling horizontally, use the `label` of the cells
  stackOnNarrow?: boolean;
};

// scrolls horizontally instead of squeezing the columns on small screens (unless stacked)
export const Table: FC<TableProps> = ({ stackOnNarrow = false, className, ...props }: TableProps) => {
  return (
    <StackedContext.Provider value={stackOnNarrow}>
      <div className={cx('overflow-x-auto', stackOnNarrow && '@container')}>
        <table
          {...props}
          className={cx(
            'w-full border-collapse text-left',
            className,
            stackOnNarrow && '@max-3xl:block @max-3xl:min-w-0',
          )}
        />
      </div>
    </StackedContext.Provider>
  );
};

type SectionProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;

export const Thead: FC<SectionProps> = ({ className, ...props }: SectionProps) => {
  const stacked = useContext(StackedContext);

  return (
    <HeadContext.Provider value={true}>
      <thead {...props} className={cx('bg-surface-muted', stacked && '@max-3xl:block', className)} />
    </HeadContext.Provider>
  );
};

export const Tbody: FC<SectionProps> = ({ className, ...props }: SectionProps) => {
  const stacked = useContext(StackedContext);

  return <tbody {...props} className={cx(stacked && '@max-3xl:block', className)} />;
};

export type TrProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

// "group" lets the cells highlight the whole row on hover
export const Tr: FC<TrProps> = ({ className, ...props }: TrProps) => {
  const stacked = useContext(StackedContext);
  const head = useContext(HeadContext);

  return (
    <tr
      {...props}
      className={cx(
        'group',
        stacked &&
          (head
            ? '@max-3xl:flex'
            : 'border-line @max-3xl:hover:bg-row-hover @max-3xl:flex @max-3xl:flex-col @max-3xl:gap-2 @max-3xl:border-b @max-3xl:px-4 @max-3xl:py-3.5'),
        className,
      )}
    />
  );
};

export type ThProps = React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> & {
  align?: Align;
  // column only as wide as its content, the remaining width goes to the other columns
  shrink?: boolean;
  // makes the header a sort toggle, `sort` is the current direction of this column (undefined: not sorted)
  // stacked: the only headers shown (the cells have their own labels)
  onSort?: () => void;
  sort?: SortDirection;
};

export const Th: FC<ThProps> = ({ align = 'left', shrink, onSort, sort, className, children, ...props }: ThProps) => {
  const stacked = useContext(StackedContext);

  return (
    <th
      scope="col"
      aria-sort={onSort && sort ? ariaSorts[sort] : undefined}
      {...props}
      className={cx(
        'border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold',
        alignClasses[align],
        shrink && 'w-px whitespace-nowrap',
        stacked && (onSort ? '@max-3xl:block @max-3xl:grow' : '@max-3xl:hidden'),
        className,
      )}
    >
      {onSort ? (
        <button type="button" className="text-fg-secondary hover:text-fg p-0 font-semibold" onClick={onSort}>
          {children} <span aria-hidden="true">{sortArrows[sort ?? 'none']}</span>
        </button>
      ) : (
        children
      )}
    </th>
  );
};

export type TdProps = React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> & {
  align?: Align;
  // less padding, for cells holding buttons
  compact?: boolean;
  nowrap?: boolean;
  // stacked: shown in front of the value (the column headers are hidden), empty cells are hidden
  label?: string;
  children?: ReactNode;
};

export const Td: FC<TdProps> = ({ align = 'left', compact, nowrap, label, className, children, ...props }: TdProps) => {
  const stacked = useContext(StackedContext);
  const empty = children === undefined || children === null || children === false;

  return (
    <td
      {...props}
      className={cx(
        'border-line group-hover:bg-row-hover border-b',
        compact ? 'px-3 py-2' : 'px-4 py-3',
        alignClasses[align],
        nowrap && 'whitespace-nowrap',
        stacked &&
          (empty
            ? '@max-3xl:hidden'
            : '@max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent'),
        className,
      )}
    >
      {stacked && label && !empty ? (
        <span className="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline">{label}</span>
      ) : null}
      {children}
    </td>
  );
};
