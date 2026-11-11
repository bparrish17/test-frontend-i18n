import {
  Stack,
  Flex,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Spacer,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Box
} from '@chakra-ui/react';
import { format, endOfDay, startOfDay, sub, isToday, isYesterday } from 'date-fns';
import { useState } from 'react';
import { uniqBy } from 'lodash-es';
import Lottie from 'lottie-react';

import { useSetDocumentTitle } from '@util/hooks';
import { useUserStore } from '@store/app.store';
import { useInsights } from '@services/query-services/insights.query-service';
import { useInitiatives } from '@services/query-services/initiatives.query-service';

import ColumnedLayout from '@layouts/columned.layout';
import ReskinInsightCard from '@components/general/card/insight-card/reskin-insight-card.component';
import ReskinMobileStickyNav from '@components/general/reskin-mobile-sticky-nav.component';
import HomePageAgendaRightRail from './agenda-right-rail.component';
import StyledLink from '@components/general/styled-link.component';
import ReskinCalendar from '@components/general/reskin-calendar.component';
import animation from '@assets/animations/lottie/home-page-empty-no-insights.json';
import PulseLaunchContainer from '@components/pulse/pulse-launch-container.jsx';
import { useStatsigClient } from '@statsig/react-bindings';
import { useTranslation } from 'react-i18next';

const yesterday = sub(new Date(), { days: 1 });

export default function HomePage() {
  const { t } = useTranslation();

  // FLAG CHECKS
  const { checkGate } = useStatsigClient();
  const enablePulses = checkGate('pulses');
  useSetDocumentTitle('Home - FORA');
  const user = useUserStore((state) => state?.user);
  const [customDate, setCustomDate] = useState(new Date());
  const [insightFilter, setInsightFilter] = useState('latest');
  const [insightDateFilters, setInsightDateFilters] = useState({
    latest: {},
    yesterday: {
      updated_at_from: startOfDay(yesterday),
      updated_at_to: endOfDay(yesterday)
    },
    custom: {}
  });
  const { data: allLenses } = useInitiatives({ type: 'Lens' });

  // reskin todo: don't pass effects around
  const setCustomDateFilter = (date) => {
    setCustomDate(date);
    if (isToday(date)) {
      setInsightFilter('latest');
    } else if (isYesterday(date)) {
      setInsightFilter('yesterday');
    } else {
      setInsightDateFilters({
        ...insightDateFilters,
        custom: {
          updated_at_to: endOfDay(date)
        }
      });
      setInsightFilter('custom');
    }
  };

  const { data: hasInsights, isLoading: isLoadingHasInsights } = useInsights(
    {
      initiative_type: 'Lens',
      person_id: user?.id,
      has_archived_at: false,
      pageSize: 1
    },
    {
      select: (insights) => insights.length > 0
    }
  );
  const { data: insights, isLoading: isLoadingInsights } = useInsights(
    {
      initiative_type: 'Lens',
      person_id: user?.id,
      has_archived_at: false,
      sort: 'updated_at',
      asc: false,
      pageSize: 20,
      ...insightDateFilters[insightFilter]
    },
    {
      select: (insights) => {
        const uniqued = uniqBy(insights, 'initiative.id');
        const filtered = uniqued.filter((insight) => {
          return !insight.initiative.tags || insight.initiative.tags.indexOf('template') < 0;
        });
        return filtered;
      }
    }
  );

  return (
    <ColumnedLayout
      rightRailContent={<HomePageAgendaRightRail />}
      mobileContent={
        <MobileHomePage
          customDate={customDate}
          setCustomDateFilter={setCustomDateFilter}
          insights={insights}
          allLenses={allLenses}
        />
      }
    >
      <Stack
        p={11}
        gap={11}
      >
        <HStack gap={4}>
          <Text
            as='span'
            variant='page-header'
          >
            Welcome{user?.first_name && `, ${user?.first_name}`}
          </Text>
          <Spacer />
          <Text
            as='span'
            cursor='pointer'
            color={insightFilter === 'latest' ? 'brandPrimary.primary' : 'surface.onSurfaceVariant'}
            fontWeight={insightFilter === 'latest' ? 600 : 500}
            onClick={() => setCustomDateFilter(new Date())}
          >
            {t('homePage.latest')}
          </Text>
          <Text
            as='span'
            cursor='pointer'
            color={
              insightFilter === 'yesterday' ? 'brandPrimary.primary' : 'surface.onSurfaceVariant'
            }
            fontWeight={insightFilter === 'yesterday' ? 600 : 500}
            onClick={() => setCustomDateFilter(yesterday)}
          >
            {t('homePage.yesterday')}
          </Text>
          <ReskinCalendar
            maxDate={new Date()}
            date={customDate}
            setDate={setCustomDateFilter}
          />
        </HStack>
        {/*
         Todo: add these back in when snapshots are ready
         - also remove passed in effect
          <ReskinDateFilters
          insightFilter={insightFilter}
          setInsightFilter={setInsightFilter}
          customDate={customDate}
          setCustomDateFilter={setCustomDateFilter}
        >

        </ReskinDateFilters> */}
        {/* <HStack gap={8}>
          <Text as="span" color="brandPrimary.onContainer" fontWeight={500} letterSpacing="tight">
            Welcome{user?.first_name && `, ${user?.first_name}`}
          </Text>
          <Spacer />
          <LinkRadio
            name="insightsFilter"
            options={insightsFilterOptions}
            value={insightFilter}
            onChange={setInsightFilter}
          />
        </HStack> */}

        {enablePulses && <PulseLaunchContainer />}
        {!hasInsights && !isLoadingInsights && !allLenses?.length && <EmptyStateWithNoLenses />}
        {!hasInsights && !isLoadingInsights && allLenses?.length && <EmptyStateWithLenses />}
        {(hasInsights || isLoadingHasInsights) && isLoadingInsights && <HomePageSkeleton />}
        {hasInsights && !isLoadingInsights && !insights?.length && (
          <Text>{`No insights were updated on ${format(customDate, 'MMMM d')}.`}</Text>
        )}
        {insights?.map((insight) => (
          <ReskinInsightCard
            key={insight?.id}
            insight={insight}
          />
        ))}
      </Stack>
    </ColumnedLayout>
  );
}

