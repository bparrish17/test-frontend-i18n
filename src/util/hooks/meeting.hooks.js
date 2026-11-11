import { useBoolean, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { countBy, find, isNil, last, omit, some } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { differenceInMilliseconds, format, min } from 'date-fns';
import { useRollbar } from '@rollbar/react';

import {
  useRSVP,
  useStartMeeting,
  useUnscheduleBot,
  useUpdateMeetingInitiative,
  useUpdateMeetingSensitivity,
  useUnshareMeeting,
  useInvalidateMeetingQueries
} from '@services/query-services/meetings.query-service';
import {
  usePauseBot,
  useRemoveBot,
  useResumeBot
} from '@services/query-services/bots.query-service';
import { getVideoContentType } from '@services/query-services/default.query-service';
import {
  checkForExpectedError,
  fetchBlobAs,
  getMeetingTimeStatus,
  getPreviousItemEndTime,
  minutes,
  parseRawTranscripts,
  sharedEmails
} from '@util/helpers';
import { useLiveDate, useStyledToast } from '@util/hooks';

/**
 * @typedef {Object} MeetingBotStatuses
 * @property {boolean} botWasScheduled
 * @property {boolean} recordingWasStarted
 * @property {boolean} botIsInMeeting
 * @property {boolean} isLive
 * @property {boolean} isOnPause
 * @property {boolean} isActivelyRecording
 * @property {boolean} insufficientTranscripts
 * @property {boolean} hasTranscripts
 * @property {boolean} isDone
 * @property {boolean} isJoining
 * @property {boolean} hasFatalError
 * @property {Date} startedRecordingAt
 * @property {Date} endedRecordingAt
 * @property {boolean} isCallEnded
 * @property {boolean} botWasKicked
 * @property {boolean} botWasNeverAdmitted
 * @property {boolean} isRecordingAcquired
 * @property {boolean} wasSummarized
 * @property {boolean} didNotGenerate
 * @property {boolean} inWaitingRoom
 * @property {string} errorStateSubCode
 * @property {string} errorStateMessage
 * @property {StatusChange} lastStatusChange
 * @property {StatusChange[]} recordingPausedSegments

 */

export const useRemoveFora = (meeting, bot) => {
  const toast = useStyledToast();
  const { mutateAsync: removeBot, isLoading: isRemovingFora } = useRemoveBot();
  const { mutateAsync: unscheduleBotForMeeting, isLoading: isUnschedulingFora } = useUnscheduleBot({
    keep: true
  });
  const { mutateAsync: unscheduleMeetingSeries, isLoading: isUnschedulingMeetingSeries } =
    useUnscheduleBot({ keep: false });
  const invalidateMeetingQueries = useInvalidateMeetingQueries(meeting);

  const mutateOptions = {
    onSuccess: () => {
      toast({ status: 'success', title: 'Successfully Removed Fora from Meeting' });
      invalidateMeetingQueries();
    },
    onError: () =>
      toast({ status: 'error', title: 'Could not remove FORA from meeting. Please try again.' })
  };

  const removeFora = async () => {
    const { botIsInMeeting } = getMeetingBotStatuses(bot);
    if (botIsInMeeting) {
      await removeBot(bot?.id, mutateOptions);
    } else {
      await unscheduleBotForMeeting({ id: meeting?.id }, mutateOptions);
    }
  };

  const removeFromSeries = async () => {
    await unscheduleMeetingSeries(
      { id: meeting?.id },
      {
        onSuccess: () => {
          toast({ status: 'success', title: 'Successfully Removed Fora from Meeting Series' });
          invalidateMeetingQueries();
        },
        onError: () =>
          toast({
            status: 'error',
            title: 'Could not remove FORA from meeting series. Please try again.'
          })
      }
    );
  };

  return {
    removeFora,
    isRemovingFora: isRemovingFora || isUnschedulingFora,
    removeFromSeries,
    isRemovingFromSeries: isUnschedulingMeetingSeries
  };
};

// reskin todo: update this to check for earliest of recording start time or the live time

/**
 * Returns meeting progress values at a regularly provided interval
 * @param {Meeting} meeting
 * @param {number} updateInterval
 * @returns {{
 *  progress: number;
 *  timeUntil: number; // milliseconds
 *  elapsedtime: number; // milliseconds
 *  isJoinableTime: boolean;
 * }}
 */
export const useMeetingTimeProgress = (meeting, bot, updateInterval = 10 * 1000) => {
  const [progress, setProgress] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [timeUntil, setTimeUntil] = useState(null);
  const liveDate = useLiveDate(updateInterval);
  const { isLive, startedRecordingAt } = useMeetingBotStatuses(bot);
  const meetingTimeStatus = getMeetingTimeStatus(meeting, liveDate);
  const earliestStartAt = bot ? min([meeting?.start_at, startedRecordingAt]) : meeting?.start_at;

  useEffect(() => {
    if (meetingTimeStatus === 'live' || isLive) {
      const totalDuration = differenceInMilliseconds(meeting?.end_at, earliestStartAt);
      const elapsedTime = differenceInMilliseconds(liveDate, earliestStartAt);
      const newProgress = Math.round((elapsedTime / totalDuration) * 100) / 100;
      setElapsedTime(elapsedTime);
      setProgress(newProgress);
    }

    if (meetingTimeStatus === 'upcoming') {
      setTimeUntil(differenceInMilliseconds(meeting?.start_at, liveDate));
    } else {
      setTimeUntil(null);
    }
  }, [meetingTimeStatus, liveDate]);

  const isWithin15MinutesBeforeStart = useMemo(() => {
    if (!meeting?.start_at || !meeting?.end_at) {
      return false;
    }
    return !isNil(timeUntil) && timeUntil <= minutes(15);
  }, [timeUntil, meeting]);

  return { progress, elapsedTime, timeUntil, isWithin15MinutesBeforeStart };
};

/**
 * Lighter weight hook for managing meeting time status (chronological, purely just date/times with no pusher dependence)
 * @returns {MeetingTimeStatus}
 */
export const useMeetingTimeStatus = (meeting, updateInterval = 10 * 1000) => {
  const liveDate = useLiveDate(updateInterval);
  const meetingTimeStatus = useMemo(
    () => getMeetingTimeStatus(meeting, liveDate),
    [meeting, liveDate]
  );
  return meetingTimeStatus;
};

/**
 *
 * @param {OptimisticUpdateConfig} optimisticUpdateConfig
 * @returns {(meetingId: string, attendanceStatus: 'yes' | 'no' | 'maybe') => Promise<void>}
 */
export const useManageRSVPStatus = (optimisticUpdateConfig = {}) => {
  const toast = useStyledToast();
  const { mutateAsync: updateRSVPStatus } = useRSVP({
    optimisticUpdateConfig: { enabled: true, ...optimisticUpdateConfig }
  });

  return async (meetingId, attendanceStatus) => {
    await updateRSVPStatus(
      { id: meetingId, status: attendanceStatus, action: 'rsvp' },
      {
        onSuccess: () => {
          toast({
            status: 'success',
            title: 'RSVP update received! Your calendar should update momentarily.'
          });
        },
        onError: (err) => {
          const errMsg = checkForExpectedError(err, [
            "You can't respond to this meeting because you're the meeting organizer."
          ]);
          toast({
            status: 'error',
            title:
              errMsg || 'Something went wrong while updating your RSVP status. Please try again.'
          });
        }
      }
    );
  };
};

/**
 * @param {OptimisticUpdateConfig} optimisticUpdateConfig
 * @returns {(meetingId: string, sensitive: boolean) => Promise<void>}
 */
export const useManageMeetingSensitivity = (optimisticUpdateConfig) => {
  const toast = useStyledToast();
  const { mutateAsync: setMeetingSensitivity } = useUpdateMeetingSensitivity({
    optimisticUpdateConfig
  });

  return async (meeting) => {
    const newSensitiveValue = !meeting?.sensitive;
    await setMeetingSensitivity(
      { id: meeting?.id, value: newSensitiveValue, params: { clean: true } },
      {
        onSuccess: () => {
          const title = newSensitiveValue
            ? 'Meeting is now Private. Meeting insights will not be shared to other collaborators'
            : 'Meeting is now Public. Meeting insights will be shared to other collaborators';
          toast({ title, status: 'success' });
        },
        onError: () =>
          toast({
            title: 'Something went wrong while updating meeting privacy. Please try again.',
            status: 'error'
          })
      }
    );
  };
};

export const useManageMeetingShares = () => {
  const toast = useStyledToast();
  const { mutateAsync: unshareMeeting } = useUnshareMeeting();

  return async (meeting) => {
    if (!meeting?.sensitive && meeting?.shares?.length > 0) {
      await unshareMeeting(
        { id: meeting?.id, body: sharedEmails(meeting) },
        {
          onSuccess: () => {
            toast({ title: 'Sharing access revoked', status: 'success' });
          },
          onError: () => {
            console.log('onError called');
            toast({
              title: 'Something went wrong while revoking sharing access. Please contact support',
              status: 'error'
            });
          }
        }
      );
    }
  };
};

export const useMeetingPauseResume = (meeting, bot) => {
  const queryClient = useQueryClient();
  const { isOnPause } = useMeetingBotStatuses(bot);
  // reskin todo: change var names here for clarity
  const [isPausingResuming, setIsPausingResuming] = useBoolean();

  // reskin todo: confirm it was okay to remove optimistic update config here
  // I think this would clash with the useUpdateBotFromPusherEvent query cache updates
  const { mutateAsync: pauseBot } = usePauseBot();
  const { mutateAsync: resumeBot } = useResumeBot();

  const pauseResume = async () => {
    setIsPausingResuming.on();
    if (isOnPause) {
      await resumeBot({ id: bot?.id });
    } else {
      await pauseBot({ id: bot?.id });
    }
    await queryClient.invalidateQueries({ queryKey: ['recall/bots'] });
    await queryClient.invalidateQueries({
      queryKey: ['meetings', 'agenda', format(meeting.start_at, 'M/dd/yyyy')],
      refetchType: 'none'
    });
    await queryClient.invalidateQueries({
      queryKey: ['meetings', { id: meeting?.id }, 'all'],
      refetchType: 'inactive'
    });
    setIsPausingResuming.off();
  };

  return { isPausingResuming, pauseResume };
};

const useMeetingViewVideo = (meeting) => {
  return async () => {
    const { videoUrl } = meeting;
    const { contentType } = await getVideoContentType(videoUrl);

    if (contentType === 'video/mp4') {
      window.open(videoUrl, '_blank');
    } else {
      const videoBlob = await fetchBlobAs(videoUrl, 'video/mp4');
      const videoBlobUrl = URL.createObjectURL(videoBlob);
      window.open(videoBlobUrl, '_blank', {});
    }
  };
};

export const useMeetingRecordingStatus = (meeting, bot) => {
  const rollbar = useRollbar();
  const toast = useStyledToast();
  const { botIsInMeeting } = useMeetingBotStatuses(bot);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const { mutateAsync: startMeeting, isLoading: isStartingMeeting } = useStartMeeting();
  const invalidateMeetingQueries = useInvalidateMeetingQueries(meeting);

  useEffect(() => {
    // wait for in_call_recording status_change before confirming
    if (botIsInMeeting) {
      setIsStartingRecording(false);
    }
  }, [botIsInMeeting]);

  const startMeetingAndRecording = async () => {
    setIsStartingRecording(true);
    const meetingId = meeting?.id;
    await startMeeting(
      { meetingId },
      {
        onSuccess: () => toast({ status: 'success', title: 'FORA is Joining' })
      },
      {
        onError: (err) => {
          // todo: add proper error messages if returned from backend
          // e.g. "The Meeting has already started recording."
          setIsStartingRecording(false);
          const resErr = 'Failed to start recording. Please join meeting and try again.';
          rollbar?.error(resErr, err, { meetingId });
          toast({ status: 'error', title: resErr });
        }
      }
    );

    invalidateMeetingQueries();
  };

  return {
    startMeetingAndRecording,
    isStartingMeeting,
    isStartingRecording
  };
};

export const useMeetingManagementActions = (meeting, bot) => {
  const addForaModalDisclosure = useDisclosure();
  const { isWithin15MinutesBeforeStart } = useMeetingTimeProgress(meeting, bot);
  const {
    botWasScheduled,
    botWasKicked,
    botWasNeverAdmitted,
    recordingWasStarted,
    isCallEnded,
    isLive,
    hasTranscripts,
    insufficientTranscripts,
    isRecordingAcquired,
    wasSummarized,
    isJoining,
    inWaitingRoom
  } = useMeetingBotStatuses(bot);
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const { isPausingResuming, pauseResume } = useMeetingPauseResume(meeting, bot);
  const onViewVideoClick = useMeetingViewVideo(meeting);
  const { startMeetingAndRecording, isStartingMeeting, isStartingRecording } =
    useMeetingRecordingStatus(meeting, bot);

  const { removeFora, isRemovingFora } = useRemoveFora(meeting, bot);

  const botHadFailures = !botWasScheduled || botWasNeverAdmitted || botWasKicked;
  const isAfterMeeting = botHadFailures ? meetingTimeStatus === 'done' : isCallEnded;

  const isMeetingUpload = meeting?.tags?.includes('meeting_upload');

  // https://foraday.atlassian.net/browse/FORA-1174
  // just check if (startAt - 15min) < currentTime < endAt
  const isJoinable = isWithin15MinutesBeforeStart || meetingTimeStatus === 'live';

  const showAddForaButton =
    !recordingWasStarted && !botWasScheduled && meetingTimeStatus !== 'done';
  const showAddForaBackButton =
    botWasScheduled &&
    !isJoining &&
    !inWaitingRoom &&
    isCallEnded &&
    insufficientTranscripts &&
    meetingTimeStatus !== 'done' &&
    !isMeetingUpload;
  const showStartEarlyButton =
    botWasScheduled &&
    !isAfterMeeting &&
    !isJoining &&
    !inWaitingRoom &&
    !isLive &&
    !isCallEnded &&
    !isMeetingUpload;
  const showPauseResumeButton = recordingWasStarted && !botHadFailures && !isAfterMeeting; // note isJoinable might be redundant?

  return {
    // Joining
    showJoinButton: !isNil(meeting?.url) && isJoinable && !isMeetingUpload,

    // Transcripts
    transcriptAvailable: (isLive || isCallEnded) && hasTranscripts,

    isShareable: wasSummarized,

    // Video
    showViewVideoButton: (!!bot?.video_url || isRecordingAcquired) && isCallEnded,
    onViewVideoClick,

    // Start Recording
    startMeetingAndRecording,
    isStartingRecording,
    isStartingMeeting,
    showStartEarlyButton,

    // Adding/Removing Fora
    showAddForaButton,
    showAddForaBackButton,
    addForaModalDisclosure,
    removeFora,
    isRemovingFora,

    // Pause/Resuming
    isPausingResuming,
    showPauseResumeButton,
    pauseResume
  };
};

/**
 * @param {Bot} bot
 * @returns {MeetingBotStatuses}
 */
export const getMeetingBotStatuses = (bot) => {
  const statusChanges = bot?.status_changes?.sort((a, b) => a.created_at - b.created_at) ?? [];
  const lastStatusChange = last(statusChanges);
  const statusChangeCodeCounts = countBy(statusChanges, 'code');
  const hasAnyStatusChangeOf = (code) => statusChangeCodeCounts[code] > 0;
  const hasAnySubCodeOf = (code, subCode) =>
    some(statusChanges, (sc) => sc.code === code && sc.sub_code === subCode);

  const getFirstStatusChangeOf = (code) => find(statusChanges, { code });

  const recordingWasStarted = hasAnyStatusChangeOf('in_call_recording');
  const isCallEnded = hasAnyStatusChangeOf('call_ended') || hasAnyStatusChangeOf('done');
  const isDone = hasAnyStatusChangeOf('done');
  const isLive = recordingWasStarted && !isCallEnded;
  const isOnPause =
    lastStatusChange?.code === 'in_call_not_recording' &&
    statusChangeCodeCounts.in_call_not_recording > 1;

  const insufficientTranscripts =
    bot?.num_of_transcripts === 0 || !bot?.transcripts?.some((transcript) => transcript.summary);

  const isJoining =
    lastStatusChange?.code === 'joining_call' ||
    (lastStatusChange?.code === 'in_call_not_recording' &&
      statusChangeCodeCounts.in_call_not_recording === 1) ||
    (lastStatusChange?.code === 'recording_permission_allowed' &&
      statusChangeCodeCounts.recording_permission_allowed === 1);

  const hasFatalError = hasAnyStatusChangeOf('fatal');
  const errorState = errorStateData(statusChanges);

  return {
    botWasScheduled: !!bot?.id,
    recordingWasStarted: hasAnyStatusChangeOf('in_call_recording'),
    botIsInMeeting: recordingWasStarted || hasAnyStatusChangeOf('in_call_not_recording'),
    isLive,
    isOnPause,
    isActivelyRecording: isLive && !isOnPause,
    hasTranscripts: bot?.num_of_transcripts > 0,
    insufficientTranscripts,
    startedRecordingAt: getFirstStatusChangeOf('in_call_recording')?.created_at ?? null,
    endedRecordingAt: getFirstStatusChangeOf('call_ended')?.created_at ?? null,
    recordingPausedSegments: findRecordingTransitions(statusChanges),
    isCallEnded,
    isDone,
    botWasKicked:
      hasAnySubCodeOf('call_ended', 'bot_received_leave_call') ||
      hasAnySubCodeOf('call_ended', 'bot_kicked_from_call'),
    botWasNeverAdmitted: hasAnySubCodeOf('call_ended', 'timeout_exceeded_waiting_room'),
    isRecordingAcquired: hasAnyStatusChangeOf('recording_acquired'),
    wasSummarized: !!bot?.summary,
    didNotGenerate: didNotGenerate(hasFatalError, isDone, statusChanges, bot),
    lastStatusChange,
    errorStateSubCode: errorState?.subCode,
    errorStateMessage: errorState?.message,
    inWaitingRoom: lastStatusChange?.code === 'in_waiting_room',
    isJoining,
    hasFatalError,
    scheduledReason: getScheduledReason(bot)
  };
};

export function getScheduledReason(bot) {
  switch (bot?.origin) {
    case 'Auto_By_Person':
      return `User auto-scheduling enabled for ${bot?.creator?.name}`;
    case 'Auto_By_Tenant':
      return 'Tenant-level auto-scheduling enabled';
    case 'Manual':
      return `Manually added by ${bot?.creator?.name}`;
    default:
      return '';
  }
}

// https://foraday.atlassian.net/browse/FORA-1585
// the 'done' and 'fatal' status_changes events from pusher also include a num_of_summaries field,
// even though that does not exist on the bot record itself from the api. We can only show didNotGenerate
// assuredly unless
//
// 1. There's a fatal error and num_of_summaries is undefined (i.e. latest value is from API)
// 2. There's a fatal error and num_of_summaries is not explicitly greater than 0
//     (i.e. rare case where Pusher sends us a 'fatal' status_change but the summary still came through)
// 3. There's a 'done' status_change from pusher and it explicitly has zero num_of_summaries on it
// 4. There's a fatal error or a 'done' status change and the bot has no summary
export function didNotGenerate(hasFatalError, isDone, statusChanges, bot) {
  if ((hasFatalError || isDone) && some(statusChanges, (sc) => sc?.num_of_summaries > 0)) {
    return false;
  }

  return (isDone || hasFatalError) && !bot?.summary;
}

// Finds the first occurrence of an error state code, and
// returns the sub-code to be displayed to the user
export function errorStateData(statusChanges) {
  const targetCodes = ['call_ended', 'fatal', 'recording_permission_denied'];

  for (const statusChange of statusChanges) {
    if (targetCodes.includes(statusChange.code)) {
      if (statusChange.sub_code)
        return {
          subCode: statusChange?.sub_code,
          message: statusChange?.message
        };
    }
  }

  return {};
}

function findRecordingTransitions(statusChanges) {
  const transitions = [];
  for (let i = 0; i < statusChanges.length - 1; i++) {
    const currChange = statusChanges[i];
    const nextChange = statusChanges[i + 1];
    if (currChange.code === 'in_call_not_recording' && nextChange.code === 'in_call_recording') {
      const prevChange = statusChanges[i - 1];
      if (prevChange?.code === 'in_call_recording') {
        transitions.push({
          transition: true,
          absolute_start_time: currChange.created_at,
          to: nextChange.created_at
        });
      }
    }
  }

  return transitions;
}

/**
 * @typedef {Object} MeetingBotStatuses
 * @property {boolean} botWasScheduled
 * @property {boolean} recordingWasStarted
 * @property {boolean} botIsInMeeting
 * @property {boolean} isLive
 * @property {boolean} isOnPause
 * @property {boolean} isActivelyRecording
 * @property {boolean} hasTranscripts
 * @property {boolean} isDone
 * @property {boolean} isJoining
 * @property {boolean} hasFatalError
 * @property {Date} startedRecordingAt
 * @property {Date} endedRecordingAt
 * @property {boolean} isCallEnded
 * @property {boolean} botWasKicked
 * @property {boolean} inWaitingRoom
 * @property {boolean} botWasNeverAdmitted
 * @property {boolean} isRecordingAcquired
 * @property {boolean} wasSummarized
 * @property {boolean} didNotGenerate
 * @property {boolean} insufficientTranscripts
 * @property {string} errorStateMessage
 * @property {string} errorStateSubCode
 * @property {StatusChange} lastStatusChange
 * @property {any[]} recordingPausedSegments
 *
 * @param {Bot} bot
 * @returns {MeetingBotStatuses}
 */
export const useMeetingBotStatuses = (bot) => {
  const statuses = useMemo(
    () => getMeetingBotStatuses(bot),
    [bot?.num_of_status_changes, bot?.num_of_transcripts, bot?.summary]
  );
  return statuses;
};

/**
 * Fetches meeting transcript data based on if it's live/replayed with Pusher or already completed
 * - If call has ended, ungroupedSummaries will get grouped into topicGroup called "Additional Discussion"
 * @param {Meeting} meeting
 * @param {Bot} bot
 * @returns {ParsedMeetingTranscript}
 */
export const useTopicGroupsAndSummaries = (meeting, bot) => {
  const { isLive, startedRecordingAt, recordingPausedSegments, hasTranscripts } =
    useMeetingBotStatuses(bot);
  const transcriptStartTime = startedRecordingAt ?? meeting?.start_at ?? null;
  const extractedTopicsAndSummaries = useMemo(() => {
    if (meeting && bot) {
      let { topicGroups, ungroupedSummaries } = parseRawTranscripts(
        bot?.transcripts,
        transcriptStartTime,
        recordingPausedSegments,
        true
      );
      if (ungroupedSummaries.length > 0 && !isLive) {
        const additionalDiscussionTopicGroup = {
          transcriptIndex: ungroupedSummaries[0]?.transcriptIndex,
          title: 'Additional Discussion',
          time: {
            rawStart: ungroupedSummaries[0]?.time?.rawStart,
            start: getPreviousItemEndTime(topicGroups, transcriptStartTime), // todo: can use ungroupedSummaries[0] ?
            rawEnd: last(ungroupedSummaries)?.time?.rawEnd,
            end: last(ungroupedSummaries)?.time?.end
          },
          summaries: ungroupedSummaries
        };
        topicGroups.push(additionalDiscussionTopicGroup);
        ungroupedSummaries = [];
      }
      return { topicGroups, ungroupedSummaries };
    } else {
      return { topicGroups: [], ungroupedSummaries: [] };
    }
  }, [
    meeting?.id,
    bot?.id,
    hasTranscripts,
    bot?.num_of_transcripts,
    isLive,
    bot?.transcripts?.length
  ]);

  return extractedTopicsAndSummaries;
};

/**
 * Hook for managing meta-level actions on meetings including
 * - RSVP
 * - Sensitivity
 * - Initiative
 * - Archiving
 *
 * @param {OptimisticUpdateConfig} _optimisticUpdateconfig
 * @returns {(action, value, meeting, pageIndex, meetingIndex) => void}
 * @description different from useMeetingManagementActions as those handle in-meeting controls like pause/play/stop
 * @see {@link /documentation/card-structure.md}
 *
 * Note: removeFora is an exception here since it's not optimistically updated. Can probably move it in here so everythings in one
 *       place but im unsure how much it would help with readability
 */
export const useMeetingMetaActions = (_optimisticUpdateConfig) => {
  const toast = useStyledToast();
  const optimisticUpdateConfig = {
    enabled: true,
    ..._optimisticUpdateConfig
  };
  const updateRSVP = useManageRSVPStatus(optimisticUpdateConfig);
  const { mutate: updateMeetingInitiative } = useUpdateMeetingInitiative({
    optimisticUpdateConfig
  });

  return (action, value, meeting, pageIndex, meetingIndex) => {
    const meetingTimeStatus = getMeetingTimeStatus(meeting, new Date());
    let mutationVars = { id: meeting?.id, value };
    if (optimisticUpdateConfig.type === 'infinite') {
      mutationVars = { ...mutationVars, pageIndex, recordIndex: meetingIndex };
    }

    if (action === 'rsvp') updateRSVP(meeting?.id, value); // needs to be async?
    else if (action === 'initiative') {
      updateMeetingInitiative(
        {
          id: meeting?.id,
          params: { propagate: true, rerun: meetingTimeStatus === 'done' },
          value: mutationVars?.value?.id, // just want id, value is the full selected initiative
          optimisticUpdateValue: mutationVars.value,
          optimisticUpdateAttribute: 'initiative',
          ...omit(mutationVars, 'value')
        },
        {
          onSuccess: () => toast({ status: 'success', title: 'Meeting Category Updated' })
        }
      );
    }
  };
};
