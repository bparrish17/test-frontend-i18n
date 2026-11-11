import { Button, Flex, Icon, Spacer, Stack, StackDivider, Text, useConst } from '@chakra-ui/react';
import { omit } from 'lodash-es';
import { forwardRef, useMemo } from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Markdown from 'react-markdown';

import { ChevronRightIcon, RSVPAcceptedIcon, SFCalendarIcon } from '@assets/icons';
import { useMeetingTimeStatus, useUpdateBotFromPusherEvent } from '@util/hooks';
import MeetingParticipants from '@components/meeting/meeting-participants.component';
import ReskinMeetingCardControlBar from '../reskin-meeting-card/reskin-meeting-card-control-bar.component';
import AgendaCardBody from './agenda-card-body.component';
import { StatusTimeLabel } from '../status-time-label.component';
import { ReskinMeetingCardContext } from '../reskin-meeting-card/reskin-meeting-card.component';

import { multiBotStatusChangeUpdaterFn, multiBotTranscriptUpdaterFn } from '@util/helpers';

function AgendaCard({ meeting, attendees, onMeetingActionClick, onCardActionClick }, ref) {
  const navigate = useNavigate();
  const meetingHasBot = !!meeting?.bot;
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const hideControlBar = meetingTimeStatus === 'done' && !meetingHasBot;
  const hasPrep = meetingTimeStatus === 'upcoming' && meeting?.preparation;
  const hasParticipants = meeting?.nylas?.participants?.length > 1;
  const card = useMemo(() => meeting?.card, [meeting?.card]); // since passed to useContext
  const today = useConst(new Date());

  const bot = meeting?.bot;
  useUpdateBotFromPusherEvent(
    bot?.id,
    'status_changes',
    ['meetings', 'agenda', format(today, 'M/dd/yyyy')],
    multiBotStatusChangeUpdaterFn
  );

  useUpdateBotFromPusherEvent(
    bot?.id,
    'transcripts',
    ['meetings', 'agenda', format(today, 'M/dd/yyyy')],
    multiBotTranscriptUpdaterFn
  );

  return (
    <ReskinMeetingCardContext.Provider
      value={{
        meeting,
        card,
        bot,
        onMeetingActionClick,
        onCardActionClick
      }}
    >
      <Stack
        ref={ref}
        divider={<StackDivider style={{ margin: 0 }} />}
        layerStyle='section-card'
        h='fit-content'
      >
        {/* Heading */}
        <Stack
          py={4}
          onClick={() => navigate(`/meeting/${meeting?.id}`)}
          cursor='pointer'
          data-testid='agenda-card-header'
        >
          <Flex
            gap={2}
            px={3}
          >
            <StatusTimeLabel
              meeting={meeting}
              bot={bot}
              opacity={1}
            />
            <Spacer />
            {meeting.rsvp.status === 'yes' && (
              <Icon
                as={RSVPAcceptedIcon}
                color='positive.primary'
                boxSize={4}
              />
            )}
          </Flex>
          <Flex
            gap={2}
            px={4}
            align='center'
          >
            <SFCalendarIcon
              boxSize='18px'
              color='brandPrimary.primary'
            />
            <Text
              fontSize='18px'
              fontWeight={600}
              as={ReactRouterLink}
              to={`/meeting/${meeting?.id}`}
              cursor='pointer'
            >
              {meeting?.title}
            </Text>
            <Spacer />
            <Button
              as={ReactRouterLink}
              to={`/meeting/${meeting?.id}`}
              variant='reskinLink'
              px={2}
              size='xs'
              gap={0.5}
              data-testid='meeting-details-button'
            >
              <Text display={{ base: 'none', sm: 'block' }}>Meeting Details</Text>
              <Icon
                as={ChevronRightIcon}
                boxSize={4}
              />
            </Button>
          </Flex>
        </Stack>

        {(hasPrep || !!card || hasParticipants) && (
          <Stack
            p={4}
            gap={6}
            color='surface.onSurfaceVariant'
            cursor='pointer'
            onClick={() => navigate(`/meeting/${meeting?.id}`)}
            data-testid='agenda-card-body'
          >
            {hasPrep && (
              <>
                <Text variant='content-section-header'>Meeting Preparation</Text>
                <Markdown
                  style={{ letterSpacing: 'wide' }}
                  components={{ strong, p, ul }}
                >
                  {meeting?.preparation}
                </Markdown>
              </>
            )}
            {card && <AgendaCardBody card={card} />}
            {hasParticipants && attendees?.length && <MeetingParticipants meeting={meeting} />}
          </Stack>
        )}

        {!hideControlBar && <ReskinMeetingCardControlBar showShareEmailButton />}
      </Stack>
    </ReskinMeetingCardContext.Provider>
  );
}

export default forwardRef(AgendaCard);

// Markdown Components
function strong(props) {
  return (
    <Text
      as='span'
      color='brandPrimary.primary'
      fontWeight={600}
      {...omit(props, 'node')}
    />
  );
}

function p(props) {
  return (
    <Text
      fontWeight={500}
      {...omit(props, 'node')}
    />
  );
}

function ul(props) {
  return (
    <Stack
      as='ul'
      pl={4}
      {...omit(props, 'node')}
    />
  );
}
