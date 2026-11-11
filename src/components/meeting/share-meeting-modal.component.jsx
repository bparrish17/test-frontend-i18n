import {
  Button,
  HStack,
  Icon,
  Text,
  ModalCloseButton,
  Spacer,
  useDisclosure,
  Spinner,
  Center
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { map } from 'lodash-es';

import { SFEnvelopeIcon, SFPaperPlaneIcon } from '@assets/icons';
import { useUserStore } from '@store/app.store';
import {
  useAllMeetingContentById,
  useShareMeeting
} from '@services/query-services/meetings.query-service';
import { useStyledToast, useTopicGroupsAndSummaries } from '@util/hooks';
import { meetingIdWithBot } from '@util/helpers';
import { HIDE_SCROLLBAR } from '@styles/css-configs';

import StyledModal from '@components/general/modals/styled-modal.component';
import ShareSummary from '@components/share-summary/share-summary.component';
import MeetingPDF from '@components/pdf/meeting-pdf.component';
import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import { useRollbar } from '@rollbar/react';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers';
import { useTranslation } from 'react-i18next';

export default function ShareMeetingModal({
  meeting,
  bot,
  buttonStyles,
  openButton,
  showSharedSummary,
  customDisclosure
}) {
  const { t } = useTranslation();

  const defaultDisclosure = useDisclosure();
  const shareMeetingDisclosure = customDisclosure || defaultDisclosure;
  const user = useUserStore((state) => state?.user);
  const tenant = useUserStore((state) => state.tenant);
  const toast = useStyledToast();
  const needFullBot = !bot?.transcripts || !bot?.recap;
  const { data: allMeetingContent, isLoading } = useAllMeetingContentById(meeting?.id, false, {
    enabled:
      shareMeetingDisclosure.isOpen && !!meeting?.id && (needFullBot || !meetingIdWithBot(meeting))
    // Case 1: Bot Doesn't Have Recap
    // Case 2: Meeting doesn't have a shareable ID
  });
  const transcriptedBot = needFullBot ? allMeetingContent?.bot : bot;
  const { topicGroups } = useTopicGroupsAndSummaries(meeting, transcriptedBot);
  const { mutateAsync: shareMeeting, isSharing } = useShareMeeting();
  const isLoadingFullContent = isLoading;
  const rollbar = useRollbar();

  const handleShareSubmit = async (values) => {
    const shareableMeetingId =
      meetingIdWithBot(meeting) ?? meetingIdWithBot(allMeetingContent?.value);
    await shareMeeting(
      {
        id: shareableMeetingId,
        body: {
          emails: map(values?.recipients, 'email'),
          message: values?.message,
          guest: values?.guest
        }
      },
      {
        onSuccess: () => {
          toast({
            title: t('shareMeetingModal.successfullySharedMeeting'),
            status: 'success',
            isClosable: true
          });
          shareMeetingDisclosure.onClose();
        },
        onError: (error) => {
          const title = shareableMeetingId
            ? 'Something went wrong while sharing meeting. Please try again.'
            : 'Failed to generate shareable summary. If this continues please reach out to FORA support.';
          rollbar.error(formatRollbarTitle('ShareMeetingModal', 'Share Submit Error'), error);
          toast({
            title,
            status: 'error',
            isClosable: true
          });
        }
      }
    );
  };

  return (
    <StyledModal
      title={t('shareMeetingModal.sendTo')}
      openButton={
        openButton ?? (
          <Button
            variant='reskinWhite'
            leftIcon={
              <SFPaperPlaneIcon
                boxSize={4}
                color='brandPrimary.primary'
              />
            }
            {...buttonStyles}
          >
            {t('common.share')}
          </Button>
        )
      }
      disclosure={shareMeetingDisclosure}
      modalProps={{ scrollBehavior: 'inside', blockScrollOnMount: false }}
      modalContentProps={{ maxH: 'calc(100vh - 48px)', w: { base: '550px' } }}
      modalBodyProps={{
        overflowY: 'scroll',
        sx: HIDE_SCROLLBAR
      }}
      customHeader={
        <HStack
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.primary'
          py={4}
          px={{ base: 6, sm: 4 }}
        >
          <Icon
            as={SFEnvelopeIcon}
            boxSize={5}
          />
          <Text fontWeight={500}>{t('shareMeetingModal.shareSummary')}</Text>
          <Spacer />
          <ModalCloseButton />
        </HStack>
      }
    >
      {isLoadingFullContent && (
        <Center p={12}>
          <Spinner />
        </Center>
      )}
      {shareMeetingDisclosure.isOpen && !!meeting?.id && !isLoadingFullContent && (
        <ShareSummary
          isSensitive={meeting?.sensitive}
          attendees={meeting?.nylas?.participants || meeting?.attendees}
          isSubmitting={isSharing}
          onSubmit={handleShareSubmit}
          disclosure={shareMeetingDisclosure}
          pdfTitle={`${meeting?.title} - ${format(meeting?.start_at, 'PP')}`}
          pdfDocument={
            <MeetingPDF
              meeting={meeting}
              bot={transcriptedBot}
              topicGroups={topicGroups}
              userName={user?.name}
              tenantName={tenant?.name || meeting?.tenant?.name}
            />
          }
        >
          <ReskinMeetingCard
            meeting={meeting}
            bot={transcriptedBot}
            showCardActions={false}
            enableBody={false}
            includeDate
            showFullDate
            enableControlBar={false}
            enableRSVP={false}
            enableParticipants={false}
            showLabels={false}
            showSharedSummary={showSharedSummary}
          />
        </ShareSummary>
      )}
    </StyledModal>
  );
}
