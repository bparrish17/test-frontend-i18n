import {
  HStack,
  Text,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { flexRender } from '@tanstack/react-table';
import { Fragment } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@assets/icons';
import ColumnFilterPopover from './column-filter-popover.component';

/*
Thoughts
- I've structured all sorting/pagination/filtering server side. By that I mean I just take the value emitted from the sort/filter/paginator and send it to the API request and let the backend query it.
  However, tanstack insists that performance holds up client-side to up to 100,000 rows. Idk if I want to make requests that large quite yet, but just wanted to mention it as an option.
  Explanation can be found [here](https://tanstack.com/table/latest/docs/guide/column-filtering#client-side-vs-server-side-filtering)
-
*/

/**
 * @param {Object} props
 * @param {import('@tanstack/react-table').Table} props.table
 * @param {(row: import('@tanstack/react-table').Row) => React.ReactElement} props.expandedRowChildren
 */
export default function Table({ table, expandedRowChildren }) {
  const canExpand = typeof expandedRowChildren === 'function';
  return (
    <TableContainer
      border='reskin'
      borderRadius='lg'
    >
      <ChakraTable variant='rounded'>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  w={header.column.getSize()}
                  colSpan={header.colSpan}
                >
                  <HStack>
                    <HStack
                      gap={1}
                      color={
                        header.column.getIsSorted()
                          ? 'brandPrimary.primary'
                          : 'surface.onSurfaceVariant'
                      }
                      cursor={header.column.getCanSort() ? 'pointer' : ''}
                      {...(header.column.getCanSort()
                        ? { onClick: header.column.getToggleSortingHandler() }
                        : {})}
                    >
                      <Text
                        as='span'
                        className='header-text'
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Text>
                      {
                        {
                          asc: (
                            <Icon
                              as={ChevronUpIcon}
                              boxSize={4}
                            />
                          ),
                          desc: (
                            <Icon
                              as={ChevronDownIcon}
                              boxSize={4}
                            />
                          )
                        }[header.column.getIsSorted() ?? null]
                      }
                    </HStack>
                    {/* <Spacer /> */}
                    {header.column.getCanFilter() ? (
                      <ColumnFilterPopover column={header.column} />
                    ) : null}
                  </HStack>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <Tr
                onClick={row.getToggleExpandedHandler()}
                cursor={canExpand && 'pointer'}
                borderBottom={row.getIsExpanded() ? 'none !important' : 'initial'}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    w={cell.column.getSize()}
                    fontSize='sm'
                    fontWeight={500}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
              <AnimatePresence>
                {row.getIsExpanded() && (
                  <Tr className='row-expanded'>
                    <Td colSpan={row.getAllCells().length}>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {canExpand && expandedRowChildren(row)}
                      </motion.div>
                    </Td>
                  </Tr>
                )}
              </AnimatePresence>
            </Fragment>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
}
