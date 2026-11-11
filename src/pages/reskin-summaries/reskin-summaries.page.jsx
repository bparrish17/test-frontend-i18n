import {
  Box,
  Flex,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useQueryStore, useRefStore, useUserStore } from '@store/app.store';
import { useDebouncedProp, useFeedPageFilters } from '@util/hooks';
import FeedFilterSidebar from '@components/feed/feed-filter-sidebar.component';
import FeedFilterMobile from '@components/feed/feed-filter-mobile.component';
import FeedSummaries from '@components/feed/feed-summaries.component';
import ColumnedLayout from '@layouts/columned.layout';
import ReskinMobileStickyNav from '@components/general/reskin-mobile-sticky-nav.component';
import AgendaHeader from '@components/agenda/agenda-header.component';
import { useInfiniteCards } from '@services/query-services/cards.query-service';
import ExplorerAnalyzeButton from '@components/explorer/explorer-analyze-button.component';
import { useTranslation } from 'react-i18next';

export default function ReskinSummariesPage() {
  const { t } = useTranslation();

  const tab = 'summaries';
  const user = useUserStore((state) => state.user);
  const setFeedCardsSearchBody = useQueryStore((state) => state.setFeedCardsSearchBody);
  const { filters, hasActiveFilters } = useFeedPageFilters();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [debouncedKeyword] = useDebouncedProp(filters?.keyword);
  const defaultSearchBody = {
    has_source: true,
    person_id: user?.id,
    preferred: filters?.savedFilter ? true : undefined,
    pageSize: 8,
    initiative_ids: filters?.focuses?.length ? filters.focuses : undefined,
    label_ids: filters?.labels?.length ? filters.labels : undefined,
    participants_id: filters.participantId ? filters.participantId : undefined
  };

  const cardSearchBody = {
    ...defaultSearchBody,
    query: debouncedKeyword ? `${debouncedKeyword}*` : undefined,
    archived: !!filters?.archivedFilter,
    has_sub_source: filters?.contentTypeSubSources?.length ? true : undefined,
    sub_sources: filters?.contentTypeSubSources?.length ? filters.contentTypeSubSources : undefined,
    created_at_from: filters?.createdAtFrom,
    created_at_to: filters?.createdAtTo,
    pageSize: 25
  };

  const { data: cards } = useInfiniteCards(cardSearchBody, {
    enabled: !!user?.id,
    refetchOnMount: false,
    select: (data) => getCardsFromPages(data.pages)
  });

  useEffect(() => {
    setFeedCardsSearchBody(cardSearchBody);
  }, [cardSearchBody]);

  const getAnalyzeTooltipText = () => {
    if (!hasActiveFilters) {
      return 'Select one or more filters to analyze summary cards';
    } else if (!cards?.length) {
      return 'Zero summary cards found, please query for more';
    } else {
      return '';
    }
  };

  return (
    <ColumnedLayout
      rightRailContent={<FeedFilterSidebar tab={tab} />}
      mobileContent={
        <MobileSummariesPage
          filters={filters}
          cardSearchBody={cardSearchBody}
          tab={tab}
        />
      }
    >
      <Box p={11}>
        <HStack
          justifyContent='space-between'
          mb={5}
        >
          {!hasActiveFilters && (
            <Text
              variant='page-header'
              data-testid='page-header'
            >
              {t('reskinSummariesPage.recentUpdates')}
            </Text>
          )}
          {hasActiveFilters && (
            <Text
              variant='page-header'
              data-testid='page-header'
            >
              <Text
                as='span'
                mr={4}
              >
                {t('reskinSummariesPage.filteredResults')}
              </Text>

              <Text
                as='span'
                variant='body-600-md'
              >
                {cards?.length ? ` ${cards.length} items` : ''}
              </Text>
            </Text>
          )}
          <Tooltip
            isDisabled={!getAnalyzeTooltipText()}
            label={getAnalyzeTooltipText()}
          >
            <Box>
              <ExplorerAnalyzeButton
                isDisabled={!hasActiveFilters || !cards?.length}
                sourcesToSet={cards}
              />
            </Box>
          </Tooltip>
        </HStack>
        <Stack gap={8}>
          {!hasActiveFilters && (
            <AgendaHeader
              date={selectedDate}
              setDate={setSelectedDate}
              showCalendar={false}
            />
          )}
          <FeedSummaries cardSearchBody={cardSearchBody} />
        </Stack>
      </Box>
    </ColumnedLayout>
  );
}

function MobileSummariesPage({ cardSearchBody, tab }) {
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
            <Tab onClick={handleRecentClicked}>{t('reskinSummariesPage.recentUpdates')}</Tab>
            <Tab onClick={handleFiltersClicked}>{t('reskinSummariesPage.filters')}</Tab>
          </TabList>
        </ReskinMobileStickyNav>
        <TabPanels
          maxW='720px'
          m='0 auto'
        >
          <TabPanel>
            <FeedSummaries
              cardSearchBody={cardSearchBody}
              p={2}
            />
          </TabPanel>
          <TabPanel>
            {isSelectingFilters && (
              <FeedFilterMobile
                setIsSelectingFilters={setIsSelectingFilters}
                tab={tab}
              />
            )}
            {!isSelectingFilters && (
              <FeedSummaries
                cardSearchBody={cardSearchBody}
                p={2}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

function getCardsFromPages(pages) {
  return pages.flatMap((page) => page.data);
}
