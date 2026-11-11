import { Stack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useCardActions } from '@util/hooks';
import { useUserStore } from '@store/app.store';
import { scrollRefIntoView, isUserThatWasSharedWith, isMeetingParticipant } from '@util/helpers';

import MeetingPageSection from '@pages/meeting/section.component';
import MeetingSummary from '@components/meeting/meeting-summary.component';
import YourSummarySection, { CopySummaryMenuItem } from './your-summary.component';
import { useTranslation } from 'react-i18next';

export default function PersonalSummarySection({
  section,
  bot,
  card: initialCard,
  allCards,
  cardsBySource = {},
  meeting,
  hideCustomSummaryStuff
}) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  if (initialCard?.source === 'Channel') {
    cardsBySource.ids = [initialCard?.id];
  }

  const onCardActionClick = useCardActions({
    type: 'search',
    queryKeyToUpdate: cardsBySource
  });

  const customCards = useMemo(
    () =>
      allCards?.filter(
        (card) =>
          card?.initiative?.tags?.includes('template') ||
          card?.initiative?.id === initialCard?.initiative?.id
      ),
    [allCards]
  );

  const isSharedUser = isUserThatWasSharedWith(user, meeting);
  const meetingParticipant = isMeetingParticipant(user, meeting);
  const shouldSeeSharedSummary = isGuest || (isSharedUser && !meetingParticipant);

  return (
    <MeetingPageSection
      id='personal-summary'
      data-testid='personal-summary-section'
      section={section}
      hideHeader
    >
      {shouldSeeSharedSummary && (
        <Text variant='content-section-header'>{t('personalSummarySection.sharedSummary')}</Text>
      )}
      {shouldSeeSharedSummary ? (
        <Stack
          px={0}
          gap={4}
        >
          {
            // https://foraday.atlassian.net/browse/FORA-1041
            // disable this text for now
            // <HStack pt={2} pb={2} spacing={2} display="flex">
            //   {/* TODO: Missing image url, API guest permissions */}
            //   <Avatar size="2xs" name={meeting?.creator?.name} />
            //   <Text fontSize="xs" color="surface.onSurfaceVariant">
            //     <Text color="surface.onSurface" display="inline">
            //       {meeting?.creator?.name}{' '}
            //     </Text>
            //     shared this summary with you
            //   </Text>
            // </HStack>
          }
          <MeetingSummary
            card={bot?.recap}
            meeting={meeting}
            menuChildren={<CopySummaryMenuItem card={bot?.recap} />}
            hideCustomSummaryStuff={hideCustomSummaryStuff}
            isGuest={isGuest}
          />
        </Stack>
      ) : (
        <YourSummarySection
          scrollToStartOfSection={() => scrollRefIntoView(section.ref, { top: -48 })}
          initialCard={initialCard}
          cardsArr={customCards}
          meeting={meeting}
          onCardActionClick={onCardActionClick}
          isGuest={isGuest}
          hideCustomSummaryStuff={hideCustomSummaryStuff}
        />
      )}
    </MeetingPageSection>
  );
}
