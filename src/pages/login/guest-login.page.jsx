import { Center, Flex, VStack, Divider, Text, Stack, StackDivider } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ReskinCardHeader from '@components/general/card/reskin-card-structure/reskin-card-header.component';
import { StatusTimeLabel } from '@components/general/card/status-time-label.component';
import MeetingParticipants from '@components/meeting/meeting-participants.component';
import TermsAndConditions from '@components/login/terms-conditions.component';
import { useLoginShared, useSetDocumentTitle } from '@util/hooks';
import OAuthStack from './oauth-stack.component';
import { useEffect } from 'react';
import { useUserStore } from '@store/app.store';
import { normalizeTimestamp } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function GuestLoginPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Login - FORA');
  const isAuthenticated = useUserStore((state) => state.isAuthenticated());
  const navigate = useNavigate();
  const { openCredsErrorToast, openErrorToast } = useLoginShared();
  const [params] = useSearchParams();
  const guestEmail = params.get('email');
  // TODO: Do we need this?
  // const senderId = params.get('senderId');
  const senderName = params.get('senderName');
  const sharedMeetingId = params.get('meetingId');
  const meetingTitle = params.get('meetingTitle');
  const startTime = Number(params.get('startTime'));
  const endTime = Number(params.get('endTime'));
  const participantNames = params.get('participantNames');
  const redirectUrl = sharedMeetingId ? `/meeting/${sharedMeetingId}` : '/';

  const participants = participantNames.split(',').map((p) => {
    return { name: p, email: p };
  });

  const bot = {};
  const meeting = {
    title: meetingTitle,
    start_at: normalizeTimestamp(startTime),
    end_at: normalizeTimestamp(endTime),
    nylas: {
      organizer: participants[0],
      participants
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, redirectUrl]);

  return (
    <Flex
      data-cy='guest-login-page'
      h='full'
      bgColor='surface.containerLow'
      alignItems='flex-start'
      flexDir='column'
    >
      <Center
        h='full'
        w='full'
        px={{ base: 4, lg: 0 }}
      >
        <VStack gap={8}>
          <Text
            fontSize='lg'
            color='surface.onSurface'
            fontWeight={600}
          >
            {t('guestLoginPage.sharedAMeetingSummary', { senderName })}
          </Text>
          <Stack
            divider={<StackDivider style={{ margin: 0 }} />}
            layerStyle='section-card'
            w='full'
            h='fit-content'
          >
            <ReskinCardHeader
              title={meetingTitle}
              titleLink={window.location.href}
            >
              <StatusTimeLabel
                meeting={meeting}
                bot={bot}
                includeDate
                showAgoText
                px={0}
              />
            </ReskinCardHeader>
            <Flex p={3}>
              <MeetingParticipants
                meeting={meeting}
                showParticipantStatus={false}
              />
            </Flex>
          </Stack>
          <Text
            fontSize='lg'
            color='surface.onSurface'
            fontWeight={300}
          >
            {t('guestLoginPage.connectYourAccountTo', { guestEmail })}
          </Text>
          <Flex
            w='full'
            borderRadius='xl'
            bgColor='surface.containerLowest'
            p={4}
            border='reskin'
          >
            <OAuthStack
              openErrorToast={openErrorToast}
              openCredsErrorToast={openCredsErrorToast}
              redirectUrl={redirectUrl}
              isGuest
            />
          </Flex>
          <Divider />
          <TermsAndConditions />
        </VStack>
      </Center>
    </Flex>
  );
}
