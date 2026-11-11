import { useUserStore } from '@store/app.store';
import { useCards } from '@services/query-services/cards.query-service';
import { getNonTemplateLensCards } from '@util/helpers';

import RelevantLenses from '@components/meeting/relevant-lenses.component';
import MeetingPageSection from './section.component';

export default function MeetingLensesSection({ section, card: initialCard, meeting }) {
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  const { data: lensCards } = useCards(
    {
      source_data_id: initialCard?.source_data?.id || meeting?.linked?.id || meeting?.id,
      person_id: user?.id,
      initiative_type: 'Lens'
    },
    {
      select: getNonTemplateLensCards,
      enabled: !isGuest
    }
  );

  if (!lensCards?.length && !isGuest) {
    return null;
  }

  return (
    <MeetingPageSection
      id='insight-from-lenses'
      section={section}
      hideHeader
    >
      <RelevantLenses cards={isGuest ? [initialCard] : lensCards} />
    </MeetingPageSection>
  );
}
