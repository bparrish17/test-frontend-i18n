import { HStack, VStack, Heading, Text } from '@chakra-ui/react';

export default function CustomSummaryMenuHeader({ icon, heading, subtext }) {
  return (
    <HStack>
      {/* Left Icon */}
      {icon && <>{icon}</>}

      {/* Text Section */}
      <VStack
        gap={1}
        p={3}
        alignItems='flex-start'
      >
        <Heading fontSize='md'>{heading}</Heading>
        <Text
          color='surface.onSurfaceVariant'
          fontSize='xs'
          fontWeight={400}
        >
          {subtext}
        </Text>
      </VStack>
    </HStack>
  );
}
