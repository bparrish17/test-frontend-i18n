import { Box, HStack, Show, StackDivider, useDisclosure } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import MeetingDetailComponent from '@components/meeting/meeting-detail.component';
import { getMeetingView } from '@services/query-services/meetings.query-service';
import { useMeetingPageStore } from '@store/app.store';
import { meetingIdWithBot, meetingTranscriptsUpdaterFn } from '@util/helpers';
import {
  useMeetingPageState,
  useProtectTenant,
  useSetDocumentTitle,
  useUpdateBotFromPusherEvent
} from '@util/hooks';

import LoadingScreen from '@components/general/loading-screen.component';
import { MotionBox } from '@components/general/motion-box.component';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import MobileMeetingPage from './mobile-meeting.page';
import MeetingPageRightRail from './right-rail.component';

export default function MeetingPage() {
  const hasFetchedMeetingView = useRef(false);
  const { meetingId } = useParams();
  const [isTitleFinishedRevealing, setIsTitleFinishedRevealing] = useState(false);

  const videoDisclosure = useDisclosure();
  const setVideoDisclosure = useMeetingPageStore((state) => state.setVideoDisclosure);
  useEffect(() => {
    setVideoDisclosure(videoDisclosure);
  }, [videoDisclosure]);

  const { bot, attendees, organizations, isLoading, meeting, sections, thumbnailQueryResult } =
    useMeetingPageState(meetingId);

  // adds transcripts onto bot query if they come in
  useUpdateBotFromPusherEvent(
    bot?.id,
    'transcripts',
    ['meetings', { id: meetingId }, 'all'],
    meetingTranscriptsUpdaterFn
  );

  useSetDocumentTitle(`${meeting?.title} - FORA`);
  useProtectTenant(meeting?.tenant?.id);

  // https://foraday.atlassian.net/browse/FORA-989
  // Effect for firing a single "view" of a meeting. Only fires
  // once, on the initial page load, when the full meeting data is available
  useEffect(() => {
    const meetingId = meetingIdWithBot(meeting);
    if (meetingId && !hasFetchedMeetingView.current) {
      getMeetingView(meetingId);
      hasFetchedMeetingView.current = true;
    }
  }, [meeting]);

  useEffect(() => {
    if (meeting?.title) {
      const timeoutId = setTimeout(() => setIsTitleFinishedRevealing(true), 500);
      return () => clearTimeout(timeoutId);
    } else if (meeting?.id) {
      setIsTitleFinishedRevealing(true);
    }
  }, [meeting]);

  // accounting for meetings that don't have a title
  const showLoadingScreen = (meeting?.title && isLoading) || !isTitleFinishedRevealing;

  return (
    <AnimatePresence exitBeforeEnter>
      {showLoadingScreen && (
        <LoadingScreen
          key='loading-screen'
          title={meeting?.title}
        />
      )}
      <MeetingDetails
        key='meeting-details'
        sections={sections}
        meeting={meeting}
        bot={bot}
        attendees={attendees}
        organizations={organizations}
        thumbnailQueryResult={thumbnailQueryResult}
        isLoading={isLoading}
        isReadyToRender={isTitleFinishedRevealing}
      />
    </AnimatePresence>
  );
}

const MeetingDetails = memo(
  ({
    sections,
    meeting,
    bot,
    attendees,
    organizations,
    thumbnailQueryResult,
    isLoading,
    isReadyToRender
  }) => {
    return (
      <MotionBox
        hidden={!isReadyToRender}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Show below='1023px'>
          <MobileMeetingPage
            key='meeting-page-mobile'
            sections={sections}
          />
        </Show>
        <Show above='1024px'>
          <HStack
            alignItems='start'
            w='full'
            h='full'
            divider={<StackDivider style={{ margin: '0' }} />}
            justifyContent='center'
          >
            <Box
              as='section'
              flex={2}
              h='full'
              overflowY='scroll'
              sx={HIDE_SCROLLBAR}
              maxH='calc(100vh - 80px)'
              maxW='720px'
              m='0 2.5rem'
            >
              <MeetingDetailComponent sections={sections} />
            </Box>
            {isReadyToRender && (
              <Box
                as='section'
                flex={1}
                h='full'
                overflowY='scroll'
                sx={HIDE_SCROLLBAR}
                maxW='528px'
                minW='360px'
                maxH='calc(100vh - 80px)'
              >
                <MeetingPageRightRail
                  key='meeting-page-right-rail'
                  meeting={meeting}
                  bot={bot}
                  sections={sections}
                  attendees={attendees}
                  organizations={organizations}
                  thumbnailQueryResult={thumbnailQueryResult}
                  isLoading={isLoading}
                />
              </Box>
            )}
          </HStack>
        </Show>
      </MotionBox>
    );
  }
);
