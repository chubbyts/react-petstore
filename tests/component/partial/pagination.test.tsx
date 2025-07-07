import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { test, expect, describe } from 'vitest';
import { formatHtml } from '../../formatter';
import { Pagination } from '../../../src/component/partial/pagination';

describe('pagination', () => {
  test('max pages 1', () => {
    const submitPage = (): void => {};

    const { container } = render(<Pagination currentPage={1} maxPages={1} totalPages={10} submitPage={submitPage} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div></div></div>
    "
  `);
  });

  test('total pages 1', () => {
    const submitPage = (): void => {};

    const { container } = render(<Pagination currentPage={1} maxPages={7} totalPages={1} submitPage={submitPage} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div><div></div></div>
    "
  `);
  });

  test('current 1', () => {
    const submitPage = (): void => {};

    const { container } = render(<Pagination currentPage={1} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <ul class="w-fit border-y border-l border-gray-300">
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2 bg-gray-100">1</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">2</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">3</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">4</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">5</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">6</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">7</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">&gt;</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">»</button>
        </li>
      </ul>
    </div>
    "
  `);
  });

  test('current 4', () => {
    const submitPage = (): void => {};

    const { container } = render(<Pagination currentPage={4} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <ul class="w-fit border-y border-l border-gray-300">
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">«</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">&lt;</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">1</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">2</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">3</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2 bg-gray-100">4</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">5</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">6</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">7</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">&gt;</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">»</button>
        </li>
      </ul>
    </div>
    "
  `);
  });

  test('current 7', () => {
    const submitPage = (): void => {};

    const { container } = render(<Pagination currentPage={7} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <ul class="w-fit border-y border-l border-gray-300">
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">«</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">&lt;</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">4</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">5</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">6</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2 bg-gray-100">7</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">8</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">9</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">10</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">&gt;</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">»</button>
        </li>
      </ul>
    </div>
    "
  `);
  });

  test('current 10', () => {
    const submitPage = (): void => {};

    const { container } = render(<Pagination currentPage={10} maxPages={7} totalPages={10} submitPage={submitPage} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <ul class="w-fit border-y border-l border-gray-300">
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">«</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">&lt;</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">4</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">5</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">6</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">7</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">8</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2">9</button>
        </li>
        <li class="inline-block">
          <button class="border-r border-gray-300 px-3 py-2 bg-gray-100">10</button>
        </li>
      </ul>
    </div>
    "
  `);
  });

  test('buttons', async () => {
    const pages: number[] = [];

    const submitPage = (page: number): void => {
      // eslint-disable-next-line functional/immutable-data
      pages.push(page);
    };

    render(<Pagination currentPage={7} maxPages={7} totalPages={10} submitPage={submitPage} />);

    for await (const element of screen.getAllByRole('button')) {
      await userEvent.click(element);
    }

    expect(pages).toEqual([1, 6, 4, 5, 6, 7, 8, 9, 10, 8, 10]);
  });
});
