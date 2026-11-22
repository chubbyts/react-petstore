import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { SortDirection } from '../../src/component/table';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../src/component/table';
import { formatHtml } from '../formatter';

const renderTable = (sort?: SortDirection, onSort?: () => void) =>
  render(
    <Table className="min-w-[500px]">
      <Thead>
        <Tr>
          <Th onSort={onSort} sort={sort}>
            Name
          </Th>
          <Th align="right" shrink>
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Brownie</Td>
          <Td align="right" compact nowrap className="text-fg-secondary">
            <button type="button">Edit</button>
          </Td>
        </Tr>
      </Tbody>
    </Table>,
  );

describe('table', () => {
  test('default', () => {
    const { container } = renderTable();

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left min-w-[500px]">
            <thead class="bg-surface-muted">
              <tr class="group">
                <th
                  scope="col"
                  class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-right w-px whitespace-nowrap"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="">
              <tr class="group">
                <td
                  class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left"
                >
                  Brownie
                </td>
                <td
                  class="border-line group-hover:bg-row-hover border-b px-3 py-2 text-right whitespace-nowrap text-fg-secondary"
                >
                  <button type="button">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      "
    `);
  });

  test('sortable header', async () => {
    const onSort = vi.fn();

    const { rerender } = renderTable(undefined, onSort);

    const header = screen.getByRole('columnheader', { name: 'Name' });

    expect(header.getAttribute('aria-sort')).toBeNull();
    expect(header.textContent).toBe('Name ↕');

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));

    expect(onSort).toHaveBeenCalledTimes(1);

    rerender(
      <Table>
        <Thead>
          <Tr>
            <Th onSort={onSort} sort="asc">
              Name
            </Th>
            <Th onSort={onSort} sort="desc">
              Tag
            </Th>
          </Tr>
        </Thead>
      </Table>,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('aria-sort')).toBe('ascending');
    expect(screen.getByRole('columnheader', { name: 'Name' }).textContent).toBe('Name ↑');
    expect(screen.getByRole('columnheader', { name: 'Tag' }).getAttribute('aria-sort')).toBe('descending');
    expect(screen.getByRole('columnheader', { name: 'Tag' }).textContent).toBe('Tag ↓');
  });

  test('sort without onSort is ignored', () => {
    renderTable('asc');

    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('aria-sort')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Name' })).toBeNull();
  });

  test('stacked on narrow screens', () => {
    const { container } = render(
      <Table stackOnNarrow className="min-w-[500px]">
        <Thead>
          <Tr>
            <Th onSort={() => {}}>Name</Th>
            <Th>Tag</Th>
            <Th align="right">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Brownie</Td>
            <Td label="Tag">{null}</Td>
            <Td label="ID" nowrap>
              4d783b77
            </Td>
            <Td align="right" compact>
              <button type="button">Edit</button>
            </Td>
          </Tr>
        </Tbody>
      </Table>,
    );

    // labels only for cells with a value, empty cells hidden, only the sortable headers shown
    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div class="overflow-x-auto @container">
          <table
            class="w-full border-collapse text-left min-w-[500px] @max-3xl:block @max-3xl:min-w-0"
          >
            <thead class="bg-surface-muted @max-3xl:block">
              <tr class="group @max-3xl:flex">
                <th
                  scope="col"
                  class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:block @max-3xl:grow"
                >
                  <button
                    type="button"
                    class="text-fg-secondary hover:text-fg p-0 font-semibold"
                  >
                    Name <span aria-hidden="true">↕</span>
                  </button>
                </th>
                <th
                  scope="col"
                  class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-left @max-3xl:hidden"
                >
                  Tag
                </th>
                <th
                  scope="col"
                  class="border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold text-right @max-3xl:hidden"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="@max-3xl:block">
              <tr
                class="group border-line @max-3xl:hover:bg-row-hover @max-3xl:flex @max-3xl:flex-col @max-3xl:gap-2 @max-3xl:border-b @max-3xl:px-4 @max-3xl:py-3.5"
              >
                <td
                  class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                >
                  Brownie
                </td>
                <td
                  class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left @max-3xl:hidden"
                ></td>
                <td
                  class="border-line group-hover:bg-row-hover border-b px-4 py-3 text-left whitespace-nowrap @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                >
                  <span
                    class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline"
                    >ID</span
                  >4d783b77
                </td>
                <td
                  class="border-line group-hover:bg-row-hover border-b px-3 py-2 text-right @max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent"
                >
                  <button type="button">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      "
    `);
  });
});
