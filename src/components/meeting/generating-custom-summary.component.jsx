import { Stack, Text, StackDivider, Progress } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function GeneratingCustomSummary() {
  const [progress, setProgress] = useState(0); // Initialize progress to 0

  useEffect(() => {
    const totalDuration = 2 * 60 * 1000; // Total duration in milliseconds (2 minutes)
    const updateInterval = 100; // Update every 100ms
    const step = (100 * updateInterval) / totalDuration; // Calculate progress step

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + step, 100)); // Increment progress until it reaches 100
    }, updateInterval);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      layerStyle='section-card'
      divider={<StackDivider style={{ margin: 0 }} />}
    >
      <Stack
        p={10}
        m={3}
        rounded='md'
        bgColor='surface.containerLow'
      >
        <Text
          color='brandPrimary.onContainer'
          fontSize='md'
          my={1}
        >
          Generating...
        </Text>
        <Progress
          value={progress}
          size='lg'
          borderRadius='full'
          variant='onSurfaceVariant'
          hasStripe
        />
        <Text
          color='surface.onSurfaceVariant'
          fontSize='sm'
          my={1}
        >
          Your custom summary will be available to view in a few minutes or less. You&apos;ll
          receive a notification when it&apos;s ready.
        </Text>
      </Stack>
    </Stack>
  );
}
