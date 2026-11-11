import {
  Flex,
  Box,
  Stack,
  HStack,
  Text,
  Center,
  Spinner,
  Button,
  SkeletonText
} from '@chakra-ui/react';
import { memo, useMemo } from 'react';
import { format, differenceInSeconds } from 'date-fns';

import { useUserStore } from '@store/app.store';
import { SFRecordCircleFilledIcon } from '@assets/icons';
import { useMeetingBotStatuses, useUpdateBotFromPusherEvent } from '@util/hooks';
import {
  fetchedTranscriptsUpdaterFn,
  parseRawTranscripts,
  formatMeetingDuration
} from '@util/helpers';
import { useBotTranscripts } from '@services/query-services/bots.query-service';
import { useTranslation } from 'react-i18next';

export default function Transcripts({ bot, pauseResume, disclosure, transcriptRef }) {
  const user = useUserStore((state) => state.user);
  const isGuest = !!user?.isGuest;

  const { isLive, isOnPause, startedRecordingAt, recordingPausedSegments, lastStatusChange } =
    useMeetingBotStatuses(bot);
  const { data: fetchedTranscripts, isLoading } = useBotTranscripts(bot?.id, {
    enabled: !!bot?.id && !!(user && !isGuest)
  });

  useUpdateBotFromPusherEvent(
    bot?.id,
    'transcripts',
    ['recall/bots', 'transcripts', { id: bot?.id }],
    fetchedTranscriptsUpdaterFn
  );

  const onPauseResumeClicked = () => {
    pauseResume();
    disclosure.onClose();
  };

  // stock paused transcript object to use when the meeting is currently live
  // but is in a paused state.  Mostly resembles an actual transcript object
  const pausedTranscript = {
    message: `FORA has been paused for ${formatMeetingDuration(
      new Date(),
      new Date(lastStatusChange.created_at)
    )}`,
    transition: true,
    onClickAction: onPauseResumeClicked,
    speaker: 'Paused',
    start_time: differenceInSeconds(new Date(lastStatusChange.created_at), startedRecordingAt)
  };

  const transcripts = useMemo(() => {
    const validTranscripts = bot?.transcripts || fetchedTranscripts;
    return validTranscripts
      ? parseRawTranscripts(validTranscripts, startedRecordingAt, recordingPausedSegments, false)
          .transcripts
      : [];
  }, [
    bot?.num_of_transcripts,
    fetchedTranscripts?.length,
    startedRecordingAt,
    recordingPausedSegments?.length
  ]);

  if (isLoading && !bot?.transcripts) {
    return (
      <Center p={11}>
        <Spinner
          size='lg'
          color='brandPrimary.primary'
          thickness='3px'
        />
      </Center>
    );
  }

  return (
    <>
      <Flex
        flexDir='column'
        w='full'
        ref={transcriptRef}
      >
        {transcripts?.map((transcript, index) => {
          const isLastElement = index === transcripts.length - 1;
          return (
            <Transcript
              key={`${transcript?.message}-${transcript?.start_time}`}
              transcript={transcript}
              meetingStartTime={startedRecordingAt}
              showLoader={isLastElement && isLive && !isOnPause}
            />
          );
        })}
        {isLive && isOnPause && (
          <Transcript
            key={`${pausedTranscript?.message}-${pausedTranscript?.start_time}`}
            transcript={pausedTranscript}
            meetingStartTime={startedRecordingAt}
          />
        )}
      </Flex>
    </>
  );
}

const Transcript = memo(({ transcript, meetingStartTime, showLoader }) => {
  const { t } = useTranslation();

  const formattedTime = format(meetingStartTime + transcript?.start_time * 1000, 'h:mm');
  const transition = transcript.transition || false;

  return (
    <HStack
      w='full'
      alignItems='flex-start'
      spacing='15px'
      bgColor={transition ? 'critical.container' : 'surface.containerLow'}
    >
      <Stack
        w={{ base: '30%', sm: '25%' }}
        alignItems='flex-end'
        pt={2}
      >
        <Text
          lineHeight={1.25}
          fontWeight={500}
          noOfLines={1}
          color={transition ? 'critical.primary' : 'surface.onSurface'}
          textAlign='right'
        >
          {transcript?.speaker}
        </Text>
        <Text
          fontSize='sm'
          lineHeight={1.25}
          variant='aeonik'
          color={transition ? 'critical.primary' : 'surface.onSurfaceVariant'}
          textAlign='right'
        >
          {formattedTime}
        </Text>
      </Stack>
      <Box
        flex={1}
        minHeight='100px'
        bgColor={transition ? 'critical.container' : 'white'}
        p={3}
      >
        <Flex
          alignItems='center'
          justifyContent='space-between'
        >
          <Text
            fontSize='sm'
            color={transition ? 'critical.primary' : 'surface.onSurfaceVariant'}
            lineHeight={1.25}
          >
            {transcript?.message}
          </Text>
          {transcript.onClickAction && (
            <Button
              leftIcon={
                <SFRecordCircleFilledIcon
                  boxSize={4}
                  color='critical.primary'
                />
              }
              variant='reskinWhite'
              color='surface.onSurfaceVariant'
              size='reskinSm'
              onClick={transcript.onClickAction}
            >
              {t('transcripts.resumeRecording')}
            </Button>
          )}
        </Flex>
        {showLoader && (
          <HStack pt={3}>
            <Spinner
              size='sm'
              color='surface.outline'
            />
            <SkeletonText
              w='12%'
              noOfLines={1}
            />
            <SkeletonText
              w='7%'
              noOfLines={1}
            />
            <SkeletonText
              w='2%'
              noOfLines={1}
            />
          </HStack>
        )}
      </Box>
    </HStack>
  );
});
