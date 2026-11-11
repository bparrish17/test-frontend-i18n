import { Text, Stack, Divider, Button } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';
import { useState } from 'react';

import { useUserStore } from '@store/app.store';
import { useMeetingTimeStatus, useStyledToast } from '@util/hooks';
import { extractZoomMeetingId, zoomHelpText, disableCloudRecording } from '@util/helpers';

import MeetingPageSection from '@pages/meeting/section.component';
import SectionHeader from '@components/meeting/section-header.component';

import {
  useZoomMeetingRecordingStatus,
  usePostZoomDownloadMeetingRecording
} from '@services/query-services/lambda.query-service';

import { ZoomLogoIcon } from '@assets/icons';

const section = {
  enabled: true,
  name: 'Summarize This Meeting',
  icon: ZoomLogoIcon
};

export default function CloudRecordingSection({ meeting, bot }) {
  const toast = useStyledToast();
  const [isStartingDownload, setIsStartingDownload] = useState(false);
  const { checkGate } = useStatsigClient();
  const enableCloudRecording = checkGate('zoom-cloud-recording');
  const tenant = useUserStore((state) => state?.tenant);
  const user = useUserStore((state) => state?.user);
  const zoomMeetingId = extractZoomMeetingId(meeting);
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const isDone = meetingTimeStatus === 'done';

  const { data: zoomRecordingStatus, isLoading } = useZoomMeetingRecordingStatus(
    tenant?.recall_config?.zoom_oauth_credential_id,
    zoomMeetingId,
    meeting?.id,
    !disableCloudRecording(bot, enableCloudRecording, zoomMeetingId, isDone)
  );

  const { mutateAsync: downloadMeetingRecording } = usePostZoomDownloadMeetingRecording();
  const helperText = zoomHelpText(isDone, isLoading, zoomRecordingStatus);

  const downloadRecording = async () => {
    setIsStartingDownload(true);
    await downloadMeetingRecording(
      {
        meeting_id: zoomMeetingId,
        person: user,
        fora_meeting: meeting
      },
      {
        onSuccess: () => {
          toast({
            title: 'Download scheduled successfully',
            status: 'success',
            duration: 9000,
            isClosable: true
          });
        }
      }
    );

    setIsStartingDownload(false);
  };

  if (disableCloudRecording(bot, enableCloudRecording, zoomMeetingId, isDone)) {
    return null;
  }

  return (
    <MeetingPageSection
      id='cloud-recording'
      section={section}
      hideHeader
      gap={0}
    >
      <Stack
        gap={0}
        layerStyle='section-card'
      >
        <SectionHeader
          headline={helperText?.header}
          icon={ZoomLogoIcon}
        />
        <Divider style={{ margin: 0 }} />
        <Stack
          p={6}
          gap={3}
        >
          <Text
            as='span'
            color='surface.onSurfaceVariant'
            fontWeight={400}
          >
            {helperText?.subtext}
          </Text>
          <Button
            isLoading={isStartingDownload}
            type='submit'
            variant='reskinPrimary'
            w='25%'
            disabled={zoomRecordingStatus?.code !== 200}
            onClick={() => downloadRecording()}
          >
            Summarize Now
          </Button>
        </Stack>
      </Stack>
    </MeetingPageSection>
  );
}
