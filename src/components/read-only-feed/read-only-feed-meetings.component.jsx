import { useUserStore } from '@store/app.store';
import FeedScrollContainer from '@components/feed/feed-scroll-container.component';
import ReadOnlyMeetingCard from './read-only-meeting-card.component';
import { useInfiniteMeetings } from '@services/query-services/meetings.query-service';

export default function FeedMeetings({ meetingSearchBody, noResultsText }) {
  const user = useUserStore((state) => state.user);
  const infiniteMeetingsResult = useInfiniteMeetings(meetingSearchBody, { enabled: !!user?.id });

  return (
    <FeedScrollContainer
      infiniteQueryResult={infiniteMeetingsResult}
      noResultsText={noResultsText}
      gap={6}
    >
      {(page) =>
        (page?.data || []).map((meeting) => (
          <ReadOnlyMeetingCard
            key={meeting.id}
            meeting={meeting}
          />
        ))
      }
    </FeedScrollContainer>
  );
}
