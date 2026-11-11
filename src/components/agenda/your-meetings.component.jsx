import { HorizontalDotMenuIcon } from '@assets/icons';
import { Button, Grid, GridItem, Skeleton, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { ReskinMeetingCardContext } from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import ReskinMeetingMenu from '@components/general/card/reskin-meeting-card/reskin-meeting-menu.component';
import { StatusTimeLabel } from '@components/general/card/status-time-label.component';
import LabelsModal from '@components/general/modals/labels-modal.component';
import AddForaModal from '@components/meeting/add-fora-modal.component';
import { useAllMeetingContentById } from '@services/query-services/meetings.query-service';
import { meetingsGroupComparator } from '@util/helpers';
import {
  useControlBarState,
  useMeetingBotStatuses,
  useMeetingManagementActions,
  useMeetingTimeStatus
} from '@util/hooks';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryParam } from 'use-query-params';

/**
 * @typedef {Object} YourMeetingsProps
 * @property {any} meetingAttendeeMap
 * @property {any} populatedOrganizations
 * @property {Meeting[]} meetings
 *
 * @param {YourMeetingsProps} props
 */
export default function YourMeetings({ meetings, onMeetingActionClick, onCardActionClick }) {
  /** @type {Map<Meeting["start_at"], Meeting[]>} */
  const meetingsByStartTime = new Map();

  meetings?.forEach((meeting) => {
    const startAt = meeting.start_at;
    if (!meetingsByStartTime.has(startAt)) {
      meetingsByStartTime.set(startAt, []);
    }
    const existingStartAtGroup = meetingsByStartTime.get(startAt);
    existingStartAtGroup.push(meeting);
  });

  const meetingGroups = useMemo(() => {
    const mgs = Array.from(meetingsByStartTime.values());
    return mgs.map((meetingsGroup) => meetingsGroup.sort(meetingsGroupComparator));
  }, [meetingsByStartTime]);

  return (
    <Stack
      gap={0}
      border='reskin'
      borderRadius='md'
      overflow='clip'
      bgColor='surface.containerLow'
    >
      {meetingGroups.map((meetingsGroup, index) => {
        const sortedMeetingItemGroup = meetingsGroup.map((meeting, groupIndex) => {
          let omitBorderTop = false;
          if (index === 0) {
            omitBorderTop = true;
          }

          if (meetingsGroup.length > 1 && groupIndex) {
            omitBorderTop = true;
          }

          return (
            <MeetingRow
              key={meeting?.id}
              meeting={meeting}
              omitBorderTop={omitBorderTop}
              onMeetingActionClick={onMeetingActionClick}
              onCardActionClick={onCardActionClick}
            />
          );
        });

        return sortedMeetingItemGroup;
      })}
    </Stack>
  );
}

/**
 * @param {{
 *   meeting: Meeting,
 *   isLive: boolean,
 *   opacity: string
 * }} props
 */
