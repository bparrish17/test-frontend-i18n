import React from 'react';
import { Text, Stack, Box, Show } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooleanParam, useQueryParam, withDefault } from 'use-query-params';
import { useQueryClient } from '@tanstack/react-query';
import { noop, set } from 'lodash-es';
import { format } from 'date-fns';

import { useUserStore } from '@store/app.store';
import { useMeetingMetaActions, useMeetingPageState, useStyledToast } from '@util/hooks';
import { getUserAttendanceStatus, singleBotStatusChangeUpdaterFn } from '@util/helpers';
import { useNylasAccountStatus } from '@services/query-services/nylas.query-service';
import { useArchiveMeeting } from '@services/query-services/meetings.query-service';

import PriorMeetingsSection from '@pages/meeting/prior-meetings.section';
import PersonalSummarySection from '@pages/meeting/personal-summary.section';
import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import FollowUpsSection from '@pages/meeting/followups.section';
import MeetingPrepSection from '@pages/meeting/meeting-prep.section';
import ReplayActions from '@pages/meeting/replay-actions.component';
import VideoThumbnail from '@pages/meeting/video-thumbnail.component';
import MeetingLensesSection from '@pages/meeting/lenses.section';
import TopicsSection from '@pages/meeting/topics.section';
import TimelineSection from '@pages/meeting/timeline.section';
import CloudRecordingSection from '@pages/meeting/cloud-recording.section';

export default function MeetingDetailComponent({ sections }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const toast = useStyledToast();

  const isGuest = user?.isGuest;
  let { data: userNylasEmail } = useNylasAccountStatus({
    enabled: !!(user && !isGuest),
    select: (n) => n?.value?.email_address
  });
  if (isGuest) {
    userNylasEmail = user?.email;
  }
  const { meetingId } = useParams();
  const [isReplay] = useQueryParam('replay', withDefault(BooleanParam, false));

  const {
    topicGroups,
    ungroupedSummaries,
    bot,
    card,
    allCards,
    cardsBySource,
    attendees,
    organizations,
    priorMeetingsSections,
    meetingTimeStatus,
    meeting,
    thumbnailQueryResult
  } = useMeetingPageState(meetingId);

  const { mutateAsync: archiveMeeting } = useArchiveMeeting({
    optimisticUpdateConfig: {
      // this operation takes a second in the backend, so we need to do optimistic update on the agenda
      // If we don't do this the invalidation will still return this meeting since the archival hasn't reflected yet in the BE
      enabled: true,
      type: 'search',
      queryKeyToUpdate: ['agenda', format(meeting?.start_at ?? 0, 'M/dd/yyyy')],
      updaterFn: (previous) => previous?.filter((agendaMeeting) => agendaMeeting.id !== meetingId)
    },
    onSuccess: noop // overwrite default invalidation behavior
  });

  const onMeetingMetaActionClick = useMeetingMetaActions({
    type: 'id',
    queryKeyToUpdate: [{ id: meeting?.id }, 'all'],
    updaterFn: (prev, mutationVars) =>
      optimisticUpdateMeeting(prev, mutationVars, user, userNylasEmail)
  });

  const handleArchiveMeeting = async () => {
    await archiveMeeting(
      { id: meetingId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['cards']);
          queryClient.invalidateQueries(['insights']);
          navigate('/');
          toast({ status: 'success', title: 'Meeting Successfully Deleted' });
        },
        onError: () => {
          toast({
            status: 'error',
            title: 'Something went wrong while deleting meeting. Please try again.'
          });
        }
      }
    );
  };

  const {
    meetingSummary,
    topicAnalysis,
    meetingInsights,
    meetingPrep,
    followUps,
    keyPoints,
    priorMeetings,
    attendees: attendeesSection
  } = sections;

  return (
    <Stack
      key='meeting-details-page'
      gap={{ base: 7, md: '40px' }}
      mb='2.5rem'
    >
      <Box>
        <Show above='1023px'>
          <Text
            variant='page-header'
            my={11}
          >
            Meeting Details
          </Text>
        </Show>
        <ReskinMeetingCard
          meeting={meeting}
          bot={bot}
          card={card}
          showCardActions={false}
          onMeetingActionClick={(action, value, meeting) => {
            if (action === 'archive') {
              handleArchiveMeeting();
            } else {
              onMeetingMetaActionClick(action, value, meeting);
            }
          }}
          botQueryKey={['meetings', { id: meetingId }, 'all']}
          enableBody={false}
          botUpdaterFn={singleBotStatusChangeUpdaterFn}
          includeDate
          showFullDate
          showShareEmailButton
          showPrivacyButton
          showPulseButton
          enableMenu={user?.type !== 'Associate'}
          canShowAddForaBackButton
          enableTitleLink={false}
        />
        {isReplay && (
          <ReplayActions
            meeting={meeting}
            bot={bot}
            statusChangeUpdaterFn={singleBotStatusChangeUpdaterFn}
          />
        )}
      </Box>

      <Show breakpoint='(max-width: 1023px)'>
        <VideoThumbnail
          thumbnailQueryResult={thumbnailQueryResult}
          meeting={meeting}
          bot={bot}
          maxH='200px'
        />
      </Show>

      <CloudRecordingSection
        meeting={meeting}
        bot={bot}
      />

      <PersonalSummarySection
        section={meetingSummary}
        bot={bot}
        card={card}
        allCards={allCards}
        cardsBySource={cardsBySource}
        meeting={meeting}
      />

      <TopicsSection
        section={topicAnalysis}
        topics={bot?.topics}
      />

      <MeetingLensesSection
        section={meetingInsights}
        card={card}
        meeting={meeting}
      />

      <FollowUpsSection
        section={followUps}
        bot={bot}
        hideHeader
      />

      <TimelineSection
        bot={bot}
        section={keyPoints}
        meetingTimeStatus={meetingTimeStatus}
        topicGroups={topicGroups}
        ungroupedSummaries={ungroupedSummaries}
      />

      <PriorMeetingsSection
        card={card}
        section={priorMeetings}
        attendees={attendees}
        priorMeetingsSections={priorMeetingsSections}
      />

      {user?.type !== 'Associate' && (!!attendees || !!organizations) && (
        <MeetingPrepSection
          hideHeader
          meetingPrepSection={meetingPrep}
          attendeesSection={attendeesSection}
          meeting={meeting}
          attendees={attendees}
          organizations={organizations}
        />
      )}
    </Stack>
  );
}

