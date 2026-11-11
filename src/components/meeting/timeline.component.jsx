import { Divider, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import { last } from 'lodash-es';
import { useSearchParams } from 'react-router-dom';

import { useListRefs, useMeetingBotStatuses } from '@util/hooks';
import { useMeetingPageStore, useUserStore } from '@store/app.store';
import { AlertTriangle, SFListBulletIndentIcon } from '@assets/icons';
import { formatToStopwatchDuration } from '@util/helpers';

import SectionHeader from '@components/meeting/section-header.component';
import TopicGroup from '@components/meeting/topic-group.component';
import CopyTextMenu from '@components/general/copy-text-menu.component';
import analyticsService from '@services/analytics.service';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {Object} TimelineProps
 * @property {Meeting | undefined} meeting
 * @property {Object} bot
 * @property {MeetingTimeStatus} meetingTimeStatus
 * @property {Object[]} topicGroups
 * @property {Object[]} ungroupedSummaries
 *
 * @param {TimelineProps} props
 */
export default function Timeline({ bot, meetingTimeStatus, topicGroups, ungroupedSummaries }) {
  const videoDisclosure = useMeetingPageStore((state) => state.videoDisclosure);
  const { isLive } = useMeetingBotStatuses(bot);
  const liveTopicGroupRef = useRef();
  // eslint-disable-next-line
  const [_searchParams, setSearchParams] = useSearchParams();
  const { refs: topicGroupRefs } = useListRefs(topicGroups);
  const user = useUserStore((state) => state.user);

  const handleVideoClick = (time) => {
    videoDisclosure.onOpen();
    setSearchParams({ time }, { replace: true });
  };

  const handleTimelineMenuClick = () => {
    analyticsService.trackMenuClick('Meeting Timeline Overflow Menu Click', {
      userId: user?.id,
      route: window?.location?.pathname
    });
  };

  return (
    <Stack
      layerStyle='section-card'
      gap={0}
    >
      <SectionHeader
        headline='Meeting Timeline'
        icon={SFListBulletIndentIcon}
        actionIcon={
          <CopyTextMenu
            textToCopy={buildTranscriptString(topicGroups)}
            hoverButton={false}
            trackerFn={handleTimelineMenuClick}
          />
        }
      />
      <Divider style={{ margin: 0 }} />
      <Stack gap={0}>
        {topicGroups?.map((topicGroup, idx) => (
          <TopicGroup
            key={topicGroup?.title + topicGroup?.time?.start}
            ref={topicGroupRefs.current[idx]}
            title={topicGroup?.title}
            transcriptIndex={topicGroup?.transcriptIndex}
            startTime={formatToStopwatchDuration((topicGroup?.time?.rawStart ?? 0) * 1000)}
            rawStartTime={topicGroup?.time?.rawStart}
            endTime={formatToStopwatchDuration((topicGroup?.time?.rawEnd ?? 0) * 1000)}
            summaries={topicGroup?.summaries}
            isLive={isLive}
            onVideoClick={handleVideoClick}
            enableVideoButton
            topicStatus={idx >= 0 ? 'COMPLETE' : null}
          />
        ))}
        {isLive && (
          <TopicGroup
            ref={liveTopicGroupRef}
            title=''
            transcriptIndex='live'
            startTime={formatToStopwatchDuration((last(topicGroups)?.time?.rawEnd ?? 0) * 1000)}
            endTime='Now'
            summaries={ungroupedSummaries}
            isLive={isLive}
            showLoading
            noCollapse={!ungroupedSummaries.length}
          />
        )}
        {meetingTimeStatus === 'done' && !bot && <ForaDidNotAttendText />}
      </Stack>
    </Stack>
  );
}

function buildTranscriptString(data) {
  let result = '';

  data.forEach((item) => {
    // Append the main title
    result += item.title + '\n\n';

    // Process each summary
    item.summaries.forEach((summary) => {
      // Append the summary title
      result += summary.title + '\n';

      // Append each content line with a dash in front
      summary.contentLines.forEach((line) => {
        result += '- ' + line;
      });

      result += '\n\n';
    });

    result += '--- --- --- ---\n\n';
  });

  return result;
}

function ForaDidNotAttendText() {
  const { t } = useTranslation();

  return (
    <Stack
      w='full'
      align='center'
      gap={2.5}
    >
      <HStack
        color='critical.primary'
        fontWeight='bold'
      >
        <Icon as={AlertTriangle} />
        <Text>{t('timeline.noSummaryOrTranscript')}</Text>
      </HStack>
      <Text textAlign='center'>{t('timeline.foraDidNotAttend')}</Text>
    </Stack>
  );
}
