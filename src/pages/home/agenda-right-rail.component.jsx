import { Flex, HStack, Skeleton, Stack, Text, useConst } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useState } from 'react';

import { useAgendaMeetings } from '@services/query-services/meetings.query-service';
import { getMeetingTimeStatus } from '@util/helpers';
import { useAgendaMeetingActions, useClock } from '@util/hooks';
import { InfoIcon } from '@assets/icons';

import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import LinkRadio from '@components/general/form/link-radio.component';
import { multiBotStatusChangeUpdaterFn } from '@util/helpers/query.helpers';

const agendaFilterOptions = [
  { value: 'today', label: 'Today' },
  { value: 'live', label: 'Live' },
  { value: 'recent', label: 'Recent' }
];

const agendaFilterEmptyText = {
  today: 'You have no meetings today',
  live: 'There are currently no live meetings',
  recent: 'No meetings have finished today'
};

/**
 * LEFT OFF:
 * - split up rawTranscripts => { transcripts, ungroupedSummaries, topicGroups } to
 *  - rawTranscripts => transcripts
 *  - rawTranscripts => { ungroupedSummaries, topicGroups }
 * - add shared function for writing to num_of_status_changes/status_changes vs num_of_transcripts/transcripts
 * - make sure pusherTranscripts are writing to the queryKey for agenda meeting bots
 *    - maybe we don't write transcripts to the bot at all? Just read it in the transcripts thing? thinking no
 * - just clean up in general
 */

export default function HomePageAgendaRightRail({ filterBy = 'today', showLinks = true }) {
  const [agendaFilter, setAgendaFilter] = useState(filterBy);
  const today = useConst(new Date());
  const currentTime = useClock('p');
  const agendaQueryKey = ['agenda', format(today, 'M/dd/yyyy')];
  const { onCardActionClick, onMeetingActionClick } = useAgendaMeetingActions(today);

  const { data: agendaMeetings, isLoading } = useAgendaMeetings(today, {
    select: (meetings) =>
      meetings
        ?.filter((m) => {
          const meetingLiveStatus = getMeetingTimeStatus(m, today);
          if (agendaFilter === 'live') {
            return meetingLiveStatus === 'live';
          } else if (agendaFilter === 'recent') {
            return meetingLiveStatus === 'done';
          }
          return true;
        })
        .sort((a, b) => (agendaFilter === 'recent' ? b?.end_at - a?.end_at : 0))
  });

  return (
    <Stack
      p={{ base: 3, md: 11 }}
      gap={{ base: 8, md: 11 }}
    >
      {showLinks && (
        <Flex
          justify='space-between'
          align='center'
        >
          <LinkRadio
            name='agendaFilter'
            options={agendaFilterOptions}
            value={agendaFilter}
            onChange={setAgendaFilter}
          />
          <Text
            variant='page-header'
            as='span'
          >
            {currentTime}
          </Text>
        </Flex>
      )}
      {agendaMeetings?.map((meeting) => (
        <ReskinMeetingCard
          key={meeting?.id}
          meeting={meeting}
          card={meeting?.card}
          bot={meeting?.bot}
          showShareEmailButton
          onMeetingActionClick={onMeetingActionClick}
          onCardActionClick={onCardActionClick}
          hasBody={false}
          botQueryKey={['meetings', ...agendaQueryKey]}
          botUpdaterFn={multiBotStatusChangeUpdaterFn}
        />
      ))}
      {agendaMeetings?.length === 0 && !isLoading && (
        <HStack
          color='surface.onSurfaceVariant'
          letterSpacing='tight'
          fontWeight={500}
        >
          <InfoIcon />
          <Text>{agendaFilterEmptyText[agendaFilter]}</Text>
        </HStack>
      )}
      {isLoading &&
        [...Array(3).keys()].map((i) => (
          <Skeleton
            key={`skeleton-${i}`}
            w='full'
            h='116px'
          />
        ))}
    </Stack>
  );
}
