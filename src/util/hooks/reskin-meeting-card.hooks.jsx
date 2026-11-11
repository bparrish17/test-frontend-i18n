import { ReskinMeetingCardContext } from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component.jsx';
import { getControlBarState } from '@util/helpers/card.helpers';
import { useLiveDate } from '@util/hooks';
import { useMeetingBotStatuses, useMeetingTimeStatus } from '@util/hooks/meeting.hooks';
import { useContext, useMemo } from 'react';

/**
 * @typedef {"Fora Needs a Link" | "Fora is not Scheduled" | "Fora is Scheduled"
 * | "Paused" | "Recording" | "Summarizing" | "Completed"
 * | "Fora Was Not Admitted" | "Fora Was Kicked"
 * | "Fora Did Not Attend" | keyof<RECALL_STATUS_CODE_MAP> } ControlBarStateText
 * Determines control bar text on left side along with colors
 * @param {Meeting} meeting
 * @param {Bot} bot
 * @returns {{ leftElement: unknown; text: ControlBarStateText; bgColor: string; color: string }}
 */
export function useControlBarState(meeting, bot) {
  const {
    botWasScheduled,
    recordingWasStarted,
    botWasKicked,
    botWasNeverAdmitted,
    isCallEnded,
    isLive,
    isDone,
    inWaitingRoom,
    wasSummarized,
    isOnPause,
    hasTranscripts,
    insufficientTranscripts,
    didNotGenerate,
    errorStateSubCode,
    errorStateMessage,
    isJoining,
    hasFatalError,
    scheduledReason
  } = useMeetingBotStatuses(bot);

  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const liveDate = useLiveDate(10000);
  const controlBarState = useMemo(() => {
    return getControlBarState(
      {
        meetingTimeStatus,
        liveDate,
        botWasScheduled,
        recordingWasStarted,
        botWasKicked,
        botWasNeverAdmitted,
        isCallEnded,
        isLive,
        isDone,
        inWaitingRoom,
        wasSummarized,
        isOnPause,
        hasTranscripts,
        insufficientTranscripts,
        didNotGenerate,
        isJoining,
        errorStateSubCode,
        errorStateMessage,
        hasFatalError,
        scheduledReason
      },
      meeting
    );
  }, [
    botWasScheduled,
    recordingWasStarted,
    isCallEnded,
    wasSummarized,
    isOnPause,
    meetingTimeStatus,
    liveDate,
    meeting?.url,
    meeting?.tags,
    isLive,
    hasTranscripts,
    botWasKicked,
    botWasNeverAdmitted,
    isDone,
    inWaitingRoom,
    insufficientTranscripts,
    didNotGenerate,
    isJoining,
    errorStateSubCode,
    errorStateMessage,
    hasFatalError,
    scheduledReason
  ]);

  return controlBarState;
}

export const useReskinMeetingCardContext = () => {
  const reskinMeetingCardContext = useContext(ReskinMeetingCardContext);
  const meeting = reskinMeetingCardContext?.meeting ?? null;
  const bot = reskinMeetingCardContext?.bot ?? null;
  const card = reskinMeetingCardContext?.card ?? null;
  const showCardActions = reskinMeetingCardContext?.showCardActions ?? false;
  const onCardActionClick = reskinMeetingCardContext?.onCardActionClick;
  const onMeetingActionClick = reskinMeetingCardContext?.onMeetingActionClick;
  const videoDisclosure = reskinMeetingCardContext?.videoDisclosure;
  const labelsModalDisclosure = reskinMeetingCardContext?.labelsModalDisclosure;
  const showShareInMenu = reskinMeetingCardContext?.showShareInMenu;

  return {
    meeting,
    bot,
    card,
    showCardActions,
    videoDisclosure,
    labelsModalDisclosure,
    onCardActionClick,
    onMeetingActionClick,
    showShareInMenu
  };
};
