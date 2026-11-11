import { Spinner } from '@chakra-ui/react';
import { format, getMinutes, isBefore, addMinutes } from 'date-fns';
import { includes, uniqBy } from 'lodash-es';

import { InfoIcon, SFCheckIconCircleFilled, SFNoVideoIcon, StatusErrorIcon } from '@assets/icons';
import { RECALL_STATUS_CODE_MAP } from '@util/constants';

/**
 * Gets link to details page of provided card
 * - Is the link to source in most cases except for channels
 * @param {Card} card
 * @param {boolean=} addQueryString
 * @param {Person=} user
 * @returns
 */
export const getCardSourceLink = (card, addQueryString, user) => {
  let queryString = addQueryString ? `?cardId=${card?.id}` : '';
  if (user) {
    queryString = queryString.concat(`&personId=${user.id}`);
  }

  const sourceId = card?.source_data?.id;
  if (card?.source === 'Bot') {
    if (card?.sub_source === 'Earnings_Call') {
      return `/earnings-calls/${sourceId}`;
    } else {
      return `/meeting/${sourceId}${queryString}`;
    }
  } else if (card?.source === 'Meeting') {
    return `/meeting/${sourceId}${queryString}`;
  } else if (card?.source === 'Channel') {
    return `/cards/${card?.id}`;
  } else {
    return null;
  }
};

/**
 * @param {'Meeting' | 'Bot' | 'Channel'} sourceType
 * @param {object} sourceData
 * @returns {boolean}
 */
export function hasLinkableSource(sourceType, sourceData) {
  return (
    (sourceType === 'Meeting' && sourceData?.id) ||
    (sourceType === 'Bot' && sourceData?.bot_id) ||
    (sourceType === 'Channel' && sourceData?.source !== 'Email')
  );
}

export function getCardSource(card) {
  const { source, source_data: sourceData, sub_source: subSource } = card;

  if (subSource) {
    return subSource.split('_').join(' ');
  }

  if (source === 'Meeting') return 'Meeting';
  else if (source === 'Channel') {
    if (sourceData?.source === 'Email') {
      return 'Email';
    } else {
      return `${sourceData?.source} Digest`;
    }
  } else if (source === 'Bot') {
    return 'Earnings Call';
  } else return '';
}

export const getCardTime = (card) => {
  const startAt = card?.source_data?.start_at;
  const endAt = card?.source_data?.end_at;

  if (card?.source === 'Meeting' && startAt && endAt) {
    const samePeriod = format(startAt, 'a') === format(endAt, 'a');
    const startAtFormat = `EEE, MMM d, h${getMinutes(startAt) !== 0 ? ':mm' : ''}${
      samePeriod ? '' : ' a'
    }`;
    const endAtFormat = `h${getMinutes(endAt) !== 0 ? ':mm' : ''} a`;
    return `${format(startAt, startAtFormat)}–${format(endAt, endAtFormat)}`;
  } else if (card?.source === 'Channel') {
    return format(card?.created_at, 'EEE, MMM d');
  } else {
    return `Generated on ${format(card?.created_at, 'EEE, MMM d, h:mm a')}`;
  }
};

/**
 *
 * @param {'primary' | 'secondary' | 'error' | 'empty'} state
 * @param {string} text
 * @param {object} additional
 * @returns
 */
const getStateStyleProps = (state, text, additional = {}) => {
  const stateStyleProps = {
    primary: {
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary'
    },
    secondary: {
      bgColor: 'brandPrimary.containerLow',
      color: 'brandPrimary.primary'
    },
    error: {
      bgColor: 'critical.container',
      color: 'critical.onContainer'
    },
    empty: {
      bgColor: 'surface.containerLow',
      color: 'surface.onSurfaceVariant'
    }
  };

  return { ...stateStyleProps[state], text, ...additional };
};

function isMissingMeetingLink(meetingTimeStatus, meeting) {
  return meetingTimeStatus !== 'done' && !meeting?.url;
}

