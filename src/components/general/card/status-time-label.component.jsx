import {
  StatusDidNotAttendIcon,
  StatusLiveUnscheduledIcon,
  StatusMissingLinkIcon,
  StatusNotAdmittedIcon,
  StatusPausedIcon,
  StatusRecordingIcon,
  StatusScheduledIcon,
  StatusSummarizedIcon,
  StatusUnscheduledIcon
} from '@assets/icons';
import { HStack, Spinner, Text, useConst } from '@chakra-ui/react';
import { useBreakpoints, useControlBarState, useMeetingTimeStatus } from '@util/hooks';
import { format, formatDistanceStrict, isSameYear, isToday } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function StatusTimeLabel({
  meeting,
  bot,
  opacity = 1,
  includeDate, // reskin todo: this is uber prop-drilled, find a more sustainable way to pass props/configuration into the reskin meeting card
  showAgoText = false,
  showFullDate = false,
  showStatus = true,
  isLensSourceCard,
  ...props
}) {
  const { t } = useTranslation();

  const now = useConst(new Date());
  const stateForMeetingUI = useControlBarState(meeting, bot);
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const isLive = meetingTimeStatus === 'live';
  const isLiveRecording = stateForMeetingUI.text === 'Active • Recording';

  const status = useMemo(() => {
    switch (stateForMeetingUI?.text) {
      case 'Fora is not Scheduled':
        return {
          bgColor: 'surface.containerLowest',
          color: 'surface.onSurfaceVariant',
          leftElement: isLive ? <StatusLiveUnscheduledIcon /> : <StatusUnscheduledIcon />
        };
      case 'Fora is Scheduled':
        return {
          bgColor: 'brandPrimary.primary',
          color: 'brandPrimary.onPrimary',
          leftElement: <StatusScheduledIcon />
        };
      case 'Fora Needs a Link':
        return {
          bgColor: 'critical.primary',
          color: 'critical.onPrimary',
          leftElement: <StatusMissingLinkIcon onLabel={isLive} />
        };
      case 'Summarized':
        return {
          bgColor: 'brandPrimary.primary',
          color: 'brandPrimary.onPrimary',
          leftElement: <StatusSummarizedIcon onLabel={isLive} />
        };
      case 'Fora Was Not Admitted':
        return {
          bgColor: 'critical.container',
          color: 'critical.primary',
          leftElement: <StatusNotAdmittedIcon onLabel={isLive} />
        };
      case 'Fora Was Kicked':
        return {
          bgColor: 'critical.container',
          color: 'critical.primary',
          leftElement: <StatusNotAdmittedIcon onLabel={isLive} />
        };
      case 'Fora Did Not Attend':
        return {
          bgColor: 'surface.containerLowest',
          color: 'surface.onSurfaceVariant',
          leftElement: <StatusDidNotAttendIcon />
        };
      case 'Active • Recording':
        return {
          bgColor: 'live.primary',
          color: 'live.onPrimary',
          leftElement: <StatusRecordingIcon onLabel={isLive} />
        };
      case 'Paused':
        return {
          bgColor: 'live.container',
          color: 'live.primary',
          leftElement: <StatusPausedIcon />
        };
      case 'Summarizing':
        return {
          bgColor: 'brandPrimary.primary',
          color: 'brandPrimary.onPrimary',
          leftElement: (
            <Spinner
              size='xs'
              speed='0.8s'
              color={isLive ? 'white' : 'brandPrimary.primary'}
            />
          )
        };
      default:
        return stateForMeetingUI;
    }
  }, [isLive, stateForMeetingUI]);

  const { isMobile } = useBreakpoints();

  if (!meeting?.start_at || !meeting?.end_at) {
    return null;
  }

  let timeText = format(meeting?.start_at, 'hh:mm') + '-' + format(meeting?.end_at, 'hh:mm aaa');
  if (isMobile) {
    timeText = format(meeting?.start_at, 'hh:mm aaa');
  }

  let dateFormat = isSameYear(meeting?.start_at, new Date()) ? 'E LLL d, ' : 'PP, ';
  if (showFullDate) {
    dateFormat = 'EEEE, MMMM d, ';
  }

  return (
    <HStack
      bgColor={isLiveRecording ? status?.bgColor : 'transparent'}
      color={isLiveRecording ? status?.color : 'surface.onSurfaceVariant'}
      rounded='full'
      px={1}
      py={0.5}
      pr={3}
      pl={2}
      fontSize='10px'
      fontWeight={500}
      w='fit-content'
      {...props}
    >
      {showStatus && !isLensSourceCard && status?.leftElement}
      <Text>
        {includeDate && (
          <Text
            as='span'
            fontSize={{ base: 'xs', xl: '13px' }}
            fontWeight={600}
          >
            {isToday(meeting?.start_at)
              ? t('statusTimeLabel.today')
              : format(meeting?.start_at, dateFormat)}
          </Text>
        )}
        <Text
          as='span'
          whiteSpace='nowrap'
          fontSize={{ base: 'xs', xl: '13px' }}
          fontWeight={600}
          opacity={opacity}
        >
          {timeText}
        </Text>
      </Text>
      {meetingTimeStatus === 'done' && showAgoText && (
        <Text
          fontSize={{ base: 'xs', xl: '13px' }}
          fontWeight={600}
          opacity={opacity}
          whiteSpace='nowrap'
          alignSelf='flex-start'
        >
          {formatDistanceStrict(meeting?.end_at || now, now, {
            addSuffix: true
          })}
        </Text>
      )}
    </HStack>
  );
}
