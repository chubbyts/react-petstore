import { FC } from 'react';
import PaginationProps from './PaginationProps';

const Pagination: FC<PaginationProps> = ({ submitPage, currentPage, totalPages, maxPages }: PaginationProps) => {
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
    <ul className="pagination">
      {currentPage > 2 ? (
        <li>
          <button
            onClick={() => {
              submitPage(1);
            }}
          >
            &laquo;
          </button>
        </li>
      ) : null}
      {currentPage > 1 ? (
        <li>
          <button
            onClick={() => {
              submitPage(currentPage - 1);
            }}
          >
            &lt;
          </button>
        </li>
      ) : null}
      {pages.map((page: number) => (
        <li key={page}>
          <button
            className={currentPage === page ? 'current' : ''}
            onClick={() => {
              submitPage(page);
            }}
          >
            {page}
          </button>
        </li>
      ))}
      {currentPage < totalPages ? (
        <li>
          <button
            onClick={() => {
              submitPage(currentPage + 1);
            }}
          >
            &gt;
          </button>
        </li>
      ) : null}
      {currentPage < totalPages - 1 ? (
        <li>
          <button
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

export default Pagination;
