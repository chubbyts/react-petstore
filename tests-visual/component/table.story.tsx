import type { FC } from 'react';
import { Button } from '../../src/component/button';
import { PencilIcon } from '../../src/component/icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../src/component/table';

const rows = [
  { name: 'Brownie', tag: 'dog', id: '4d783b77-eb09-4603-b99b-f590b605ea00' },
  { name: 'Whiskers', tag: undefined, id: '4d783b77-eb09-4603-b99b-f590b605ea01' },
];

const ExampleTable: FC<{ stackOnNarrow?: boolean }> = ({ stackOnNarrow }: { stackOnNarrow?: boolean }) => (
  <Table stackOnNarrow={stackOnNarrow}>
    <Thead>
      <Tr>
        <Th onSort={() => {}} sort="asc">
          Name
        </Th>
        <Th>Tag</Th>
        <Th shrink>ID</Th>
        <Th align="right">Actions</Th>
      </Tr>
    </Thead>
    <Tbody>
      {rows.map((row) => (
        <Tr key={row.id}>
          <Td>{row.name}</Td>
          <Td label="Tag">{row.tag}</Td>
          <Td label="ID" nowrap>
            {row.id}
          </Td>
          <Td align="right" compact nowrap>
            <Button variant="ghost" size="sm">
              <PencilIcon />
              Edit
            </Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export const TableStory: FC = () => (
  <div className="flex flex-col gap-6">
    <div className="w-[880px]">
      <ExampleTable />
    </div>
    {/* narrower than 48rem: the rows as cards */}
    <div className="w-[480px]">
      <ExampleTable stackOnNarrow />
    </div>
  </div>
);
