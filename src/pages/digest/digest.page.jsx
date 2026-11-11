import { Flex, Center, IconButton, Spinner, Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { CloseIcon, EditAltIcon } from '@assets/icons';
import { useProtectTenant, useSetDocumentTitle } from '@util/hooks';
import { useChannelById } from '@services/query-services/channels.query-service';
import { useUserStore } from '@store/app.store';
import FeedSummaries from '@components/feed/feed-summaries.component';
import SlackDigestCard from '@components/digest/slack-digest-card.component';
import TeamsDigestCard from '@components/digest/teams-digest-card.component';
import CenteredLayout from '@layouts/centered.layout';
import { useTranslation } from 'react-i18next';

export default function DigestPage() {
  const { t } = useTranslation();

  const { channelId } = useParams();
  const user = useUserStore((state) => state.user);
  const { data: digest, isLoading } = useChannelById(channelId, { placeholderData: {} });
  const [editMode, setEditMode] = useState(false);

  const cardSearchBody = {
    has_source: true,
    person_id: user?.id,
    pageSize: 10,
    source_data_id: channelId
  };

  useProtectTenant(digest?.tenant?.id);
  useSetDocumentTitle(`${digest?.initiative?.title} Digest - FORA`);

  return (
    <CenteredLayout
      data-cy='digest-page'
      position='relative'
      py={4}
      px={{ base: 0, sm: 4, md: 0 }}
      w='full'
      maxW='centered-page'
      gap={6}
    >
      {isLoading ? (
        <Spinner size='xl' />
      ) : (
        <>
          {editMode ? (
            <Box
              px={8}
              w='full'
            >
              {/* {digest?.source === 'Slack' && (
                <EditSlackDigest
                  digest={digest}
                  setEditMode={setEditMode}
                />
              )}
              {digest?.source === 'Teams' && (
                <EditTeamsDigest
                  digest={digest}
                  setEditMode={setEditMode}
                />
              )} */}
            </Box>
          ) : (
            <>
              <Center
                px={{ base: 4, sm: 0 }}
                w='full'
              >
                {digest?.source === 'Teams' && <TeamsDigestCard digest={digest} />}
                {digest?.source === 'Slack' && <SlackDigestCard digest={digest} />}
              </Center>
              <Flex
                flexDir='column'
                gap={4}
                w='full'
              >
                <FeedSummaries
                  cardSearchBody={cardSearchBody}
                  noResultsText=''
                  gap={6}
                  cardProps={{ isExpanded: true }}
                />
              </Flex>
            </>
          )}

          <IconButton
            aria-label={t('digestPage.editDigestButtonAriaLabel')}
            icon={editMode ? <CloseIcon size='18px' /> : <EditAltIcon size='18px' />}
            variant='ghost'
            position='absolute'
            color='surface.onSurfaceVariant'
            rounded='full'
            top={8}
            right={6}
            onClick={() => setEditMode(!editMode)}
          />
        </>
      )}
    </CenteredLayout>
  );
}
