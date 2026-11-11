import { Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';

import { useInfiniteMeetings } from '@services/query-services/meetings.query-service';
import { useDebouncedProp, useSetDocumentTitle } from '@util/hooks';
import { useBots } from '@services/query-services/bots.query-service';
import { failedBotStatusCodes, failedBotStatusSubCodes, getBotFailureReason } from '@util/helpers';
import TableWithSearch from '@components/analytics/table-with-search.component';

/**
 * @typedef {Object} FailedBotsTableRow
 * @property {string} date
 * @property {string} meetingStart
 * @property {string} meetingTitle
 * @property {string} failureReason
 * @property {string} meetingOwner
 */

export default function FailedBotsPage() {
  useSetDocumentTitle('Failed Bots - FORA');
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedProp(query);
  const { data: bots } = useBots({
    status_changes_codes: failedBotStatusCodes,
    status_changes_sub_codes: failedBotStatusSubCodes
  });

  const infiniteMeetingsResults = useInfiniteMeetings(
    {
      pageSize: 40,
      bot_ids: bots?.map((bot) => bot.id),
      query: debouncedQuery
    },
    {
      select: (infiniteMeetings) => ({
        ...infiniteMeetings,
        pages: infiniteMeetings?.pages?.map((page) => ({
          ...page,
          data: page?.data?.map(transformMeetingData).filter(Boolean)
        }))
      })
    }
  );

  return (
    <TableWithSearch
      infiniteMeetingsResults={infiniteMeetingsResults}
      pageTitle='Failed Bots'
      dataCy='failed-bots-page'
      query={debouncedQuery}
      setQuery={setQuery}
    />
  );
}

/** @returns {FailedBotsTableRow} */
function transformMeetingData(meeting) {
  const failureReasonObj = getBotFailureReason(meeting.bot);

  if (failureReasonObj?.value === '-' || !failureReasonObj?.value) {
    return null;
  }

  const dateObj = new Date(meeting?.start_at);
  const date = format(dateObj, 'MM/dd/yyyy');
  const meetingStart = format(dateObj, 'hh:mm a');

  const failureReason = (
    <Tooltip label={failureReasonObj?.description}>{failureReasonObj?.value}</Tooltip>
  );

  return {
    date,
    meetingStart,
    meetingTitle: (
      <Link
        to={`/meeting/${meeting?.id}`}
        style={{ fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4 }}
      >
        {meeting?.title}
      </Link>
    ),
    failureReason
  };
}
