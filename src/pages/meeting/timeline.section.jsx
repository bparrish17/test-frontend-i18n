import MeetingPageSection from '@pages/meeting/section.component';
import Timeline from '@components/meeting/timeline.component';

export default function TimelineSection({
  bot,
  meetingTimeStatus,
  section,
  topicGroups,
  ungroupedSummaries
}) {
  if (!section?.enabled) {
    return null;
  }

  return (
    <MeetingPageSection
      id='key-points'
      section={section}
      hideHeader
    >
      <Timeline
        bot={bot}
        meetingTimeStatus={meetingTimeStatus}
        topicGroups={topicGroups}
        ungroupedSummaries={ungroupedSummaries}
      />
    </MeetingPageSection>
  );
}