function MeetingRow({ meeting, omitBorderTop, onMeetingActionClick, onCardActionClick }) {
  const { data: allMeetingContent, isLoading } = useAllMeetingContentById(meeting?.id, false, {
    enabled: !!meeting?.id
  });
  const date = useQueryParam('date');
  const navigate = useNavigate();
  const bot = allMeetingContent?.bot;
  const card = allMeetingContent?.card;
  const stateForMeetingUI = useControlBarState(meeting, bot);
  const { wasSummarized, hasTranscripts } = useMeetingBotStatuses(bot);
  const {
    startMeetingAndRecording,
    showAddForaButton,
    showAddForaBackButton,
    addForaModalDisclosure
  } = useMeetingManagementActions(meeting, bot);
  const meetingTimeStatus = useMeetingTimeStatus(meeting, 60 * 1000);
  const isLive = meetingTimeStatus === 'live';
  const isDone = meetingTimeStatus === 'done';

  let bgColor = 'surface.containerHigh';
  if (isLive) {
    bgColor = 'surface.containerLowest';
  } else if (isDone) {
    bgColor = 'surface.containerLow';
  }

  let actionButton = null;
  if (stateForMeetingUI.text === 'Fora is not Scheduled' && isLive) {
    actionButton = {
      text: 'Start recording',
      color: 'live.primary',
      onClick: startMeetingAndRecording
    };
  } else if (
    stateForMeetingUI.text === 'Fora is not Scheduled' &&
    (showAddForaButton || showAddForaBackButton)
  ) {
    actionButton = {
      text: 'Enable recording',
      color: 'surface.onSurfaceVariant',
      onClick: addForaModalDisclosure.onOpen
    };
  } else if (isDone && !wasSummarized && !hasTranscripts) {
    actionButton = {
      text: 'Not recorded',
      color: 'surface.outline',
      propagate: true
    };
  } else if (wasSummarized) {
    actionButton = {
      text: 'View summary',
      color: 'surface.onSurfaceVariant',
      propagate: true
    };
  }

  const labelsModalDisclosure = useDisclosure();
  const contextValue = useMemo(
    () => ({
      meeting,
      bot,
      card,
      onMeetingActionClick,
      onCardActionClick,
      labelsModalDisclosure,
      showShareInMenu: true
    }),
    [meeting, bot, card, onMeetingActionClick, onCardActionClick, labelsModalDisclosure, date]
  );

  return (
    <Grid
      gap={2}
      p={3}
      w='full'
      bgColor={bgColor}
      templateColumns={{ base: '100px 1fr auto auto', md: '150px 1fr auto auto' }}
      gridTemplateRows={card?.headline ? '1fr auto' : '1fr'}
      cursor='pointer'
      alignItems='center'
      borderTop={omitBorderTop ? 'none' : 'reskin'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/meeting/${meeting?.id}`);
      }}
    >
      <GridItem>
        {isLoading ? (
          <Skeleton
            h={4}
            w={20}
          />
        ) : (
          <StatusTimeLabel
            p={0}
            meeting={meeting}
            bot={meeting?.bot}
          />
        )}
      </GridItem>

      <GridItem
        colSpan={{ base: 4, md: 1 }}
        rowStart={{ base: 2, md: 1 }}
        colStart={{ base: 1, md: 2 }}
        layerStyle={{ md: 'ellipsis-text' }}
      >
        {isLoading ? (
          <Skeleton
            h={5}
            w={80}
          />
        ) : (
          <Text
            variant='body-reg-lg'
            fontWeight={450}
            flex={1}
            fontSize='16px'
            layerStyle={{ md: 'ellipsis-text' }}
            minW={12}
          >
            {meeting?.title}
          </Text>
        )}
      </GridItem>
      <GridItem colStart={3}>
        {isLoading ? (
          <Skeleton
            h={2}
            w={16}
          />
        ) : (
          <>
            {actionButton && (
              <Button
                pointerEvents={actionButton?.propagate && 'none'}
                variant='link'
                color={actionButton?.color}
                onClick={(e) => {
                  if (!actionButton?.propagate) {
                    e.stopPropagation();
                  }
                  actionButton?.onClick?.();
                }}
              >
                <Text variant='label-reg-md'>{actionButton.text}</Text>
              </Button>
            )}
          </>
        )}
      </GridItem>
      <GridItem>
        {isLoading ? (
          <Skeleton boxSize={5} />
        ) : (
          <ReskinMeetingCardContext.Provider value={contextValue}>
            <ReskinMeetingMenu
              buttonProps={{
                variant: 'reskinGhost',
                colorScheme: 'surface',
                size: 'xs',
                icon: <HorizontalDotMenuIcon color='surface.onSurfaceVariant' />
              }}
              showViewTranscriptButton
            />
          </ReskinMeetingCardContext.Provider>
        )}
      </GridItem>

      {card?.headline && (
        <GridItem
          colStart={{ base: 1, md: 2 }}
          colSpan={{ base: 4, md: 3 }}
          rowStart={{ base: 3, md: 2 }}
        >
          <Text
            variant='label-600-lg'
            color='surface.onSurfaceVariant'
            noOfLines={3}
          >
            {card?.headline}
          </Text>
        </GridItem>
      )}

      <LabelsModal
        meeting={meeting}
        card={card}
        disclosure={labelsModalDisclosure}
      />
      <AddForaModal
        meeting={meeting}
        disclosure={addForaModalDisclosure}
      />
    </Grid>
  );
}
