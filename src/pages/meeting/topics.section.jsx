import MeetingPageSection from '@pages/meeting/section.component';
import Topics from '@components/meeting/topics.component';

export default function TopicsSection({ topics, section }) {
  if (!section?.enabled) {
    return null;
  }

  return (
    <MeetingPageSection
      id='insight-from-lenses'
      section={section}
      hideHeader
    >
      <Topics topics={topics} />
    </MeetingPageSection>
  );
}