/**
 * Custom optimistic update functions below are for writing to meeting on GET meetings/:id/all response
 * @param {AllMeetingContent} prev - previous record in cache for above response
 * @param {object} mutationVars - values passed to whatever the action is, e.g. updateMeetingInitiative(...mutationVars)
 * @param {Person} user
 * @param {string} userNylasEmail
 * @returns {AllMeetingContent}
 */
function optimisticUpdateMeeting(prev, mutationVars, user, userNylasEmail) {
  const { action } = mutationVars;
  if (action === 'rsvp') {
    const newParticipants = prev?.value?.nylas?.participants?.map((p) => {
      if (p?.email === userNylasEmail || p?.email === user?.email) {
        set(p, 'status', mutationVars.status);
      }
      return p;
    });
    set(prev, ['value', 'nylas', 'participants'], newParticipants);
    set(prev, ['value', 'rsvp'], getUserAttendanceStatus(prev.value, user));
  } else if (action === 'initiative') {
    set(prev, ['value', 'initiative'], mutationVars?.optimisticUpdateValue);
  } else {
    // since this is a patch call we can't pass 'action' to mutationVars, but since it's the only edge case
    // we're accounting for it here in a catch-all else statement. If we add more functionality that need a
    // patch call, then that's a future us problem <3
    set(prev, ['value', 'sensitive'], mutationVars.value);
  }
  return prev;
}

/**
 * Custom optimistic update functions below are for writing to card on GET meetings/:id/all
 * @param {AllMeetingContent} prev - previous record in cache for above response
 * @param {object} mutationVars - values passed to whatever the action is, e.g. cardSetPreferred(...mutationVars)
 * @returns {AllMeetingContent}
 */
// eslint-disable-next-line
function optimisticUpdateCard(prev, mutationVars) {
  const { action, value } = mutationVars;
  if (action === 'save') {
    set(prev, ['card', 'preferred'], value);
  } else if (action === 'archive') {
    set(prev, ['card', 'archived'], value);
  } else if (action === 'share') {
    set(prev, ['card', 'shared_at'], new Date());
  }
  return prev;
}
