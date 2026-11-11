import {
  CardBody,
  CardFooter,
  Link,
  Box,
  Heading,
  Icon,
  Tag,
  Button,
  Text
} from '@chakra-ui/react';
import { trim, truncate } from 'lodash-es';
import { useNavigate } from 'react-router-dom';

import SourceInfoStack from '@components/general/source-info-stack.component';
import { Card } from '@components/general/card/card-structure';
import { ChevronRightIcon, AlertTriangle } from '@assets/icons';
import { useTranslation } from 'react-i18next';

const ASTERISK_REGEX = /\*/g;

export default function ReadOnlyMeetingCard({
  meeting,
  // card, // can remove?
  showGenerationDate = true,
  ...cardProps
}) {
  const sourceType = 'Meeting';
  const navigate = useNavigate();

  const participants = meeting.nylas?.participants;

  const meetingStatus = deriveMeetingStatus(meeting);
  const isLive = meetingStatus.isLive;

  const generateTextBody = () => {
    if (meetingStatus.isLive) {
      if (meetingStatus.isStuckInWaitingRoom) {
        return 'Fora has joined the waiting room for this meeting.';
      } else if (!meetingStatus.isRecordingPermissionGranted) {
        return 'Fora has joined this meeting but has not been granted permission to transcribe the meeting.';
      } else if (meetingStatus.wasRemovedFromForaApp) {
        return 'Fora was removed from this meeting from the Fora app.';
      } else if (meetingStatus.wasRemovedFromMeetingPlatform) {
        return 'Fora was removed from this meeting by the meeting organizer.';
      } else {
        return 'Fora is summarizing this meeting live.';
      }
    } else if (meetingStatus.isUpcoming) {
      return 'This meeting is upcoming.';
    } else if (meeting?.bot?.summary) {
      return truncate(meeting?.bot?.summary?.replace(ASTERISK_REGEX, ''), { length: 200 });
    } else {
      return 'Fora was unable to complete a summary of this meeting.';
    }
  };

  const generateButtons = () => {
    if (meetingStatus.isUpcoming) {
      return '';
    } else if (isLive) {
      return (
        <LiveButtons
          meetingId={meeting.id}
          meetingUrl={meeting.url}
        />
      );
    } else {
      return (
        <NotLiveButtons
          meetingId={meeting.id}
          hasSummary={!!meeting?.bot?.summary}
        />
      );
    }
  };

  return (
    <Card
      pt={4}
      maxW='720px'
      rounded={{ base: 'none', sm: '2xl' }}
      {...cardProps}
      paddingTop='24px'
      paddingBottom='6px'
    >
      <CardBody
        display='flex'
        flexDir='column'
        gap={2}
        py={0}
        pl={6}
        pr={5}
      >
        <Box
          display='flex'
          alignItems='center'
          onClick={() => {
            navigate(`/meeting/${meeting.id}`);
          }}
          cursor='pointer'
          marginBottom='10px'
        >
          {isLive ? <LiveMeetingTag /> : null}

          <Heading
            marginRight='5px'
            size='md'
            display='inline-flex'
            alignItems='center'
          >
            {trim(meeting?.title, '"')}
          </Heading>
          <ChevronRightIcon
            color='surface.onSurfaceVariant'
            size='18px'
          />
        </Box>
        <Box>{generateTextBody()}</Box>
        {generateButtons()}
      </CardBody>
      <CardFooter
        borderBottomRadius='2xl'
        px={6}
        pl={6}
        pr='22px'
        gap={4}
        alignItems='center'
      >
        <SourceInfoStack
          gap={4}
          source={{ url: meeting.url, start_at: meeting.start_at, end_at: meeting.end_at }}
          sourceType={sourceType}
          participants={participants}
          participantsFormat='short'
          showSourceDate
          showGenerationDate={showGenerationDate}
          sourceDateFormat='short-P'
        />
      </CardFooter>
    </Card>
  );
}

