import { Flex, Icon, Stack, Text, VStack, useConst } from '@chakra-ui/react';
import { isBefore, isToday, format } from 'date-fns';
import { groupBy } from 'lodash-es';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAgendaMeetings } from '@services/query-services/meetings.query-service';
import {
  useAgendaDateScroll,
  useAgendaMeetingActions,
  useAgendaState,
  usePopulateMeetingAttendees,
  useSetDocumentTitle,
  usePusherChannel,
  usePusherEvent
} from '@util/hooks';
import { useUserStore } from '@store/app.store';

import { CloudMoonBold } from '@assets/icons';
import AgendaHeader from '@components/agenda/agenda-header.component';
import AgendaRightRail from '@components/agenda/agenda-right-rail.component';
import YourMeetings from '@components/agenda/your-meetings.component';
import MeetingCardSkeleton from '@components/general/card/meeting-card/meeting-card-skeleton.component';
import AddCalendarButton from '@components/settings/add-calendar-button.component';
import ColumnedLayout from '@layouts/columned.layout';
import { formatCalendarDate, getNumberArray } from '@util/helpers';
import MobileAgenda from './mobile-agenda.component';
import CalendarSyncButton from '@components/agenda/calendar-sync-button.component';

const nylasErrorMessages = {
  errorNoNylasAccount: 'Connect a calendar to start using Fora',
  errorInvalidNylasAccount:
    'Calendar connection expired, please reconnect your calendar to continue.',
  errorNoCalendars: 'Connect a calendar to start using Fora'
};

export default function AgendaPage() {
  useSetDocumentTitle('Agenda - FORA');
  const queryClient = useQueryClient();
  const today = useConst(new Date());
  const user = useUserStore((state) => state.user);
  const { selectedDate, setSelectedDate } = useAgendaDateScroll();
  const {
    data: meetings,
    isLoading: isMeetingsLoading,
    isSuccess: isMeetingsSuccess
  } = useAgendaMeetings(selectedDate, { keepPreviousData: true });
  const { populatedAttendees, populatedOrganizations, isAttendeesPopulating } =
    usePopulateMeetingAttendees(meetings, isMeetingsSuccess);
  const agendaState = useAgendaState({ isMeetingsLoading, isMeetingsSuccess, meetings, user });

  const isErroredCalendar = [
    'errorNoNylasAccount',
    'errorInvalidNylasAccount',
    'errorNoCalendars'
  ].includes(agendaState);
  const currentDateText = formatCalendarDate(selectedDate);
  const tenseIndicator =
    isToday(selectedDate) || isBefore(new Date(), selectedDate) ? 'have' : 'had';
  const showMeetings =
    agendaState === 'successFewMeetings' || agendaState === 'successManyMeetings';

  const meetingAttendeeMap = useMemo(
    () => groupBy(populatedAttendees, 'meetingId'),
    [populatedAttendees]
  );

  const { channel: userIdChannel } = usePusherChannel(user?.id);
  usePusherEvent(userIdChannel, 'on_new_card', () => {
    // https://foraday.atlassian.net/browse/FORA-1064
    // Although the user might be looking at a different date in the agenda, we
    // should only need to invalidate the query for "today" if a new card comes in.
    queryClient.invalidateQueries(['meetings', 'agenda', format(today, 'M/dd/yyyy')]);
  });

  // reskin todo: I accidentally prop drilled these a little too much, but didn't have time to rework
  const { onCardActionClick, onMeetingActionClick } = useAgendaMeetingActions(selectedDate);

  return (
    <ColumnedLayout
      data-cy='agenda-page'
      mobileContent={
        <MobileAgenda
          date={selectedDate}
          meetingAttendeeMap={meetingAttendeeMap}
          populatedAttendees={populatedAttendees}
          populatedOrganizations={populatedOrganizations}
          meetings={meetings}
          onMeetingActionClick={onMeetingActionClick}
          onCardActionClick={onCardActionClick}
        />
      }
      rightRailContent={
        <AgendaRightRail
          meetings={meetings}
          isAttendeesPopulating={isAttendeesPopulating}
          populatedAttendees={populatedAttendees}
          populatedOrganizations={populatedOrganizations}
        />
      }
    >
      <Stack
        gap={11}
        p={11}
        minH='full'
      >
        <Flex
          align='center'
          gap={3}
          justify='space-between'
        >
          <Text variant='page-header'>Agenda</Text>
          <CalendarSyncButton />
        </Flex>
        <Stack gap={8}>
          <AgendaHeader
            date={selectedDate}
            setDate={setSelectedDate}
          />
          {showMeetings && (
            <YourMeetings
              meetings={meetings}
              onMeetingActionClick={onMeetingActionClick}
              onCardActionClick={onCardActionClick}
            />
          )}
        </Stack>
        {agendaState === 'isLoading' &&
          getNumberArray(4).map((num) => <MeetingCardSkeleton key={num} />)}

        {isErroredCalendar && (
          <VStack
            p={12}
            gap={8}
          >
            <Text>{nylasErrorMessages[agendaState]}</Text>
            <AddCalendarButton
              variant='reskinWhite'
              borderRadius='2xl'
              px={12}
            />
          </VStack>
        )}

        {agendaState === 'successNoMeetings' && (
          <EndOfResults>
            You {tenseIndicator} no meetings on {currentDateText}
          </EndOfResults>
        )}
      </Stack>
    </ColumnedLayout>
  );
}

function EndOfResults({ children }) {
  return (
    <VStack
      py={8}
      mb={{ base: 6, sm: 0 }}
      gap={1}
      color='surface.onSurfaceVariant'
    >
      <Icon
        as={CloudMoonBold}
        w={6}
        h={6}
      />
      <Text>{children}</Text>
    </VStack>
  );
}
