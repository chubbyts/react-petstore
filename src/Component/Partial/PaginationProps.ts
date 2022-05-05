type PaginationProps = {
  submitPage: { (page: number): void };
  currentPage: number;
  totalPages: number;
  maxPages: number;
};

export default PaginationProps;