const LiveMeetingTag = () => {
  const { t } = useTranslation();

  return (
    <Tag
      size='lg'
      variant='content-section-header'
      color='#FFF'
      backgroundColor='#E0463B'
      borderRadius='15px'
      marginRight='10px'
    >
      {t('readOnlyMeetingCard.live')}
    </Tag>
  );
};

function deriveMeetingPlatform(meetingUrl) {
  if (meetingUrl.includes('meet.google')) {
    return 'Google Meet';
  } else if (meetingUrl.includes('teams.microsoft.com')) {
    return 'Microsoft Teams';
  } else {
    return 'Zoom';
  }
}

function LiveButtons({ meetingId, meetingUrl }) {
  const { t } = useTranslation();

  const meetingPlatform = deriveMeetingPlatform(meetingUrl);
  return (
    <Box>
      <Button
        backgroundColor='#00A5CC'
        color='#FFF'
        _hover={{ backgroundColor: '#0494D1' }}
        width={['full', '30%']}
        marginRight='15px'
        marginBottom={['10px', 0]}
      >
        <Link
          _hover={{ textDecoration: 'none' }}
          href={`/meeting/${meetingId}`}
        >
          {t('readOnlyMeetingCard.followLive')}
        </Link>
      </Button>
      <Button width={['full', '30%']}>
        <Link
          _hover={{ textDecoration: 'none' }}
          href={meetingUrl}
          target='_blank'
        >
          {t('readOnlyMeetingCard.joinWith', { meetingPlatform })}
        </Link>
      </Button>
    </Box>
  );
}

function NotLiveButtons({ meetingId, hasSummary = true }) {
  const { t } = useTranslation();

  return (
    <Box>
      {hasSummary ? (
        <Button width={['full', '30%']}>
          <Link
            _hover={{ textDecoration: 'none' }}
            href={`/meeting/${meetingId}`}
          >
            {t('readOnlyMeetingCard.viewSummary')}
          </Link>
        </Button>
      ) : (
        <Button
          width={['full', '30%']}
          backgroundColor='#FFF'
          color='critical.inverse'
          border='2px solid'
          borderColor='critical.inverse'
          _hover={{
            backgroundColor: '#FFF'
          }}
        >
          <Link
            _hover={{ textDecoration: 'none' }}
            href={`/meeting/${meetingId}`}
            display='flex'
            alignItems='center'
          >
            <Icon as={AlertTriangle} />
            &nbsp;
            <Text>{t('readOnlyMeetingCard.noSummary')}</Text>
          </Link>
        </Button>
      )}
    </Box>
  );
}

function deriveMeetingStatus(meeting) {
  const now = Date.now();
  const hasMeetingStarted = now - meeting.start_at > -1;
  const hasMeetingEnded = now - meeting.end_at > -1;

  const statusChangeHistory = meeting?.bot?.status_changes || [];

  const hasStatusChange = (statusChangeCode, statusChangeSubCode) => {
    return statusChangeHistory.some((statusChange) => {
      let subCodeResult = true;
      if (statusChangeSubCode) {
        subCodeResult = statusChange.sub_code === statusChangeSubCode;
      }
      return subCodeResult && statusChangeCode === statusChange.code;
    });
  };

  const isBotDone = hasStatusChange('done');
  const isStuckInWaitingRoom =
    hasStatusChange('in_waiting_room') &&
    !(hasStatusChange('in_call_recording') || hasStatusChange('in_call_not_recording'));
  const isRecordingPermissionGranted = hasStatusChange('in_call_recording');
  const wasRemovedFromForaApp = hasStatusChange('call_ended', 'bot_received_leave_call');
  const wasRemovedFromMeetingPlatform = hasStatusChange('call_ended', 'bot_kicked_from_call');

  return {
    isUpcoming: !hasMeetingStarted && !hasMeetingEnded,
    isLive: hasMeetingStarted && !hasMeetingEnded,
    isStuckInWaitingRoom,
    isRecordingPermissionGranted,
    wasRemovedFromForaApp,
    wasRemovedFromMeetingPlatform,
    isBotDone
  };
}
