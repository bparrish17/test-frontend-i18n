import { Flex } from '@chakra-ui/react';
import { reject } from 'lodash-es';

import { useCards } from '@services/query-services/cards.query-service';
import { useUserStore } from '@store/app.store';
import MeetingPageSection from '@pages/meeting/section.component';
import MeetingPageSectionHeader from '@pages/meeting/meeting-page-section-header.component';
import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';

export default function PriorCardsSection({ section, card: initialCard }) {
  const user = useUserStore((state) => state.user);
  const cardSearchBody = {
    has_source: true,
    person_id: user?.id,
    source_data_id: initialCard?.source_data?.id
  };

  const { data: allCards } = useCards(cardSearchBody, {
    select: (cards) => {
      return reject(cards, (sortedCard) => sortedCard?.id === initialCard?.id);
    }
  });

  return (
    <MeetingPageSection
      section={section}
      hideHeader
    >
      <MeetingPageSectionHeader
        text={`Prior ${initialCard?.source_data?.source || ''} Digests in this series`}
      />
      <Flex
        flexDir='column'
        gap={4}
        w='full'
      >
        {allCards?.map((card) => (
          <ReskinSummaryCard
            key={card?.id}
            card={card}
            showBody={false}
            showFooter={false}
          />
        ))}
      </Flex>
    </MeetingPageSection>
  );
}
