import {
  Stack,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  Spacer,
  Text,
  HStack
} from '@chakra-ui/react';
import { uniqBy } from 'lodash-es';
import { format } from 'date-fns';

import { useAgendaDateScroll, useAgendaMeetingActions } from '@util/hooks';
import YourMeetings from '@components/agenda/your-meetings.component';
import AgendaStats from '@components/agenda/agenda-stats.component';
import ReskinPeopleStack from '@components/general/reskin-people-stack.component';
import ReskinOrganizationStack from '@components/general/reskin-organization-stack.component';
import AgendaHeader from '@components/agenda/agenda-header.component';
import CalendarSyncButton from '@components/agenda/calendar-sync-button.component';
import { useTranslation } from 'react-i18next';

export default function MobileAgenda({
  meetingAttendeeMap,
  populatedAttendees,
  populatedOrganizations,
  meetings
}) {
  const { t } = useTranslation();

  const { selectedDate, setSelectedDate, currentTime } = useAgendaDateScroll();
  // reskin todo: I accidentally prop drilled these a little too much, but didn't have time to rework
  const { onCardActionClick, onMeetingActionClick } = useAgendaMeetingActions(selectedDate);

  return (
    <Tabs
      variant='nav'
      maxW='720px'
      m='0 auto'
    >
      <Stack
        px={3}
        py={8}
        gap={8}
      >
        <HStack gap={4}>
          <TabList>
            <Tab>{t('mobileAgenda.today')}</Tab>
            <Tab>{t('mobileAgenda.people')}</Tab>
            <Tab>{t('mobileAgenda.orgs')}</Tab>
          </TabList>
          <CalendarSyncButton />
          <Spacer />
          <AgendaHeader
            date={selectedDate}
            setDate={setSelectedDate}
          />
        </HStack>
        <Heading size='lg'>
          <Text
            fontWeight={600}
            lineHeight={0}
          >
            {currentTime}
          </Text>
        </Heading>
        <Heading size='xl'>{format(selectedDate, 'cccc, MMMM d')}</Heading>
        <TabPanels>
          <TabPanel>
            <Stack gap={8}>
              <YourMeetings
                meetingAttendeeMap={meetingAttendeeMap}
                populatedOrganizations={populatedOrganizations}
                meetings={meetings}
                onMeetingActionClick={onMeetingActionClick}
                onCardActionClick={onCardActionClick}
                selectedDate={selectedDate}
              />
              <AgendaStats meetings={meetings} />
            </Stack>
          </TabPanel>
          <TabPanel>
            <ReskinPeopleStack people={uniqBy(populatedAttendees, 'email')} />
          </TabPanel>
          <TabPanel>
            <ReskinOrganizationStack organizations={populatedOrganizations} />
          </TabPanel>
        </TabPanels>
      </Stack>
    </Tabs>
  );
}
