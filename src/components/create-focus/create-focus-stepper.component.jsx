import { CheckIconBold } from '@assets/icons';
import { Box, Stack, Flex, HStack, Spacer, Heading, Text, Icon, Button } from '@chakra-ui/react';

// Wrapper card UI component for steps in create focus flow
export default function CreateFocusStepper({
  title,
  subtitle,
  step,
  actionText = 'Continue',
  actionDisabled = false,
  actionLoading = false,
  onActionClick,
  children
}) {
  return (
    <Stack
      w='full'
      h='full'
      gap={8}
      pt={8}
    >
      {/* Section Header */}
      <Stack gap={4}>
        <Flex justify='space-between'>
          <Heading size='md'>{title}</Heading>
          <Spacer />
          <HStack>
            <Text
              color='brandPrimary.primary'
              fontWeight={600}
            >
              Step {Number(step) + 1} of 4
            </Text>
            <StepPageIndicators step={step} />
          </HStack>
        </Flex>
        <Text>{subtitle}</Text>
      </Stack>

      {/* Content */}
      {children}

      {/* Next Step/Submit Button */}
      <Button
        variant='reskinPrimary'
        mt={1}
        isDisabled={actionDisabled}
        isLoading={actionLoading}
        onClick={onActionClick}
      >
        {actionText}
      </Button>
    </Stack>
  );
}

function StepPageIndicators({ step }) {
  const Circle = ({ isCurrent }) => (
    <Box
      rounded='full'
      w={2}
      h={2}
      bgColor={isCurrent ? 'brandPrimary.primary' : 'neutral.outlineVariant'}
    />
  );

  const StepIndicator = ({ index }) => {
    if (index === step) {
      return <Circle isCurrent />;
    } else if (index < step) {
      return (
        <Icon
          as={CheckIconBold}
          boxSize={2}
          color='brandPrimary.primary'
        />
      );
    } else {
      return <Circle />;
    }
  };

  return (
    <HStack
      px={3}
      py={2}
    >
      <StepIndicator index={0} />
      <StepIndicator index={1} />
      <StepIndicator index={2} />
      <StepIndicator index={3} />
    </HStack>
  );
}
