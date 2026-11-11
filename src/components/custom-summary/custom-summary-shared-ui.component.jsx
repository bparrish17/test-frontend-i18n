import { Divider, HStack, Stack } from '@chakra-ui/react';

export const CustomSummaryStep = ({ children }) => {
  return (
    <Stack
      gap={6}
      p={6}
    >
      {children}
    </Stack>
  );
};

export const CustomSummaryModalFooter = ({ children }) => {
  return (
    <Stack
      w='full'
      bgColor='surface.containerLow'
    >
      <Divider />
      <HStack
        w='full'
        p={6}
        pt={4}
      >
        {children}
      </HStack>
    </Stack>
  );
};
