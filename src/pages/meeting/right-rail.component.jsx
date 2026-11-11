import { Stack, Text, Divider } from '@chakra-ui/react';
import { memo, useState, Suspense } from 'react';
import { some } from 'lodash';

import { useMeetingManagementActions } from '@util/hooks';
import { useUserStore } from '@store/app.store';
import { lazyWithRetry } from '@util/helpers';
import LinkRadio from '@components/general/form/link-radio.component';
import ForaBanner from '@components/general/fora-banner.component';
import MeetingPageSectionNavigation from '@pages/meeting/section-navigation.component';
import VideoThumbnail from './video-thumbnail.component';
import MeetingAttendees from '@components/meeting/meeting-attendees.component';
import MeetingOrganizations from '@components/meeting/meeting-organizations.component';

const Chat = lazyWithRetry(() => import('@components/meeting/meeting-chat.component'));

function MeetingPageRightRail({
  sections,
  attendees,
  organizations,
  meeting,
  bot,
  thumbnailQueryResult,
  askEnabled = true,
  isLoading
}) {
  const user = useUserStore((state) => state?.user);
  const anySectionsEnabled = some(sections, { enabled: true });
  const isGuest = user?.isGuest;
  const [meetingFilter, setMeetingFilter] = useState('overview');
  const { showViewVideoButton } = useMeetingManagementActions(meeting, bot);

  const buildMeetingFilterOptions = () => {
    const output = [{ value: 'overview', label: 'Overview' }];
    if (attendees) {
      output.push({ value: 'people', label: 'People' });
    }
    if (organizations) {
      output.push({ value: 'organizations', label: 'Organizations' });
    }
    return output;
  };

  return (
    <Stack
      gap={11}
      p={11}
      mb={16}
    >
      <LinkRadio
        name='agenda-sidebar-filter'
        options={buildMeetingFilterOptions()}
        value={meetingFilter}
        onChange={setMeetingFilter}
      />

      {meetingFilter === 'overview' && (showViewVideoButton || anySectionsEnabled) && (
        <Stack
          gap={8}
          data-testid='overview-stack'
        >
          {showViewVideoButton && (
            <VideoThumbnail
              thumbnailQueryResult={thumbnailQueryResult}
              meeting={meeting}
              bot={bot}
            />
          )}
          {anySectionsEnabled && (
            <>
              <Text variant='content-section-header'>Table of Contents</Text>
              <MeetingPageSectionNavigation sections={sections} />
            </>
          )}
        </Stack>
      )}

      {attendees && meetingFilter !== 'organizations' && <MeetingAttendees attendees={attendees} />}

      {organizations && meetingFilter !== 'people' && (
        <MeetingOrganizations
          organizations={organizations}
          meetingId={meeting?.id}
        />
      )}

      {isGuest && (
        <>
          <Divider />
          <ForaBanner />
        </>
      )}

      {!isGuest && askEnabled && !isLoading && (
        <Suspense fallback={null}>
          <Chat meeting={meeting} />
        </Suspense>
      )}
    </Stack>
  );
}

export default memo(MeetingPageRightRail);
