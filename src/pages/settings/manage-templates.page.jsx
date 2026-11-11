import { useState } from 'react';
import { Text, Icon, Box, useDisclosure } from '@chakra-ui/react';

import SettingsLayout from '@layouts/settings.layout';
import CenteredLayout from '@layouts/centered.layout';
import AccordionTable from '@components/general/table/accordion-table.component';
import DeactivateTemplateModal from '@components/settings/deactivate-template-modal.component';
import { SFTrashIcon } from '@assets/icons';

import {
  useInitiatives,
  useArchiveInitiative
} from '@services/query-services/initiatives.query-service';
import { formatTemplateTimestamp } from '@util/helpers/datetime.helpers';
import { useSetDocumentTitle, useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function ManageTemplatesPage() {
  const { t } = useTranslation();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const disclosure = useDisclosure();
  const toast = useStyledToast();
  useSetDocumentTitle('Manage Templates - FORA');

  const templateSearchBody = {
    type: 'Lens',
    tags: ['template'],
    asc: false
  };
  const { data: allTemplates, refetch } = useInitiatives(templateSearchBody);
  const { mutate: archiveTemplate } = useArchiveInitiative();

  const onConfirm = () => {
    archiveTemplate(
      { id: selectedTemplate, value: true },
      {
        onSuccess: () => {
          toast({ status: 'success', title: t('manageTemplatesPage.templateDeletedSuccessfully') });
          refetch();
        },
        onError: () =>
          toast({ status: 'error', title: t('manageTemplatesPage.couldNotDeleteTemplate') })
      }
    );
    disclosure.onClose();
  };

  const headers = [
    {
      title: t('manageTemplatesPage.name'),
      orderBy: 'title',
      dir: 'desc',
      props: {
        w: 'full',
        textAlign: 'left'
      },
      render: (template) => (
        <Text
          fontSize='sm'
          fontWeight={500}
          textAlign='left'
          whiteSpace='nowrap'
          isTruncated
          maxW={{ base: '70px', sm: '150px', md: '500px' }}
        >
          {template.title}
        </Text>
      )
    },
    {
      title: t('manageTemplatesPage.dateCreated'),
      orderBy: 'created_at',
      dir: 'desc',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      render: (template) => (
        <Text
          fontSize='sm'
          textAlign='right'
          color='surface.onSurfaceVariant'
        >
          {formatTemplateTimestamp(template.created_at)}
        </Text>
      )
    },
    {
      title: '',
      disableSort: true,
      width: '64px',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      render: (template) => (
        <Box
          onClick={() => {
            setSelectedTemplate(template?.id);
            disclosure?.onOpen();
          }}
          rounded='lg'
          h={8}
          py={1}
          px={2}
          bgColor='surface.containerLow'
          border='reskin'
          data-testid='delete-button'
          _hover={{ bg: 'surface.container', cursor: 'pointer' }}
        >
          <Icon
            as={SFTrashIcon}
            color='surface.onSurfaceVariant'
            boxSize={4}
          />
        </Box>
      )
    }
  ];

  if (!allTemplates) {
    return null;
  }

  return (
    <SettingsLayout pageTitle='Manage Templates'>
      <CenteredLayout gap={6}>
        <Text
          fontSize='lg'
          fontWeight={500}
        >
          {t('manageTemplatesPage.items', { length: allTemplates.length })}
        </Text>
        <AccordionTable
          tableName='templates'
          tableData={allTemplates}
          headers={headers}
          enableExpansion
          containerProps={{ borderTop: 'reskin', borderRadius: 10 }}
        />
      </CenteredLayout>
      <DeactivateTemplateModal
        disclosure={disclosure}
        onConfirm={onConfirm}
      />
    </SettingsLayout>
  );
}
