import { HStack, Stack, Text, IconButton, Spacer, Tag, Heading, Divider } from '@chakra-ui/react';
import { capitalize } from 'lodash-es';
import { format } from 'date-fns';

import { useFiltering, usePagination, useSorting, useTanstackTable } from '@util/hooks';
import { capitalizeFullString, formatCronToCadence } from '@util/helpers';
import { useChannels } from '@services/query-services/channels.query-service';
import { useCards } from '@services/query-services/cards.query-service';
import { SFBoxWithPencil, SFDollarSignCircleIcon, SFTrashIcon } from '@assets/icons';
import SourceLogo from '@components/general/source-logo.component';
import Paginator from '@components/general/table/paginator.component';
import Table from '@components/general/table/table.component';
import { useTranslation } from 'react-i18next';

const channelColumns = [
  {
    accessorKey: 'source',
    header: 'Source',
    cell: (info) => {
      const source = info.getValue();
      if (source === 'Earnings_Call') {
        return (
          <HStack>
            <SFDollarSignCircleIcon color='brandPrimary.primary' />
            <Text>Earnings Call</Text>
          </HStack>
        );
      }
      return (
        <HStack>
          <SourceLogo
            sourceType='Channel'
            source={{ source }}
          />
          <Text
            fontSize='sm'
            textAlign='left'
            fontWeight={500}
          >
            {source}
          </Text>
        </HStack>
      );
    },
    size: 12,
    meta: {
      // todo: look into facet filtering for dynamic filter options
      filterVariant: 'select',
      filterOptions: ['Document', 'Earnings_Call', 'Email', 'Slack', 'Teams'].map((source) => ({
        value: source,
        label: capitalizeFullString(source.replace(/_/g, ' '))
      }))
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: '45%',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'schedule',
    header: 'Frequency',
    cell: (info) => capitalize(formatCronToCadence(info.getValue())),
    enableColumnFilter: false
  },
  {
    accessorKey: 'created_at',
    header: 'Date Created',
    cell: (info) => format(info.getValue(), 'Pp'),
    enableColumnFilter: false
  },
  {
    id: 'delete',
    header: '',
    size: 0.5,
    cell: () => (
      <IconButton
        variant='reskinOutline'
        colorScheme='critical'
        size='reskinMd'
        px={2}
        rounded='lg'
        icon={<SFTrashIcon boxSize={4} />}
        onClick={(e) => {
          e.stopPropagation();
          console.log('deleted!');
        }}
      />
    )
  },
  {
    id: 'edit',
    header: '',
    size: 0.5,
    cell: () => (
      <IconButton
        variant='reskinOutline'
        colorScheme='surface'
        size='reskinMd'
        px={0.5}
        rounded='lg'
        icon={
          <SFBoxWithPencil
            boxSize={6}
            ml={0.5}
            mb={0.5}
          />
        }
        onClick={(e) => {
          e.stopPropagation();
          console.log('hey');
        }}
      />
    )
  }
];

export default function TableSection() {
  return (
    <Stack gap={12}>
      <ChannelTable />
      <Divider />
      <CardTable />
    </Stack>
  );
}

const convertColumnFiltersToChannelBody = (filters) => {
  return {
    ...filters,
    source: filters?.source?.value
  };
};

function ChannelTable() {
  const { t } = useTranslation();

  const pagination = usePagination();
  const sorting = useSorting(undefined, { name: { appendKeyword: true } });
  const filtering = useFiltering(convertColumnFiltersToChannelBody);
  const channelQuery = useChannels(
    { ...sorting.body, ...pagination.body, ...filtering.body },
    {
      includeTotal: true,
      keepPreviousData: true
    }
  );

  const table = useTanstackTable(
    channelQuery,
    channelColumns,
    sorting.tableConfig,
    pagination.tableConfig,
    filtering.tableConfig
  );

  return (
    <Stack gap={4}>
      <HStack>
        <Heading size='md'>{t('tableSection.channels')}</Heading>
        <Spacer />
        <Tag colorScheme='brandPrimary'>{t('tableSection.columnSorting')}</Tag>
        <Tag colorScheme='critical'>{t('tableSection.defaultTheming')}</Tag>
        <Tag colorScheme='brandSecondary'>{t('tableSection.pagination')}</Tag>
        <Tag colorScheme='magentaTag'>{t('tableSection.columnFiltering')}</Tag>
        <Tag colorScheme='brandTertiary'>{t('tableSection.expandableRows')}</Tag>
        <Tag colorScheme='positive'>{t('tableSection.actionColumns')}</Tag>
        <Tag colorScheme='caution'>{t('tableSection.customCellTemplates')}</Tag>
      </HStack>
      <Table table={table} />
      <Paginator
        table={table}
        total={channelQuery?.data?.total}
        modelName='Channels'
      />
    </Stack>
  );
}

const cardColumns = [
  {
    accessorKey: 'headline',
    header: 'Headline',
    size: '30%',
    cell: (info) => info.getValue()
  },
  {
    id: 'source_data.title',
    header: 'Source Title',
    accessorKey: 'source_data.title',
    size: '30%',
    cell: (info) => info.getValue()
  },
  {
    accessorKey: 'person',
    header: 'Person',
    size: '20%',
    cell: (info) => info.getValue()?.name || '-'
  },
  {
    accessorKey: 'created_at',
    header: 'Date Created',
    size: '20%',
    cell: (info) => format(info.getValue(), 'Pp')
  }
];

function CardTable() {
  const { t } = useTranslation();

  const pagination = usePagination();
  const sorting = useSorting(undefined, {
    headline: { appendKeyword: true },
    'source_data.title': { appendKeyword: true }
  });

  const cardsQuery = useCards(
    { ...sorting.body, ...pagination.body },
    {
      includeTotal: true,
      keepPreviousData: true
    }
  );

  const table = useTanstackTable(
    cardsQuery,
    cardColumns,
    sorting.tableConfig,
    pagination.tableConfig,
    {
      defaultColumn: {
        size: 20,
        minSize: 0,
        maxSize: 150
      }
    }
  );

  return (
    <Stack gap={4}>
      <HStack>
        <Heading size='md'>{t('tableSection.cards')}</Heading>
        <Spacer />
        <Tag colorScheme='brandPrimary'>{t('tableSection.columnSorting')}</Tag>
        <Tag colorScheme='critical'>{t('tableSection.defaultTheming')}</Tag>
        <Tag colorScheme='brandSecondary'>{t('tableSection.pagination')}</Tag>
        <Tag colorScheme='brandTertiary'>{t('tableSection.expandableRows')}</Tag>
        <Tag colorScheme='positive'>{t('tableSection.actionColumns')}</Tag>
        <Tag colorScheme='caution'>{t('tableSection.customCellTemplates')}</Tag>
      </HStack>
      <Table table={table} />
      <Paginator
        table={table}
        total={cardsQuery?.data?.total}
        modelName='Channels'
      />
    </Stack>
  );
}
