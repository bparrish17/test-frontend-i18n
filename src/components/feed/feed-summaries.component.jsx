import { memo } from 'react';

import { useUserStore } from '@store/app.store';
import { useCardActions, useSetDocumentTitle, useFeedPageFilters } from '@util/hooks';
import { getSummaryObject } from '@util/helpers';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { useInfiniteCards } from '@services/query-services/cards.query-service';
import { useInfiniteMeetings } from '@services/query-services/meetings.query-service';
import FeedScrollContainer from './feed-scroll-container.component';
import SummaryCardSkeleton from '@components/general/card/summary-card/summary-card-skeleton.component';
import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';

function FeedSummaries({ cardSearchBody, noResultsText, cardProps = {}, ...props }) {
  useSetDocumentTitle('Summaries - FORA');
  const user = useUserStore((state) => state.user);
  const { filters } = useFeedPageFilters();

  const infiniteCardsResult = useInfiniteCards(cardSearchBody, {
    enabled: !!user?.id,
    refetchOnMount: false
  });
  const onCardActionClick = useCardActions({
    type: 'infinite',
    queryKeyToUpdate: cardSearchBody
  });

  const infiniteMeetingsResult = useInfiniteMeetings(
    { shared_with_me: true },
    {
      enabled: !!(user?.id && filters?.sharedFilter),
      refetchOnMount: false
    }
  );

  return (
    <FeedScrollContainer
      infiniteQueryResult={filters?.sharedFilter ? infiniteMeetingsResult : infiniteCardsResult}
      noResultsText={noResultsText}
      noResultsProps={{ mt: 6 }}
      loadingSkeleton={<SummaryCardSkeleton />}
      gap={{ base: 6, md: 11 }}
      overflowY={{ base: 'unset', xl: 'scroll' }}
      sx={HIDE_SCROLLBAR}
      {...props}
      data-id='FeedSummaries'
    >
      {(page, pageIndex) =>
        (page?.data || []).map((object, cardIndex) => {
          const summaryObject = getSummaryObject(object, filters?.sharedFilter);
          return (
            <ReskinSummaryCard
              key={summaryObject?.id}
              card={summaryObject}
              onCardActionClick={(action, value, card) =>
                onCardActionClick(action, value, card, pageIndex, cardIndex)
              }
              enableLabels={!filters?.sharedFilter}
              showFooter={!filters?.sharedFilter}
              {...cardProps}
            />
          );
        })
      }
    </FeedScrollContainer>
  );
}

export default memo(FeedSummaries);
