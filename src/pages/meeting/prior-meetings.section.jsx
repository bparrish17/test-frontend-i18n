import { Stack } from '@chakra-ui/react';

import { useCardActions } from '@util/hooks';
import MeetingPageSection from '@pages/meeting/section.component';
import MeetingPageSectionHeader from '@pages/meeting/meeting-page-section-header.component';
import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';

export default function PriorMeetingsSection({ section, card, attendees, priorMeetingsSections }) {
  if (attendees?.length < 2) {
    return null;
  }

  return (
    <MeetingPageSection
      section={section}
      hideHeader
    >
      {priorMeetingsSections?.map(({ priorMeetings, title, searchBody }) => (
        <PriorMeetingsSubsection
          key={title}
          title={title}
          card={card}
          searchBody={searchBody}
          priorMeetings={priorMeetings}
        />
      ))}
    </MeetingPageSection>
  );
}

const actionAttributeMap = {
  save: 'preferred',
  archive: 'archived'
};

function PriorMeetingsSubsection({ priorMeetings, card, title, searchBody }) {
  if (!priorMeetings?.length) {
    return null;
  }

  const onCardActionClick = useCardActions({
    enabled: true,
    type: 'search',
    model: 'meetings',
    queryKeyToUpdate: searchBody,
    updaterFn: (previous, mutationVars) =>
      previous?.map((prevMeeting) =>
        prevMeeting?.card?.id === mutationVars.id
          ? {
              ...prevMeeting,
              card: {
                ...prevMeeting?.card,
                [actionAttributeMap[mutationVars?.action]]: mutationVars?.value
              }
            }
          : prevMeeting
      )
  });

  return (
    <Stack
      gap={8}
      id='prior-meetings'
    >
      <MeetingPageSectionHeader text={title} />
      <Stack gap={6}>
        {priorMeetings?.map((priorMeeting) => (
          <ReskinSummaryCard
            key={priorMeeting?.id}
            card={{
              ...priorMeeting?.card,
              initiative: priorMeeting?.initiative,
              created_at: priorMeeting?.start_at,
              source: card?.source,
              sub_source: card?.sub_source, // use main page-level card to get source and sub_source
              source_data: priorMeeting,
              headline: priorMeeting?.card?.title
            }}
            onCardActionClick={onCardActionClick}
          />
        ))}
      </Stack>
    </Stack>
  );
}
