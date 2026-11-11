import { Box, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { useCardActions, useSetDocumentTitle, useCardPageState } from '@util/hooks';
import ColumnedLayout from '@layouts/columned.layout';
import MeetingPageRightRail from '@pages/meeting/right-rail.component';
import RightRailSkeleton from '@pages/meeting/right-rail-skeleton.component';
import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';
import PersonalSummarySection from '@pages/meeting/personal-summary.section';
import DetailedSummarySection from '@pages/cards/detailed-summary.section';
import PriorCardsSection from '@pages/cards/prior-cards.section';

import { useRefStore } from '@store/app.store';

export default function CardPage() {
  const { cardId } = useParams();
  const { card, isLoading, sections } = useCardPageState(cardId);
  const agendaMainRef = useRefStore((state) => state.agendaMainRef);

  const onCardActionClick = useCardActions({ type: 'id' });

  useSetDocumentTitle(`${card?.source_data.title} Summary - FORA`);

  const navSections = Object.values(sections)?.filter((section) => section.enabled);
  const { cardSummary, detailedSummary, priorCards } = sections;

  // Scroll to the top when cardId changes
  useEffect(() => {
    if (agendaMainRef?.current) {
      agendaMainRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [cardId]);

  return (
    <ColumnedLayout
      rightRailContent={
        isLoading ? (
          <RightRailSkeleton />
        ) : (
          <MeetingPageRightRail
            sections={navSections}
            askEnabled={false}
          />
        )
      }
    >
      <Stack
        gap={{ base: 7, md: 22 }}
        p={{ base: 3, md: 11 }}
      >
        <Box>
          {!isLoading && (
            <ReskinSummaryCard
              key={card?.id}
              card={card}
              onCardActionClick={(action, value, card) => onCardActionClick(action, value, card)}
              showBody={false}
            />
          )}
        </Box>
        <PersonalSummarySection
          section={cardSummary}
          card={card}
          allCards={[card]}
          hideCustomSummaryStuff
        />
        <DetailedSummarySection
          section={detailedSummary}
          card={card}
        />
        <PriorCardsSection
          section={priorCards}
          card={card}
        />
      </Stack>
    </ColumnedLayout>
  );
}
