import { Stack, HStack, Icon, Spacer, Text } from '@chakra-ui/react';
import { CalendarIcon } from '@assets/icons';
import SourceInfoStack from '@components/general/source-info-stack.component.jsx';

export default function MeetingStackItem({ meeting, children, containerProps, titleProps }) {
  const participants = meeting?.nylas?.participants ?? [];
  return (
    <HStack
      spacing={4}
      w='full'
      {...containerProps}
    >
      <Stack gap={2}>
        <HStack>
          <Icon as={CalendarIcon} />
          <Text
            fontWeight={700}
            fontSize='sm'
            {...titleProps}
          >
            {meeting?.title}
          </Text>
        </HStack>
        <SourceInfoStack
          source={meeting}
          sourceType='Meeting'
          participants={participants}
          participantsFormat='short'
          showSourceDate
          sourceDateFormat='short-P'
          gap={6}
        />
      </Stack>
      <Spacer />
      {children}
    </HStack>
  );
}
