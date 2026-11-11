import { HStack, IconButton, Spacer, Stack, Text, useConst, useDisclosure } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';

import { SFApplePencil, SFPlusIcon, SFTrashIcon } from '@assets/icons';
import {
  useArchiveInitiative,
  useInitiatives
} from '@services/query-services/initiatives.query-service';
import { pluralized } from '@util/helpers';
import { expansionColumn } from '@util/helpers/table.helpers';
import {
  useFiltering,
  useMutationToast,
  usePagination,
  useSorting,
  useTanstackTable
} from '@util/hooks';
import CenteredLayout from '@layouts/centered.layout';
import SettingsLayout from '@layouts/settings.layout';
import Table from '@components/general/table/table.component';
import Paginator from '@components/general/table/paginator.component';
import DeleteConfirmationModal from '@components/general/modals/delete-confirmation-modal.component';
import LabelFormModal from '@components/general/modals/label-form-modal.component';
import { useTranslation } from 'react-i18next';

export default function ManageLabelsPage() {
  const { t } = useTranslation();

  const pagination = usePagination();
  const filtering = useFiltering();
  const sorting = useSorting([{ id: 'title', desc: false }], {
    title: { appendKeyword: true }
  });

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: archiveLabel, isLoading: isArchivingLabel } = useArchiveInitiative();
  const labelsQuery = useInitiatives(
    {
      ...sorting.body,
      ...pagination.body,
      ...filtering.body,
      type: 'Label',
      has_archived_at: false
    },
    {
      includeTotal: true,
      keepPreviousData: true
    }
  );

  /** @type {import('@tanstack/react-table').ColumnDef<Initiative>} */
  const labelColumns = useConst([
    expansionColumn,
    {
      accessorKey: 'title',
      header: t('common.name'),
      size: '100%',
      cell: (info) => info.getValue()
    },
    {
      accessorKey: 'creator.name',
      header: t('manageLabelsPage.createdBy'),
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'created_at',
      header: t('manageLabelsPage.dateCreated'),
      cell: (info) => format(info.getValue(), 'Pp'),
      enableColumnFilter: false
    },
    {
      id: 'actions',
      header: '',
      size: 0.5,
      cell: (info) => (
        <HStack>
          <IconButton
            data-testid='edit-button'
            variant='reskinGhost'
            colorScheme='surface'
            color='surface.outline'
            size='reskinMd'
            boxSize={6}
            rounded='lg'
            icon={<SFApplePencil boxSize={6} />}
            onClick={(e) => {
              e.stopPropagation();
              labelFormDisclosure.onOpen();
              setIsEditing(true);
              setSelectedLabel(info.row.original);
            }}
          />
          <IconButton
            data-testid='delete-button'
            variant='reskinGhost'
            colorScheme='critical'
            // color='surface.outline'
            size='reskinMd'
            boxSize={6}
            rounded='lg'
            icon={<SFTrashIcon boxSize={4} />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLabel(info.row.original);
              deleteConfirmationDisclosure.onOpen();
            }}
          />
        </HStack>
      )
    }
  ]);

  const table = useTanstackTable(
    labelsQuery,
    labelColumns,
    sorting.tableConfig,
    pagination.tableConfig,
    filtering.tableConfig
  );

  const handleOnClose = (disclosure) => {
    disclosure.onClose();
    setSelectedLabel(null);
    setIsEditing(false);
  };

  const labelFormDisclosure = useDisclosure();
  const deleteConfirmationDisclosure = useDisclosure();
  const { onSuccess: onDeleteSuccess, onError: onDeleteError } = useMutationToast(
    'label',
    'delete'
  );
  const onDelete = async () => {
    await archiveLabel(
      { id: selectedLabel.id, value: true },
      { onSuccess: onDeleteSuccess, onError: onDeleteError }
    );
    handleOnClose(deleteConfirmationDisclosure);
  };

  const { checkGate } = useStatsigClient();
  const navigate = useNavigate();
  if (!checkGate('labels')) {
    navigate(-1);
    return null;
  }

  return (
    <SettingsLayout pageTitle='Manage Labels'>
      <CenteredLayout gap={6}>
        <HStack>
          <Text variant='title-lighter-sm'>{pluralized('item', labelsQuery?.data?.total)}</Text>
          <Spacer />
          <IconButton
            onClick={labelFormDisclosure.onOpen}
            variant='reskinGhost'
            rounded='full'
            size='sm'
            icon={<SFPlusIcon style={{ paddingRight: 0 }} />}
          >
            {t('manageLabelsPage.addLabel')}
          </IconButton>
        </HStack>
        <Table
          table={table}
          expandedRowChildren={(row) => (
            <Stack py={4}>
              <Text
                whiteSpace='wrap'
                variant='body-500-sm'
                color='surface.onSurfaceVariant'
              >
                {row.original.description}
              </Text>
            </Stack>
          )}
        />
        <Paginator table={table} />
      </CenteredLayout>
      <LabelFormModal
        disclosure={{
          ...labelFormDisclosure,
          onClose: () => handleOnClose(labelFormDisclosure)
        }}
        isEditing={isEditing}
        refetch={labelsQuery.refetch}
        selectedLabel={selectedLabel}
      />
      <DeleteConfirmationModal
        disclosure={{
          ...deleteConfirmationDisclosure,
          onClose: () => handleOnClose(deleteConfirmationDisclosure)
        }}
        headerText='Delete Label Permanently?'
        onConfirmDelete={onDelete}
        isDeleting={isArchivingLabel}
      >
        <Text>{t('manageLabelsPage.deletingThisLabelWon')}</Text>
      </DeleteConfirmationModal>
    </SettingsLayout>
  );
}
