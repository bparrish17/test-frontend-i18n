import { HStack, IconButton, Spinner, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { capitalize } from 'lodash-es';
import { format } from 'date-fns';
import { useState } from 'react';

import { useChannels } from '@services/query-services/channels.query-service';
import { useSetDocumentTitle } from '@util/hooks';
import { SFBoxWithPencil } from '@assets/icons';
import { formatCronToCadence } from '@util/helpers';

import AccordionTable from '@components/general/table/accordion-table.component';
import SettingsLayout from '@layouts/settings.layout';
import SlackDigestModal from '@components/digest/slack-digest-modal.component';
import DeleteDigestModal from '@components/digest/delete-digest-modal.component';
import TeamsDigestModal from '@components/digest/teams-digest-modal.component';
import SourceLogo from '@components/general/source-logo.component';
import { useTranslation } from 'react-i18next';

export default function ManageDigestsPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Manage Digests - FORA');
  const editSlackDigestDisclosure = useDisclosure();
  const editTeamsDigestDisclosure = useDisclosure();
  const [selectedChannel, setSelectedChannel] = useState();

  const { data: channels, isLoading } = useChannels({ pageSize: 100, sources: ['Slack', 'Teams'] });

  const headers = [
    {
      title: t('manageDigestsPage.source'),
      orderBy: 'source',
      dir: 'desc',
      width: '100px',
      render: (channel) => (
        <HStack>
          <SourceLogo
            sourceType='Channel'
            source={{ source: channel.source }}
          />
          <Text
            fontSize='sm'
            textAlign='left'
            fontWeight={500}
          >
            {channel.source}
          </Text>
        </HStack>
      )
    },
    {
      title: t('manageDigestsPage.name'),
      orderBy: 'name',
      dir: 'desc',
      props: {
        textAlign: 'left'
      },
      render: (channel) => (
        <Text
          fontSize='sm'
          fontWeight={500}
          whiteSpace='nowrap'
          isTruncated
          minW={{ md: 80 }}
        >
          {channel.name}
        </Text>
      )
    },
    {
      title: t('manageDigestsPage.frequency'),
      orderBy: 'schedule',
      dir: 'desc',
      width: '128px',
      props: {
        textAlign: 'left',
        textStyle: 'body-600-sm'
      },
      render: (channel) => capitalize(formatCronToCadence(channel?.schedule))
    },
    {
      title: t('manageDigestsPage.dateCreated'),
      orderBy: 'created_at',
      dir: 'desc',
      width: '140px',
      props: {
        textAlign: 'left',
        textStyle: 'body-600-sm'
      },
      render: (channel) => format(channel?.created_at, 'M/d/yy @ p')
    },
    {
      key: 'delete',
      disableSort: true,
      width: '64px',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      render: (channel) => <DeleteDigestModal digest={channel} />
    },
    {
      key: 'edit',
      disableSort: true,
      width: '32px',
      props: {
        ml: 'auto',
        justifyContent: 'flex-end'
      },
      render: (channel) => (
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
          onClick={() => {
            setSelectedChannel(channel);
            if (channel.source === 'Slack') {
              editSlackDigestDisclosure.onOpen();
            } else {
              editTeamsDigestDisclosure.onOpen();
            }
          }}
        />
      )
    }
  ];

  return (
    <SettingsLayout pageTitle='Manage Digests'>
      {isLoading ? (
        <Spinner
          color='brandPrimary.primary'
          size='lg'
          thickness='3px'
          speed='0.8s'
        />
      ) : (
        <Stack gap={6}>
          <Text
            fontSize='lg'
            fontWeight={500}
          >
            {channels?.length ?? 0} Items
          </Text>
          <AccordionTable
            tableName='digests'
            tableData={channels}
            headers={headers}
            enableExpansion
            containerProps={{ borderTop: 'reskin', borderRadius: 10 }}
          />
        </Stack>
      )}
      <SlackDigestModal
        isEdit
        digest={selectedChannel}
        disclosure={editSlackDigestDisclosure}
      />
      <TeamsDigestModal
        isEdit
        digest={selectedChannel}
        disclosure={editTeamsDigestDisclosure}
      />
    </SettingsLayout>
  );
}
