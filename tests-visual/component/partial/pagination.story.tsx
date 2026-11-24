import type { FC } from 'react';
import { Pagination } from '../../../src/component/partial/pagination';

const pageTo = (page: number) => `/pet?page=${page}`;

export const PaginationStory: FC = () => (
  <div className="flex w-[720px] flex-col gap-4">
    <Pagination offset={0} limit={10} count={0} pageTo={pageTo} />
    {/* a single page: no page links */}
    <Pagination offset={0} limit={10} count={5} pageTo={pageTo} />
    <Pagination offset={0} limit={10} count={120} pageTo={pageTo} />
    <Pagination offset={50} limit={10} count={120} pageTo={pageTo} />
    <Pagination offset={110} limit={10} count={120} pageTo={pageTo} />
  </div>
);
