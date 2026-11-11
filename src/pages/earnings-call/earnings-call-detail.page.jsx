import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Heading,
  Link,
  Stack
} from '@chakra-ui/react';
import { Link as ReactRouterLink, useParams } from 'react-router-dom';
import { forwardRef, useState } from 'react';
import { first, last, partition, reject } from 'lodash-es';

import { useBotById } from '@services/query-services/bots.query-service';
import { useCards } from '@services/query-services/cards.query-service';
import {
  useListRefs,
  useTopicGroupsAndSummaries,
  useDocumentScrollListener,
  useSetDocumentTitle
} from '@util/hooks';
import { getNonTemplateLensCards } from '@util/helpers';
import { useUserStore } from '@store/app.store';
import { SFBoltFillIcon, SFChecklistIcon, SFLensIcon, SFListBulletIndentIcon } from '@assets/icons';

import { CopySummaryMenuItem } from '@pages/meeting/your-summary.component';
import ColumnedLayout from '@layouts/columned.layout';
import MeetingSummary from '@components/meeting/meeting-summary.component';
import Topics from '@components/meeting/topics.component';
import Timeline from '@components/meeting/timeline.component';
import SectionHeader from '@components/meeting/section-header.component';
import MeetingPageSkeleton from '@pages/meeting/skeleton.component';
import EarningsCallHeaderCard from '@pages/earnings-call/earnings-call-header-card.component';
import EarningsCallRightRail from '@pages/earnings-call/earnings-call-right-rail.component';
import RelevantLenses from '@components/meeting/relevant-lenses.component';

// Table of contents sections (exported only for test)
export const EARNINGS_CALL_TOC_SECTIONS = [
  {
    id: 'meeting-summary',
    name: 'Summary',
    icon: SFChecklistIcon,
    iconProps: { p: 1 }
  },
  {
    id: 'topic-analysis',
    name: 'Topic Analysis',
    icon: SFBoltFillIcon,
    iconProps: { p: 1 }
  },
  {
    id: 'insights',
    name: 'Insights',
    icon: SFLensIcon,
    iconProps: { p: '1px' }
  },
  {
    id: 'meeting-timeline',
    name: 'Meeting Timeline',
    icon: SFListBulletIndentIcon,
    iconProps: { px: '2.5px' }
  }
];

export default function EarningsCallDetailPage() {
  const user = useUserStore((state) => state?.user);
  const [closestRefIndex, setClosestRefIndex] = useState(0);
  const { botId } = useParams();
  const {
    data: cards,
    isLoading: isCardsLoading,
    isError: isCardsError,
    error: cardsError
  } = useCards(
    { source_data_id: botId, initiative_type: null },
    {
      enabled: !!botId,
      select: (cards) => {
        const [focusCards, lensCards] = partition(cards, { initiative: { type: 'Focus' } });
        return {
          focusCard: first(focusCards), // there should only be one Focus card, so just take first in focusCards array
          lensCards: user?.isGuest ? null : getNonTemplateLensCards(lensCards)
        };
      }
    }
  );
  useSetDocumentTitle(`${cards?.focusCard?.source_data?.title ?? 'Earnings Call'} - FORA`);

  const { data: bot, isLoading: isBotLoading } = useBotById(botId, { enabled: !!botId });
  const { released_at: releasedAt } = bot?.earnings_call ?? {};
  const { topicGroups, ungroupedSummaries } = useTopicGroupsAndSummaries(
    { start_at: bot?.created_at, id: 1 },
    bot
  );

  const sections =
    cards?.lensCards?.length === 0
      ? reject(EARNINGS_CALL_TOC_SECTIONS, { id: 'insights' })
      : EARNINGS_CALL_TOC_SECTIONS;

  const { refs: sectionRefs, handleScrollToRef, getClosestRefIndex } = useListRefs(sections);
  useDocumentScrollListener(() => setClosestRefIndex(getClosestRefIndex()));

  if (isCardsError && cardsError?.response?.status === 401) {
    return (
      <ColumnedLayout>
        <Box p={11}>
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>You don&apos;t have access to this earnings call</AlertTitle>
            <AlertDescription>
              <Link
                as={ReactRouterLink}
                to='/agenda'
              >
                Go back to agenda
              </Link>
            </AlertDescription>
          </Alert>
        </Box>
      </ColumnedLayout>
    );
  } else if (isCardsLoading || isBotLoading) {
    return (
      <ColumnedLayout>
        <MeetingPageSkeleton />
      </ColumnedLayout>
    );
  }

  return (
    <ColumnedLayout
      rightRailContent={
        <EarningsCallRightRail
          bot={bot}
          sections={sections}
          onSectionClick={handleScrollToRef}
          closestRefIndex={closestRefIndex}
        />
      }
    >
      <Stack
        gap={11}
        p={11}
      >
        <Heading size='sm'>Earnings Call Details</Heading>
        <EarningsCallHeaderCard
          card={cards?.focusCard}
          bot={bot}
          topicGroups={topicGroups}
          earningsCallDate={releasedAt ? new Date(releasedAt) : null}
        />
        <EarningsCallPageSection ref={sectionRefs?.current[0]}>
          <MeetingSummary
            card={cards?.focusCard}
            menuChildren={<CopySummaryMenuItem card={bot?.recap} />}
            headerChildren={
              <SectionHeader
                headline='Summary'
                icon={SFChecklistIcon}
              />
            }
          />
        </EarningsCallPageSection>
        <EarningsCallPageSection ref={sectionRefs?.current[1]}>
          <Topics topics={bot?.topics} />
        </EarningsCallPageSection>
        {cards?.lensCards?.length > 0 && (
          <EarningsCallPageSection ref={sectionRefs?.current[2]}>
            <RelevantLenses cards={cards?.lensCards} />
          </EarningsCallPageSection>
        )}
        <EarningsCallPageSection ref={last(sectionRefs?.current)}>
          <Timeline
            bot={bot}
            meetingTimeStatus='done'
            topicGroups={topicGroups}
            ungroupedSummaries={ungroupedSummaries}
          />
        </EarningsCallPageSection>
      </Stack>
    </ColumnedLayout>
  );
}

function _EarningsCallPageSection({ children }, ref) {
  return (
    <Box
      ref={ref}
      style={{ scrollMarginTop: '30px' }}
    >
      {children}
    </Box>
  );
}

const EarningsCallPageSection = forwardRef(_EarningsCallPageSection);
