import { Text, HStack, Icon } from '@chakra-ui/react';
import { format } from 'date-fns';

import ReskinCalendar from '@components/general/reskin-calendar.component';
import { SFCalendarIcon } from '@assets/icons';

/** @param {{type: 'start' | 'end'}} */
export default function DateRangeInput({ date, setDate, type = 'start' }) {
  const unsetText = type === 'start' ? 'Start Date' : 'End Date';
  return (
    <ReskinCalendar
      date={date ?? new Date()}
      setDate={setDate}
      trigger={
        <HStack
          border='reskin'
          rounded='lg'
          py={2}
          px={3}
          gap={3}
          fontWeight={500}
        >
          <Text>{date ? format(date, 'MM/dd/yy') : unsetText}</Text>
          <Icon
            as={SFCalendarIcon}
            boxSize={4}
          />
        </HStack>
      }
    />
  );
}