function isNotScheduled(meetingTimeStatus, botWasScheduled) {
  return meetingTimeStatus !== 'done' && !botWasScheduled;
}

function isScheduled(
  meetingTimeStatus,
  recordingWasStarted,
  botWasScheduled,
  isDone,
  errorStateSubCode
) {
  return (
    meetingTimeStatus !== 'done' &&
    !recordingWasStarted &&
    botWasScheduled &&
    !isDone &&
    !errorStateSubCode
  );
}

/**
 * Determines control bar state based on meeting and bot statuses
 * @param {import('@util/hooks').MeetingBotStatuses} botStatuses
 * @param {Meeting} meeting
 * @returns {{ leftElement?: unknown; text: string; bgColor: string; color: string }}
 */
export function getControlBarState(botStatuses, meeting) {
  const {
    meetingTimeStatus,
    liveDate,
    botWasScheduled,
    recordingWasStarted,
    botWasKicked,
    isCallEnded,
    isLive,
    isDone,
    inWaitingRoom,
    wasSummarized,
    isOnPause,
    insufficientTranscripts,
    didNotGenerate,
    isJoining,
    errorStateSubCode,
    errorStateMessage,
    hasFatalError,
    scheduledReason
  } = botStatuses;

  if (isMissingMeetingLink(meetingTimeStatus, meeting)) {
    return getStateStyleProps('error', 'Fora Needs a Link', {
      leftElement: (
        <SFNoVideoIcon
          color='critical.primary'
          boxSize={5}
        />
      )
    });
  }

  if (isNotScheduled(meetingTimeStatus, botWasScheduled)) {
    return getStateStyleProps('empty', 'Fora is not Scheduled');
  }

  if (isJoining) {
    return getStateStyleProps('primary', 'FORA is Joining');
  }

  if (inWaitingRoom) {
    return getStateStyleProps('error', 'Fora is in the Waiting Room', {
      leftElement: (
        <StatusErrorIcon
          color='critical.primary'
          boxSize={5}
        />
      )
    });
  }

  if (
    isScheduled(meetingTimeStatus, recordingWasStarted, botWasScheduled, isDone, errorStateSubCode)
  ) {
    return getStateStyleProps('secondary', 'Fora is Scheduled', { toolTip: scheduledReason });
  }

  if (isLive) {
    return isOnPause
      ? getStateStyleProps('secondary', 'Paused', { toolTip: scheduledReason })
      : getStateStyleProps('primary', 'Active • Recording', { toolTip: scheduledReason });
  }

  if (recordingWasStarted && !wasSummarized && !insufficientTranscripts) {
    if (isCallEnded) {
      return didNotGenerate
        ? getStateStyleProps('error', 'FORA could not summarize.')
        : getStateStyleProps('primary', 'Summarizing', {
            leftElement: (
              <Spinner
                size='sm'
                speed='0.8s'
                color='brandPrimary.onPrimary'
                mr={1}
              />
            )
          });
    }

    return getStateStyleProps('primary', 'Active • Recording', { toolTip: scheduledReason });
  }

  if (recordingWasStarted && isCallEnded && wasSummarized) {
    return getStateStyleProps('secondary', 'Summarized', {
      toolTip: scheduledReason,
      leftElement: (
        <SFCheckIconCircleFilled
          color='brandPrimary.onContainer'
          boxSize={4}
        />
      )
    });
  }

  if (meetingTimeStatus === 'live' && insufficientTranscripts && botWasKicked) {
    return getStateStyleProps('error', 'FORA was removed.', {
      toolTip: 'To add the FORA bot back, please click the "Add FORA Back" button.',
      rightElement: <InfoIcon display='inline' />
    });
  }

  if (meeting?.tags?.includes('meeting_upload') && !hasFatalError) {
    return getStateStyleProps('primary', 'Transcribing Meeting Recording', {
      leftElement: (
        <Spinner
          size='sm'
          speed='0.8s'
          color='brandPrimary.onPrimary'
          mr={1}
        />
      )
    });
  }

  // https://foraday.atlassian.net/browse/FORA-1803
  // If we are within 5 minutes of the meeting end time, and have not received
  // a fatal error, stay in the summarizing state
  if (isBefore(liveDate, addMinutes(meeting?.end_at, 5)) && !hasFatalError) {
    return getStateStyleProps('primary', 'Summarizing', {
      leftElement: (
        <Spinner
          size='sm'
          speed='0.8s'
          color='brandPrimary.onPrimary'
          mr={1}
        />
      )
    });
  }

  const status = extractErrorStatus(errorStateSubCode, errorStateMessage);
  return getStateStyleProps('error', status, {
    bgColor: 'critical.container',
    leftElement: <StatusErrorIcon />
  });
}

