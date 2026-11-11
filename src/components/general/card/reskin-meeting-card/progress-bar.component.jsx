import { HStack, Progress, Text } from '@chakra-ui/react';
import { SFClockIcon } from '@assets/icons';
import { formatTimeDurationFromZero, seconds } from '@util/helpers';

export default function ProgressBar({
  elapsedTime,
  isDone,
  isStartingRecording,
  botWasScheduled,
  isOnPause,
  progress
}) {
  // handle NaN
  const safeElapsedTime = elapsedTime || 0;

  if (safeElapsedTime <= 0 || isDone || isStartingRecording || !botWasScheduled) {
    return null;
  }

  return (
    <HStack
      color={isOnPause ? 'brandPrimary.primary' : 'brandPrimary.onPrimary'}
      gap={2.5}
    >
      <Progress
        value={progress * 100}
        size='xs'
        flex={1}
        borderRadius='full'
        variant={isOnPause ? 'onSecondary' : 'onPrimary'}
      />
      <SFClockIcon boxSize={4} />
      <Text fontSize='sm'>
        {safeElapsedTime > seconds(60)
          ? formatTimeDurationFromZero(safeElapsedTime, 'short')
          : '< 1 min'}
      </Text>
    </HStack>
  );
}
