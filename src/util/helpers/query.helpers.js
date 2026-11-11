import { last } from 'lodash-es';

/********************************************************************************
 * Transcript optimistic updates on incoming pusher events
 *
 * - these functions are for updating either
 *   - meetingById => bot.transcripts query
 *   - /recall/bots/{id}/transcripts query
 * - used in tandem with useUpdateBotFromPusherEvent
 ********************************************************************************/

/**
 * @param {Meeting[]} previous
 * @param {StatusChange} statusChange
 * @param {string} botId
 * @returns {Meeting[]}
 */
export function multiBotTranscriptUpdaterFn(previous, rawTranscript, botId) {
  return previous?.map((prevMeeting) => {
    if (prevMeeting?.bot_id === botId || prevMeeting?.linked?.bot_id === botId) {
      return meetingTranscriptsUpdaterFn(prevMeeting, rawTranscript);
    } else {
      return prevMeeting;
    }
  });
}

export function meetingTranscriptsUpdaterFn(previous, rawTranscript) {
  const existingTranscripts = previous?.bot?.transcripts ?? [];
  return {
    ...previous,
    bot: {
      ...previous.bot,
      num_of_transcripts: (previous?.bot?.num_of_transcripts ?? 0) + 1,
      transcripts: [...existingTranscripts, rawTranscript]
    }
  };
}

export function fetchedTranscriptsUpdaterFn(previous, rawTranscript) {
  return [...previous, rawTranscript];
}

/********************************************************************************
 * Status Change optimistic updates on incoming pusher events
 *
 * - these functions are for updating either
 *   - agenda: ['meetings', 'agenda', <date>]
 *   - meeting page: ['meetings', { id: meetingId }, 'all]
 ********************************************************************************/

/**
 * @param {Meeting[]} previous
 * @param {StatusChange} statusChange
 * @param {string} botId
 * @returns {Meeting[]}
 */
export function multiBotStatusChangeUpdaterFn(previous, statusChange, botId) {
  return previous?.map((prevMeeting) => {
    if (prevMeeting?.bot_id === botId || prevMeeting?.linked?.bot_id === botId) {
      return singleBotStatusChangeUpdaterFn(prevMeeting, statusChange);
    } else {
      return prevMeeting;
    }
  });
}

/**
 *
 * @param {Meeting} previous
 * @param {StatusChange} statusChange
 * @returns {Meeting}
 */
export function singleBotStatusChangeUpdaterFn(previous, statusChange) {
  const existingStatusChanges = previous?.bot?.status_changes ?? [];
  const mostRecentStatusChange = last(existingStatusChanges);

  // in the case that the last statusChange on our fetched record is the exact same as the new one that came through,
  // don't add the new one in. This prevents duplicate status_changes occurring on the bot if there are two `useUpdateBotFromPusherEvent`
  // calls for the same bot and queryKey
  if (
    mostRecentStatusChange &&
    statusChange.code === mostRecentStatusChange.code &&
    statusChange.sub_code === mostRecentStatusChange.sub_code &&
    statusChange.created_at === mostRecentStatusChange.created_at
  ) {
    return previous;
  }

  return {
    ...previous,
    bot: {
      ...previous.bot,
      num_of_status_changes: (previous?.bot?.num_of_status_changes ?? 0) + 1,
      status_changes: [...existingStatusChanges, statusChange].sort(
        (a, b) => a.created_at - b.created_at
      )
    }
  };
}
