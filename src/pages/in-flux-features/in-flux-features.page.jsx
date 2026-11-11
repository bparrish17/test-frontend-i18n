import React from 'react';
import { Alert, AlertIcon, Box, Container, Divider, Heading, Text, VStack } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';
import PulseLaunchContainer from '@components/pulse/pulse-launch-container.jsx';

/**
 * In-Flux Features page
 * This page displays features that are currently in development
 *
 * @returns {JSX.Element} In-flux features page
 */
export default function InFluxFeaturesPage() {
  const { checkGate } = useStatsigClient();
  const enablePulses = checkGate('pulses');

  return (
    <Container
      maxW='container.lg'
      py={8}
    >
      <VStack
        spacing={8}
        align='stretch'
      >
        <Box>
          <Heading
            as='h1'
            size='xl'
            mb={2}
          >
            In-Flux Features
          </Heading>
          <Text
            fontSize='lg'
            color='surface.onSurfaceVariant'
            mb={4}
          >
            This page contains features that are currently in development and not yet fully
            released. Use this page to test and preview these features.
          </Text>
          <Alert
            status='info'
            variant='subtle'
            borderRadius='md'
          >
            <AlertIcon />
            Features shown here may not be stable and could change significantly before final
            release.
          </Alert>
        </Box>

        <Divider />

        {/* Pulses Feature */}
        <Box>
          <Heading
            as='h2'
            size='lg'
            mb={4}
          >
            Pulses
          </Heading>
          <Text mb={4}>
            Pulses are short, AI-generated summaries that provide quick insights into conversations
            and meetings.
          </Text>

          {enablePulses ? (
            <Box
              p={5}
              borderWidth='1px'
              borderRadius='lg'
              shadow='sm'
              bg='white'
            >
              <Heading
                as='h3'
                size='md'
                mb={4}
                color='green_system.500'
              >
                Pulses Feature is Enabled
              </Heading>
              <PulseLaunchContainer />
            </Box>
          ) : (
            <Alert
              status='warning'
              variant='subtle'
              borderRadius='md'
            >
              <AlertIcon />
              The Pulses feature is not currently enabled for your account. Enable the
              &apos;pulses&apos; feature gate to test this feature.
            </Alert>
          )}
        </Box>

        {/* Additional placeholder for future in-development features */}
        <Box
          p={5}
          borderWidth='1px'
          borderRadius='lg'
          bg='container.surfaceContainerLowest'
          opacity={0.7}
        >
          <Heading
            as='h3'
            size='md'
            mb={2}
            color='surface.onSurfaceVariant'
          >
            Additional In-Development Features
          </Heading>
          <Text color='surface.onSurfaceVariant'>
            More features in development will appear here as they become available for testing.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
