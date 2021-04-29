import React from 'react';
import useNow from '@/lib/useNow';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';

const useNowExample = () => {
  const { now, timestampNow } = useNow();
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>name</Th>
          <Th>value</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>date</Td>
          <Td>{now.toString()}</Td>
        </Tr>
        <Tr>
          <Td>timestamp</Td>
          <Td>{timestampNow.toString()}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default useNowExample;
