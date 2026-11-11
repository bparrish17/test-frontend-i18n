import { Box, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';

import { useDebouncedProp, useFeedPageFilters } from '@util/hooks';
import FeedFilterSidebar from '@components/feed/feed-filter-sidebar.component';
import FeedScrollContainer from '@components/feed/feed-scroll-container.component';
import MeetingCardSkeleton from '@components/general/card/meeting-card/meeting-card-skeleton.component';
import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import ColumnedLayout from '@layouts/columned.layout';
import { useInfiniteMeetings } from '@services/query-services/meetings.query-service';
import { useRefStore, useUserStore } from '@store/app.store';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { useState, useEffect } from 'react';
import ReskinMobileStickyNav from '@components/general/reskin-mobile-sticky-nav.component';
import FeedFilterMobile from '@components/feed/feed-filter-mobile.component';
import { useTranslation } from 'react-i18next';

export default function GuestMeetingsPage() {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const { filters } = useFeedPageFilters();
  const [debouncedKeyword] = useDebouncedProp(filters?.keyword);
  const meetingSearchBody = {
    query: debouncedKeyword ? `${debouncedKeyword}*` : undefined,
    start_at_from: filters?.createdAtFrom,
    start_at_to: filters?.createdAtTo
  };

  return (
    <ColumnedLayout
      rightRailContent={<FeedFilterSidebar tab='summaries' />}
      mobileContent={
        <MobileSummariesPage
          filters={filters}
          meetingSearchBody={meetingSearchBody}
        />
      }
    >
      <Box p={11}>
        <Text
          variant='page-header'
          mb={11}
        >
          Welcome, {user?.first_name || t('guestMeetingsPage.guest')}
        </Text>
        <Stack gap={8}>
          <SharedMeetings meetingSearchBody={meetingSearchBody} />
        </Stack>
      </Box>
    </ColumnedLayout>
  );
}

function MobileSummariesPage({ meetingSearchBody }) {
  const { t } = useTranslation();

  const [isSelectingFilters, setIsSelectingFilters] = useState(false);
  const { handleResetFilters } = useFeedPageFilters();
  const mainRef = useRefStore((state) => state.mainRef);

  const handleTabChange = (index) => {
    if (index === 1) {
      setIsSelectingFilters(true);
    } else {
      setIsSelectingFilters(false);
    }
  };

  const handleRecentClicked = () => {
    setIsSelectingFilters(false);
    handleResetFilters();
  };

  const handleFiltersClicked = () => {
    if (!isSelectingFilters) {
      setIsSelectingFilters(true);
    }
  };

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [isSelectingFilters]);

  return (
    <Flex flexDir='column'>
      <Tabs
        variant='navDark'
        onChange={handleTabChange}
      >
        <ReskinMobileStickyNav showCalendar={false}>
          <TabList
            justifyContent='space-between'
            w='full'
          >
            <Tab onClick={handleRecentClicked}>{t('guestMeetingsPage.sharedMeetings')}</Tab>
            <Tab onClick={handleFiltersClicked}>{t('guestMeetingsPage.filters')}</Tab>
          </TabList>
        </ReskinMobileStickyNav>
        <TabPanels>
          <TabPanel>
            <SharedMeetings
              meetingSearchBody={meetingSearchBody}
              p={2}
            />
          </TabPanel>
          <TabPanel>
            {isSelectingFilters && (
              <FeedFilterMobile
                setIsSelectingFilters={setIsSelectingFilters}
                tab='summaries'
              />
            )}
            {!isSelectingFilters && <SharedMeetings meetingSearchBody={meetingSearchBody} />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

function SharedMeetings({ meetingSearchBody, ...props }) {
  const infiniteMeetingsResult = useInfiniteMeetings(meetingSearchBody, { refetchOnMount: false });
  return (
    <Stack gap={8}>
      <FeedScrollContainer
        infiniteQueryResult={infiniteMeetingsResult}
        noResultsText='Unable to load shared meetings.'
        noResultsProps={{ mt: 6 }}
        loadingSkeleton={<MeetingCardSkeleton />}
        gap={{ base: 6, md: 11 }}
        overflowY={{ base: 'unset', xl: 'scroll' }}
        sx={HIDE_SCROLLBAR}
        {...props}
      >
        {(page) =>
          (page?.data || []).map((meeting) => (
            <ReskinMeetingCard
              key={meeting?.id}
              bot={meeting?.bot}
              meeting={meeting}
              hideControlBar
              enableMenu={false}
              showSharedThisHeader
              includeDate
              showFullDate
            />
          ))
        }
      </FeedScrollContainer>
    </Stack>
  );
}

/*
async function populateMeetingAll(meeting) {
  if (meeting.card && meeting.bot) {
    return meeting;
  }
  const meetingAll = await fetchAllMeetingDataById(meeting.id);
  return {
    ...meeting,
    ...meetingAll?.value,
    card: meetingAll?.card,
    bot: meetingAll?.bot
  };
}
*/
