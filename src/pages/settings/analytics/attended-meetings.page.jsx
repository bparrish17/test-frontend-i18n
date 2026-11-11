import { HStack, Icon, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { format, startOfHour } from 'date-fns';
import { useState } from 'react';

import { CopyIcon } from '@assets/icons';
import { failedBotStatusSubCodes, getBotFailureReason } from '@util/helpers';
import { useCopyToClipboard, useDebouncedProp, useSetDocumentTitle } from '@util/hooks';
import { useInfiniteMeetings } from '@services/query-services/meetings.query-service';
import { useBots } from '@services/query-services/bots.query-service';
import TableWithSearch from '@components/analytics/table-with-search.component';

/**
 * @typedef {Object} AttendedMeetingsTableObject
 * @property {string} date
 * @property {string} timeRange
 * @property {string} duration
 * @property {string} meetingTitle
 * @property {string} meetingHeadline
 * @property {string} meetingOwner
 */

export default function AttendedMeetingsPage() {
  useSetDocumentTitle('Attended Meetings - FORA');
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedProp(query);
  const copyToClipboard = useCopyToClipboard();
  const { data: bots } = useBots({
    not_status_changes_sub_codes: failedBotStatusSubCodes
  });

  const botIds = bots?.map((bot) => bot.id);

  const infiniteMeetingsResults = useInfiniteMeetings(
    {
      pageSize: 40,
      bot_ids: botIds,
      end_at_to: startOfHour(new Date()),
      query: debouncedQuery
    },
    {
      select: (infiniteMeetings) => ({
        ...infiniteMeetings,
        pages: infiniteMeetings?.pages?.map((page) => ({
          ...page,
          data: page?.data
            ?.map((meeting) => transformMeetingData(meeting, copyToClipboard))
            .filter(Boolean)
        }))
      })
    }
  );

  return (
    <TableWithSearch
      infiniteMeetingsResults={infiniteMeetingsResults}
      pageTitle='Attended Meetings'
      dataCy='attended-meetings-page'
      query={debouncedQuery}
      setQuery={setQuery}
    />
  );
}

/** @returns {AttendedMeetingsTableObject} */
function transformMeetingData(meeting, copyToClipboard) {
  if (getBotFailureReason(meeting.bot)?.value !== '-') {
    return null;
  }

  const organizerEmail = meeting?.nylas?.organizer?.email;

  const date = format(new Date(meeting?.start_at), 'MM/dd/yyyy');
  const startTime = format(new Date(meeting?.start_at), 'hh:mm a');
  const endTime = format(new Date(meeting?.end_at), 'hh:mm a');
  const timeRange = `${startTime} - ${endTime}`;
  return {
    date,
    timeRange,
    meetingTitle: (
      <Link
        to={`/meeting/${meeting?.id}`}
        style={{ fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4 }}
      >
        {meeting?.title}
      </Link>
    ),
    meetingOwner: (
      <HStack
        cursor={organizerEmail && 'pointer'}
        w='fit-content'
      >
        <Text
          w='fit-content'
          onClick={() => copyToClipboard(organizerEmail)}
          textDecor={organizerEmail && 'underline'}
          fontWeight={organizerEmail && 500}
          textUnderlineOffset={4}
        >
          {organizerEmail ?? meeting?.creator?.name}
        </Text>
        {organizerEmail && <Icon as={CopyIcon} />}
      </HStack>
    )
  };
}