export function extractErrorStatus(errorStateSubCode, errorStateMessage) {
  if (errorStateSubCode === 'azure_transcription') {
    const jsonString = errorStateMessage?.replace(/^MICROSOFT_TRANSCRIPTION_FAILURE:\s*/, '');
    try {
      const parsedObject = JSON.parse(jsonString);
      console.log(parsedObject);
      if (parsedObject?.properties?.error?.message) return parsedObject?.properties?.error?.message;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  } else if (errorStateSubCode === 'gladia_transcription') {
    return errorStateMessage;
  }

  return RECALL_STATUS_CODE_MAP[errorStateSubCode] || 'Fora Did Not Attend';
}

export function selectAndSortCards(
  cards,
  initialCard,
  getGeneratingSummary,
  meetingIdWithBot,
  meeting
) {
  // Sort cards: prioritize the initialCard initiative
  const sortedCards = cards?.sort((a) =>
    a?.initiative?.id === initialCard?.initiative?.id ? -1 : 1
  );

  // Generate summary logic
  const genSummary = getGeneratingSummary();
  if (genSummary?.generating && genSummary?.meetingId === meetingIdWithBot(meeting)) {
    sortedCards.push({
      id: 'generating-summary',
      initiative: {
        id: genSummary.lensId,
        title: genSummary.initiativeTitle,
        tags: ['template']
      }
    });
  }

  // Return unique cards by initiative ID
  return uniqBy(sortedCards, (card) => card?.initiative?.id);
}

/**
 * Given a card and a list of cards by that initial card's source, get the non-template type
 * Lens cards for every Lens initiative
 * @param {Card[]} cards
 * @returns {Card[]}
 */
export const getNonTemplateLensCards = (cards) => {
  const nonTemplateLensCards = cards.filter(
    (card) =>
      !!card?.initiative &&
      !includes(card?.initiative?.tags, 'template') &&
      card?.initiative?.type === 'Lens'
  );
  // this uniqBy may not be necessary if the initial search includes a source_data_id,
  // as there should only ever be one card per Lens on a given source type, but just in case
  return uniqBy(nonTemplateLensCards, (card) => card?.initiative?.id);
};

/**
 * @returns {{ name: string|null, extension: string|null }} - optional name and extension
 */
export function getDocumentMetadataFromCard(card) {
  if (!card?.tags) {
    return { name: null, extension: null };
  }

  const fileNamePrefix = 'filename:';
  const fileName = card?.tags
    ?.find((tag) => tag?.startsWith(fileNamePrefix))
    ?.split(fileNamePrefix)
    ?.pop();
  const fileDotSplit = fileName?.split('.');
  const extension = fileDotSplit?.length > 1 ? fileDotSplit.pop() : null;
  return { name: fileName, extension };
}

/**
 * Returns a summary object (card) based on the isMeeting flag. If object is a meeting
 * convert it to a card style object.  Originally designed for the FeedSummaries component
 *
 * @param {Object} object - The original object (either a card or a meeting)
 * @param {boolean} isMeeting - Whether the object is a meeting
 * @returns {Object} The summary object.
 */
export function getSummaryObject(object, isMeeting) {
  if (isMeeting) {
    return {
      source: 'Meeting',
      source_data: object,
      created_at: object?.start_at,
      headline: object?.bot?.tweet
    };
  }
  return object;
}