function MobileHomePage({ customDate, setCustomDateFilter, insights }) {
  const { t } = useTranslation();

  // FLAG CHECKS
  const { checkGate } = useStatsigClient();
  const enablePulses = checkGate('pulses');

  return (
    <Flex flexDir='column'>
      <Tabs variant='navDark'>
        <ReskinMobileStickyNav showCalendar={false}>
          <TabList w='full'>
            <Tab>{format(customDate, 'ccc PP')}</Tab>
            <Tab>{t('homePage.live')}</Tab>
            <Tab>{t('homePage.recent')}</Tab>
            <Spacer />
            <ReskinCalendar
              date={customDate}
              maxDate={new Date()}
              setDate={setCustomDateFilter}
              triggerProps={{ color: 'brandPrimary.onPrimary' }}
            />
          </TabList>
        </ReskinMobileStickyNav>
        {enablePulses && (
          <Box px={2}>
            <PulseLaunchContainer />
          </Box>
        )}
        <TabPanels
          maxW='720px'
          margin='0 auto'
        >
          <TabPanel p={3}>
            {insights?.map((insight) => (
              <ReskinInsightCard
                key={insight?.id}
                insight={insight}
                variant='cards'
              />
            ))}
          </TabPanel>
          <TabPanel>
            <HomePageAgendaRightRail
              filterBy='live'
              showLinks={false}
            />
          </TabPanel>
          <TabPanel>
            <HomePageAgendaRightRail
              filterBy='recent'
              showLinks={false}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

function EmptyStateWithLenses() {
  const { t } = useTranslation();

  const animationContainerStyle = {
    height: '90px',
    width: '90px',
    marginLeft: '-18px'
  };
  return (
    <Stack gap={5}>
      <Lottie
        animationData={animation}
        style={animationContainerStyle}
      />
      <Heading
        size='2xl'
        letterSpacing='tight'
      >
        {t('homePage.weRePersonalizingThis')}
      </Heading>
      <Text>{t('homePage.foraIsAnalyzingYour')}</Text>
      <Text>{t('homePage.checkBackIn24')}</Text>
      <Text>
        You can also <StyledLink to='/lenses/create'>{t('homePage.createALens')}</StyledLink> and{' '}
        <StyledLink to='/lenses'>{t('homePage.followLenses')}</StyledLink> in your organization.
      </Text>
    </Stack>
  );
}

function EmptyStateWithNoLenses() {
  const { t } = useTranslation();

  return (
    <Flex direction='column'>
      <Heading
        size='2xl'
        letterSpacing='tight'
      >
        {t('homePage.welcomeToFora')}
      </Heading>
      <br />
      <Text>
        <StyledLink to='/lenses/create'>{t('homePage.createALens2')}</StyledLink> and{' '}
        <StyledLink to='/lenses'>{t('homePage.followLenses')}</StyledLink> in your organization to
        start viewing updates here.
      </Text>
    </Flex>
  );
}

function HomePageSkeleton() {
  return (
    <Stack gap={12}>
      <Stack
        w='full'
        gap={6}
      >
        <HStack>
          <SkeletonCircle boxSize={7} />
          <SkeletonCircle
            maxW='192px'
            h={4}
            w='full'
          />
        </HStack>
        <Skeleton
          h='144px'
          w='full'
        />
        <HStack
          w='full'
          gap={6}
        >
          <Skeleton
            h='114px'
            w='full'
          />{' '}
          <Skeleton
            h='114px'
            w='full'
          />
        </HStack>
      </Stack>
      <Stack
        w='full'
        gap={6}
      >
        <HStack>
          <SkeletonCircle boxSize={7} />
          <SkeletonCircle
            maxW='192px'
            h={4}
            w='full'
          />
        </HStack>
        <Skeleton
          h='144px'
          w='full'
        />
        <HStack
          w='full'
          gap={6}
        >
          <Skeleton
            h='114px'
            w='full'
          />{' '}
          <Skeleton
            h='114px'
            w='full'
          />
        </HStack>
      </Stack>
    </Stack>
  );
}
