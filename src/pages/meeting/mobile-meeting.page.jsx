import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Suspense } from 'react';

import { useUserStore } from '@store/app.store';
import { useMeetingPageState } from '@util/hooks';
import { lazyWithRetry } from '@util/helpers';
import ReskinMobileStickyNav from '@components/general/reskin-mobile-sticky-nav.component';
import MeetingDetailComponent from '@components/meeting/meeting-detail.component';
import MeetingAttendeesSection from '@components/meeting/meeting-attendees.component';
import MeetingOrganizations from '@components/meeting/meeting-organizations.component';
import { useTranslation } from 'react-i18next';

const Chat = lazyWithRetry(() => import('@components/meeting/meeting-chat.component'));

export default function MobileMeetingPage({ sections }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state?.user);
  const isAssociate = user?.type === 'Associate';
  const isGuest = user?.isGuest;
  const { meetingId } = useParams();

  const { attendees, organizations, meeting, isLoading } = useMeetingPageState(meetingId);

  return (
    <Flex flexDir='column'>
      <Tabs variant='navDark'>
        <ReskinMobileStickyNav showCalendar={false}>
          <TabList w='full'>
            <Tab>{t('mobileMeetingPage.meetingSummary')}</Tab>
            {!isGuest && !isAssociate && <Tab>{t('mobileMeetingPage.people')}</Tab>}
            {!isGuest && !isAssociate && <Tab>{t('mobileMeetingPage.organizations')}</Tab>}
          </TabList>
        </ReskinMobileStickyNav>
        <TabPanels
          p={3}
          pb={0}
        >
          <TabPanel
            maxW='720px'
            m='0 auto'
          >
            <MeetingDetailComponent sections={sections} />
          </TabPanel>
          {!isGuest && (
            <TabPanel p={1}>
              <MeetingAttendeesSection attendees={attendees} />
            </TabPanel>
          )}
          {!isGuest && (
            <TabPanel p={1}>
              <MeetingOrganizations
                organizations={organizations}
                meetingId={meetingId}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <Suspense fallback={null}>{!isLoading && <Chat meeting={meeting} />}</Suspense>
    </Flex>
  );
}
