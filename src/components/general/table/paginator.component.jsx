import { HStack, Text, Icon, IconButton, Select, Box, Spacer } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function Paginator({ table, total, modelName }) {
  const { t } = useTranslation();

  return (
    <HStack>
      <Text variant='body-600-sm'>
        {total} {modelName}
      </Text>
      <Spacer />
      <IconButton
        variant='reskinLink'
        size='reskinXs'
        isRound
        px='2.5px'
        icon={
          <Icon
            as={ChevronLeftIcon}
            boxSize={4}
            mr='1px'
          />
        }
        isDisabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      />

      <Text
        fontSize='sm'
        fontWeight={500}
        color='surface.onSurfaceVariant'
      >
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
      </Text>
      <IconButton
        variant='reskinLink'
        size='reskinXs'
        isRound
        px='2.5px'
        icon={
          <Icon
            as={ChevronRightIcon}
            boxSize={4}
            ml='1px'
          />
        }
        isDisabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      />
      <Box
        minW={32}
        ml={2}
      >
        <Select
          size='reskinXs'
          variant='reskinOutline'
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option
              key={pageSize}
              value={pageSize}
            >
              {t('paginator.show', { pageSize })}
            </option>
          ))}
        </Select>
      </Box>
    </HStack>
  );
}
