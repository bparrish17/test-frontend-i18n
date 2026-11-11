import { HStack, Text, Spacer } from '@chakra-ui/react';

export default function MeetingPageSectionHeader({ text, children, ...props }) {
  return (
    <HStack {...props}>
      <Text variant='content-section-header'>{text}</Text>
      <Spacer />
      {children}
    </HStack>
  );
}
