import { RSVPAcceptedIcon } from '@assets/icons';
import {
  Box,
  HStack,
  Icon,
  Skeleton,
  Stack,
  StackDivider,
  Text,
  useConst,
  useDisclosure
} from '@chakra-ui/react';
import ReskinCardBody from '@components/general/card/reskin-card-structure/reskin-card-body.component';
import ReskinCardHeader from '@components/general/card/reskin-card-structure/reskin-card-header.component';
import ReskinMeetingCardControlBar from '@components/general/card/reskin-meeting-card/reskin-meeting-card-control-bar.component';
import { StatusTimeLabel } from '@components/general/card/status-time-label.component';
import HighPriorityExplanation from '@components/general/high-priority-explanation.component';
import LabelsBar from '@components/general/labels/labels-bar.component';
import MeetingParticipants from '@components/meeting/meeting-participants.component';
import PulseLaunchContainer from '@components/pulse/pulse-launch-container.jsx';
import { useStatsigClient } from '@statsig/react-bindings';
import { useUserStore } from '@store/app.store';
import { getUserAttendanceStatus } from '@util/helpers';
import { useMeetingTimeStatus, useUpdateBotFromPusherEvent } from '@util/hooks';
import { isBefore } from 'date-fns';
import { createContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const ReskinMeetingCardContext = createContext();

/**
 * IMPORTANT: To understand the structure here better, check out card-structure.md in documentation
 *
 * @param {{
 *   onMeetingActionClick: (actionType, meetingId, value) => void;
 *   onCardActionClick: (actionType, cardId, value) => void;
 *   botQueryKey: string[];
 *   botUpdaterFn: (prev, mutationVars) => unknown;
 * }} props
 * @returns
 */
export default function ReskinMeetingCard({
  meeting,
  bot,
  card,
  showCardActions = true,
  enableControlBar = true,
  enableBody = true,
  enableMenu = true,
  enableParticipants = true,
  showShareEmailButton = false,
  showViewTranscriptButton = true,
  showFullDate = false,
  isLensSourceCard = false,
  showPulseButton = false,
  showLabels = true,
  enableRSVP = true,
  showSharedSummary,
  showPrivacyButton = false,
  canShowAddForaBackButton = false,
  enableTitleLink = true,
  includeDate,

  onMeetingActionClick,
  onCardActionClick,
  botQueryKey,
  botUpdaterFn
}) {
  const { t } = useTranslation();

  const { checkGate } = useStatsigClient();
  const enablePulses = checkGate('pulses');
  const enableLabels = checkGate('labels');
  const enableHighPriority = checkGate('high-priority-cards');

  const now = useConst(new Date());
  const hasBody = !!card;
  const hasParticipants = meeting?.nylas?.participants?.length > 0;
  const isMeetingInThePast = isBefore(new Date(meeting?.end_at), now);
  const showBody = enableBody && hasBody;
  const showParticipants = enableParticipants && hasParticipants;
  const user = useUserStore((state) => state.user);
  const rsvp = useMemo(() => getUserAttendanceStatus(meeting, user), [meeting?.id, user]);
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const labelsModalDisclosure = useDisclosure();

  useUpdateBotFromPusherEvent(bot?.id, 'status_changes', botQueryKey, botUpdaterFn);

  const contextValue = useMemo(
    () => ({
      meeting,
      bot,
      card,
      showCardActions,
      onMeetingActionClick,
      onCardActionClick,
      labelsModalDisclosure,
      showShareInMenu: false
    }),
    [
      meeting,
      bot,
      card,
      showCardActions,
      onMeetingActionClick,
      onCardActionClick,
      labelsModalDisclosure
    ]
  );

  const leftElement = useMemo(() => {
    if (!showPulseButton) return null;

    if (!meeting?.end_at) {
      return (
        <Skeleton
          boxSize={12}
          mx={2}
        />
      );
    }

    if (enablePulses && isMeetingInThePast) {
      return (
        <Box px={2}>
          <PulseLaunchContainer singleMeetingData={meeting} />
        </Box>
      );
    }

    return null;
  }, [enablePulses, showPulseButton, isMeetingInThePast, meeting?.end_at]);

  const canPreviewSharedSummary = showSharedSummary && !!bot?.recap;

  return (
    <ReskinMeetingCardContext.Provider value={contextValue}>
      <Stack
        divider={<StackDivider style={{ margin: 0 }} />}
        layerStyle='section-card'
        w='full'
        h='fit-content'
        overflow='hidden'
      >
        {/* Guest header */}
        {
          // https://foraday.atlassian.net/browse/FORA-1041
          // disable this text for now
          // isGuest && showSharedThisHeader && (
          //   <HStack px={4} py={2} spacing={2} display="flex">
          //     {/* TODO: Missing image url, API guest permissions */}
          //     <Avatar size="2xs" name={meeting?.creator?.name} />
          //     <Text fontSize="xs" color="surface.onSurfaceVariant">
          //       <Text color="surface.onSurface" display="inline">
          //         {meeting?.creator?.name} at {meeting?.tenant?.name}{' '}
          //       </Text>
          //       shared this
          //     </Text>
          //   </HStack>
          // )
        }

        {/* Heading */}
        <ReskinCardHeader
          title={meeting?.title ?? t('reskinMeetingCard.untitledMeeting')}
          titleLink={enableTitleLink ? `/meeting/${meeting?.id}` : undefined}
          state={{ lensId: card?.initiative?.id }}
          leftElement={leftElement}
          headerChildren={
            enableRSVP &&
            rsvp.status === 'yes' && (
              <HStack color='positive.primary'>
                <Icon
                  as={RSVPAcceptedIcon}
                  boxSize={4}
                />
                <Text fontSize='xs'>
                  {meetingTimeStatus === 'done'
                    ? t('reskinMeetingCard.attended')
                    : t('reskinMeetingCard.attending')}
                </Text>
              </HStack>
            )
          }
        >
          <StatusTimeLabel
            meeting={meeting}
            bot={bot}
            includeDate={includeDate}
            showFullDate={showFullDate}
            showAgoText={isBefore(meeting?.end_at, now)}
            isLensSourceCard={isLensSourceCard}
            px={0}
          />
        </ReskinCardHeader>

        {enableHighPriority && card?.high_priority_explanation && (
          <HighPriorityExplanation card={card} />
        )}

        {/* Body */}
        {(showBody || canPreviewSharedSummary) && (
          <ReskinCardBody
            card={canPreviewSharedSummary ? bot?.recap : card}
            titleLink={`/meeting/${meeting?.id}`}
            enableCollapse={canPreviewSharedSummary}
            isLensSourceCard={isLensSourceCard}
          >
            {showParticipants && <MeetingParticipants meeting={meeting} />}
          </ReskinCardBody>
        )}

        {enableLabels && showLabels && (
          <LabelsBar
            meeting={meeting}
            card={card}
            modalDisclosure={labelsModalDisclosure}
          />
        )}

        {/* Actions */}
        {enableControlBar && (
          <ReskinMeetingCardControlBar
            enableMenu={enableMenu}
            showShareEmailButton={showShareEmailButton}
            showViewTranscriptButton={showViewTranscriptButton}
            showPrivacyButton={showPrivacyButton}
            canShowAddForaBackButton={canShowAddForaBackButton}
          />
        )}
      </Stack>
    </ReskinMeetingCardContext.Provider>
  );
}

/*

Video Disclosure Note:
- in the case of meeting details, the KeyPointsSection > TopicGroup needs to be able to scroll to a certain part in the video based on
  whatever transcript time is clicked. For this scenario we pass in the video disclosure so that both the TopicGroups and the ReskinMeetingCardControlBar
  where the video actually lives can be interacted with.
- in all other cases, the video disclosure is just initiated here and only ever used by the video modal itself


|----------------------|---------------------------------------------------|------------------------------------------------------------------------|-----------------------------------|------------------------------------------------|
|                      | Upcoming                                          | Live                                                                   | Done (No Card)                    | Done (Card)                                    |
|----------------------|---------------------------------------------------|------------------------------------------------------------------------|-----------------------------------|------------------------------------------------|
| Top Bar              | "Fora is Scheduled" toggle                        | "Fora is Recording"                                                    | "Fora is Summarizing..."          | "Fora Recorded this meeting"                   |
| Body Title           |                                                   | Design says it's the card title, but that's not available at this time |                                   | Card Title                                     |
| Body Subtitle        | A: In 40M - Weekly marketing and PR SyncB:<empty> | Live - Weekly marketing and PR sync.                                   |                                   | <Date> - Weekly marketing and PR sync.         |
| Body Content         | A: Executive Prep B: <empty>                      | Latest updates?                                                        |                                   | Card Sections                                  |
| Body Bottom          | A: Participants Text B: <empty>                   | Participants Text / Live Status Progress Bar                           |                                   | Participants Text                              |
| Bottom Actions Left  | Start???                                          | Pause Recording                                                        |                                   | Watch Video / View Transcript                  |
| Bottom Actions Right | RSVP Status / Meeting Sensitivity                 | Join Meeting / RSVP Status / Meeting Sensitivity                       | RSVP Status / Meeting Sensitivity | RSVP Status (past tense) / Meeting Sensitivity |
|----------------------|---------------------------------------------------|------------------------------------------------------------------------|-----------------------------------|------------------------------------------------|
*/
