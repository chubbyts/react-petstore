import type { FC } from 'react';

const calculatePages = (currentPage: number, totalPages: number, maxPages: number) => {
  if (totalPages <= 1 || maxPages <= 1 || currentPage > totalPages) {
    return [];
  }

  const pages = [currentPage];

  // eslint-disable-next-line functional/no-let
  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      // eslint-disable-next-line functional/immutable-data
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      // eslint-disable-next-line functional/immutable-data
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  // eslint-disable-next-line functional/immutable-data
  pages.sort((a, b) => a - b);

  return pages;
};

export type PaginationProps = {
  submitPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  maxPages: number;
};

export const Pagination: FC<PaginationProps> = ({ submitPage, currentPage, totalPages, maxPages }: PaginationProps) => {
  const pages = calculatePages(currentPage, totalPages, maxPages);

  if (pages.length === 0) {
    return <div></div>;
  }

  return (
    <ul className="w-fit border-y border-l border-gray-300">
      {currentPage > 2 ? (
        <li className="inline-block">
          <button
            className="border-r border-gray-300 px-3 py-2"
            onClick={() => {
              submitPage(1);
            }}
          >
            &laquo;
          </button>
        </li>
      ) : null}
      {currentPage > 1 ? (
        <li className="inline-block">
          <button
            className="border-r border-gray-300 px-3 py-2"
            onClick={() => {
              submitPage(currentPage - 1);
            }}
          >
            &lt;
          </button>
        </li>
      ) : null}
      {pages.map((page: number) => (
        <li key={page} className="inline-block">
          <button
            className={`border-r border-gray-300 px-3 py-2 ${page === currentPage ? 'bg-gray-100' : ''}`}
            onClick={() => {
              submitPage(page);
            }}
          >
            {page}
          </button>
        </li>
      ))}
      {currentPage < totalPages ? (
        <li className="inline-block">
          <button
            className="border-r border-gray-300 px-3 py-2"
            onClick={() => {
              submitPage(currentPage + 1);
            }}
          >
            &gt;
          </button>
        </li>
      ) : null}
      {currentPage < totalPages - 1 ? (
        <li className="inline-block">
          <button
            className="border-r border-gray-300 px-3 py-2"
            onClick={() => {
              submitPage(totalPages);
            }}
          >
            &raquo;
          </button>
        </li>
      ) : null}
    </ul>
  );
};
