import { Text } from '@chakra-ui/react';
import pluralize from 'pluralize';

import AccordionTable from '@components/general/table/accordion-table.component';
import UploadTypeLogo from '@components/settings/manage-uploads/upload-type-logo.component';
import UploadStatus from '@components/settings/manage-uploads/upload-status.component';
import UploadLink from '@components/settings/manage-uploads/upload-link.component';
import UploadName from '@components/settings/manage-uploads/upload-name.component';

import { formatTemplateTimestamp } from '@util/helpers/datetime.helpers';
import { useTranslation } from 'react-i18next';

export default function ManageUploadsTable({ uploads, cards, type }) {
  const { t } = useTranslation();

  if (!uploads) {
    return null;
  }

  const headers = [
    {
      title: t('manageUploadsTable.type'),
      orderBy: 'type',
      dir: 'desc',
      props: {
        w: 'full',
        textAlign: 'left'
      },
      disableSort: true,
      render: (upload) => (
        <UploadTypeLogo
          upload={upload}
          cards={cards}
          type={type}
        />
      )
    },
    {
      title: t('manageUploadsTable.name'),
      orderBy: 'title',
      dir: 'desc',
      props: {
        w: 'full',
        textAlign: 'left'
      },
      disableSort: true,
      render: (upload) => (
        <UploadName
          upload={upload}
          cards={cards}
          type={type}
        />
      )
    },
    {
      title: t('manageUploadsTable.date'),
      orderBy: 'created_at',
      dir: 'desc',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      render: (upload) => (
        <Text
          fontSize='sm'
          textAlign='right'
          color='surface.onSurfaceVariant'
        >
          {formatTemplateTimestamp(upload.created_at)}
        </Text>
      )
    },
    {
      title: t('manageUploadsTable.status'),
      orderBy: 'status',
      dir: 'desc',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      disableSort: true,
      render: (upload) => (
        <UploadStatus
          upload={upload}
          cards={cards}
          type={type}
        />
      )
    },
    {
      title: t('manageUploadsTable.link'),
      orderBy: 'status',
      dir: 'desc',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      disableSort: true,
      render: (upload) => (
        <UploadLink
          upload={upload}
          cards={cards}
          type={type}
        />
      )
    }
  ];

  const numUploads = uploads?.length;

  return (
    <>
      <Text
        fontSize='lg'
        fontWeight={500}
      >
        {numUploads}{' '}
        {type === 'Meeting' ? pluralize('Meeting', numUploads) : pluralize('Document', numUploads)}
      </Text>
      <AccordionTable
        tableName='templates'
        tableData={uploads}
        headers={headers}
        enableExpansion
        maxItems={5}
        containerProps={{
          borderTop: 'reskin',
          borderTopRadius: 0,
          overflow: 'auto'
        }}
      />
    </>
  );
}
