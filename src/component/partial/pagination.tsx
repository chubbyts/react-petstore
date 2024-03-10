import type { FC } from 'react';

export type PaginationProps = {
  submitPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  maxPages: number;
};

export const Pagination: FC<PaginationProps> = ({ submitPage, currentPage, totalPages, maxPages }: PaginationProps) => {
  if (totalPages <= 1 || maxPages <= 1) {
    return <div></div>;
  }

  const pages = [currentPage];
  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  pages.sort((a, b) => a - b);

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
