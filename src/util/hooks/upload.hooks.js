import { useMemo } from 'react';

import { useChannels } from '@services/query-services/channels.query-service';
import { useBatches } from '@services/query-services/batches.query-service';
import { useMeetings } from '@services/query-services/meetings.query-service';
import { useCards } from '@services/query-services/cards.query-service.js';

export function useDocumentUploads({ user }) {
  // Fetch channels
  const { data: channels, isLoading: isLoadingChannels } = useChannels({
    pageSize: 100,
    creator_id: user?.id,
    sources: ['Email', 'Document']
  });

  const channelIds = useMemo(() => channels?.map((c) => c?.id).filter(Boolean), [channels]);

  // Fetch batches
  const { data: batches, isLoading: isLoadingBatches } = useBatches(
    { pageSize: 100, channel_ids: channelIds },
    { enabled: !!channelIds?.length }
  );

  const batchIds = useMemo(() => batches?.map((c) => c?.id).filter(Boolean), [batches]);

  // Fetch cards for batches
  const { data: cards, isLoading: isLoadingCards } = useCards(
    { batch_ids: batchIds, pageSize: batchIds?.length },
    { enabled: !!batchIds?.length }
  );

  const isLoading = isLoadingChannels || isLoadingBatches || isLoadingCards;

  return {
    batches,
    cards,
    isLoading
  };
}

export function useMeetingUploads() {
  // Fetch meetings
  const { data: meetings, isLoading: isLoadingMeetings } = useMeetings({
    pageSize: 100,
    tags: ['meeting_upload']
  });

  const meetingIds = useMemo(() => meetings?.map((m) => m?.id).filter(Boolean), [meetings]);

  // Fetch cards for meetings
  const { data: cards, isLoading: isLoadingCards } = useCards(
    { source_data_ids: meetingIds, pageSize: meetingIds?.length },
    { enabled: !!meetingIds?.length }
  );

  const isLoading = isLoadingMeetings || isLoadingCards;

  return {
    meetings,
    cards,
    isLoading
  };
}
