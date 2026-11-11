import { Flex, Text, Stack, HStack, IconButton, Heading, Show } from '@chakra-ui/react';
import { format } from 'date-fns';

import { ChevronLeftIcon, ChevronRightIcon } from '@assets/icons';
import { useAgendaDateScroll } from '@util/hooks';
import ReskinCalendar from '@components/general/reskin-calendar.component';

export default function AgendaHeader({ date, setDate, showCalendar = true }) {
  const { currentTime, handlePrevDayClick, handleNextDayClick } = useAgendaDateScroll();

  return (
    <Stack gap={3}>
      <Show
        above='1024px'
        ssr={false}
      >
        <Heading size='lg'>
          <ClockHeader currentTime={currentTime} />
        </Heading>
      </Show>
      <Flex
        justify='space-between'
        align='center'
      >
        <Show
          above='1024px'
          ssr={false}
        >
          <Heading
            size='3xl'
            fontWeight={700}
          >
            {format(date, 'cccc, MMMM d')}
          </Heading>
        </Show>
        {showCalendar && (
          <HStack gap={1}>
            <IconButton
              icon={<ChevronLeftIcon fontSize='24px' />}
              colorScheme='surface'
              variant='reskinGhost'
              isRound
              size='sm'
              onClick={handlePrevDayClick}
            />
            <ReskinCalendar
              date={date}
              setDate={setDate}
            />
            <IconButton
              icon={<ChevronRightIcon fontSize='24px' />}
              colorScheme='surface'
              variant='reskinGhost'
              isRound
              size='sm'
              onClick={handleNextDayClick}
            />
          </HStack>
        )}
      </Flex>
    </Stack>
  );
}

function ClockHeader({ currentTime }) {
  return <Text fontWeight={600}>{currentTime}</Text>;

  // const meetingsCount = meetings?.length ?? 0;
  //
  // return meetingsCount >= 3 ? (
  //   <Text
  //     fontWeight={600}
  //     cursor="pointer"
  //     _hover={{ textDecor: 'underline' }}
  //     onClick={handleScrollToMeeting}
  //   >
  //     {currentTime}
  //   </Text>
  // ) : (
  //   <Text fontWeight={600}>{currentTime}</Text>
  // );
}

// const handleScrollToMeeting = () => {
//  scrollToCurrentAgendaMeeting(meetings, meetingRefs, agendaMainRef);
// };
