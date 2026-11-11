import {
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Spacer,
  Spinner,
  Stack,
  Tag,
  Text,
  useConst,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { differenceInMilliseconds, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import {
  MeetLogoIcon,
  SFAddCircleFilledIcon,
  SFCalendarIcon,
  TeamsIcon,
  ZoomLogoIcon,
  SFPlusNoCircleIcon,
  SlackIcon
} from '@assets/icons';
import {
  useAgendaMeetings,
  useInvalidateMeetingQueries
} from '@services/query-services/meetings.query-service';
import {
  useLiveDate,
  useMailtoFunctionality,
  useMeetingBotStatuses,
  useMeetingManagementActions,
  useUpdateBotFromPusherEvent
} from '@util/hooks';
import {
  getMeetingSource,
  getMeetingTimeStatus,
  minutes,
  multiBotStatusChangeUpdaterFn
} from '@util/helpers';
import { MotionBox } from '@components/general/motion-box.component';
import CreateMeetingModal from '@components/meeting/create-meeting-modal.component';
import { useUserStore } from '@store/app.store';
import { useStatsigClient } from '@statsig/react-bindings';
import { useTranslation } from 'react-i18next';

const NoSourceIcon = () => (
  <Icon
    as={SFCalendarIcon}
    color='brandPrimary.onContainer'
    boxSize='15px'
    m={0.5}
  />
);

export default function AddMenu() {
  const { checkGate } = useStatsigClient();
  const isSummarizeMenuEnabled = checkGate('summarize-menu');
  return isSummarizeMenuEnabled ? <NewAddMenu /> : <LegacyAddMenu />;
}

function NewAddMenu() {
  const { t } = useTranslation();

  const today = useConst(Date.now());
  const liveDate = useLiveDate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const addForaModalDisclosure = useDisclosure();
  const [isStartingRecordingMeetingId, setIsStartingRecordingMeetingId] = useState(null);

  const { data: liveMeetings } = useAgendaMeetings(today, {
    select: (meetings) =>
      meetings?.filter((m) => {
        if (!m?.url) {
          return false;
        }

        const meetingLiveStatus = getMeetingTimeStatus(m, today);
        const isWithinFiveMinutes = differenceInMilliseconds(m?.start_at, liveDate) <= minutes(5);

        return meetingLiveStatus === 'live' || isWithinFiveMinutes;
      })
  });

  return (
    <>
      <Menu
        data-testid='add-menu'
        isOpen={isOpen || !!isStartingRecordingMeetingId}
        onOpen={onOpen}
        onClose={onClose}
        placement='left-start'
      >
        <MenuButton
          data-testid='add-menu-button'
          as={IconButton}
          icon={
            <MotionBox
              animate={{ rotate: isOpen ? 45 : 0 }}
              mx='auto'
              w='fit-content'
            >
              <SFAddCircleFilledIcon />
            </MotionBox>
          }
          color='brandPrimary.onContainer'
          h='60px'
          p={3}
          bgColor={isOpen ? 'surface.containerLow' : 'unset'}
          _hover={{ bgColor: 'surface.containerHigh' }}
          _active={{ bgColor: 'surface.containerHigh' }}
          onClick={(e) => e?.stopPropagation()}
        />
        <MenuList
          as={Stack}
          w='400px'
          gap={3}
          p={3}
        >
          <Stack gap={0}>
            <Text
              variant='label-caps-600-sm'
              color='surface.onSurfaceVariant'
            >
              {t('addMenu.recordLiveMeeting')}
            </Text>
            <AddMenuItemGroup>
              {liveMeetings?.map((meeting) => (
                <MeetingAddMenuItem
                  key={meeting.id}
                  meeting={meeting}
                  isStartingRecordingMeetingId={isStartingRecordingMeetingId}
                  setIsStartingRecordingMeetingId={setIsStartingRecordingMeetingId}
                />
              ))}
            </AddMenuItemGroup>
          </Stack>

          <AddMenuItem
            title={t('addMenu.pasteConferenceLink')}
            onClick={addForaModalDisclosure.onOpen}
            leftIcon={
              <HStack gap={0}>
                <ZoomLogoIcon boxSize={4} />
                <TeamsIcon boxSize={6} /> <MeetLogoIcon />
              </HStack>
            }
          />
        </MenuList>
      </Menu>
      <CreateMeetingModal disclosure={addForaModalDisclosure} />
    </>
  );
}

/*
live meetings are:
- meetings that are between start and end time.
- 5 mins before start time
*/

const MeetingAddMenuItem = ({
  meeting,
  isStartingRecordingMeetingId,
  setIsStartingRecordingMeetingId
}) => {
  const navigate = useNavigate();
  const { showAddForaBackButton, showAddForaButton, startMeetingAndRecording } =
    useMeetingManagementActions(meeting, meeting?.bot);
  const { isLive, wasSummarized } = useMeetingBotStatuses(meeting?.bot);
  const invalidateMeetingQueries = useInvalidateMeetingQueries();

  const meetingSource = getMeetingSource(meeting);
  const SourceIcon = meetingSource?.icon ?? NoSourceIcon;

  const today = useConst(Date.now());
  const bot = meeting?.bot;
  useUpdateBotFromPusherEvent(
    bot?.id,
    'status_changes',
    ['meetings', 'agenda', format(today, 'M/dd/yyyy')],
    multiBotStatusChangeUpdaterFn
  );

  if (!(showAddForaBackButton || (showAddForaButton && !isLive)) || wasSummarized) {
    return null;
  }

  return (
    <AddMenuItem
      key={meeting.id}
      meeting={meeting}
      title={meeting.title}
      onClick={async () => {
        setIsStartingRecordingMeetingId(meeting.id);
        await startMeetingAndRecording();
        setIsStartingRecordingMeetingId(false);
        invalidateMeetingQueries();
        navigate(`/meeting/${meeting.id}`);
      }}
      isLoading={isStartingRecordingMeetingId === meeting.id}
      leftIcon={<SourceIcon boxSize={meetingSource?.iconSize} />}
      _first={{ mt: 3 }}
    />
  );
};

const AddMenuItem = ({ meeting, title, onClick, leftIcon, isLoading, ...props }) => {
  return (
    <MenuItem
      border='reskin'
      bgColor='surface.containerLow'
      h='38px'
      px={3}
      onClick={onClick}
      {...props}
    >
      <HStack w='full'>
        {leftIcon}

        {meeting && (
          <Tag
            bgColor='live.primary'
            color='live.onPrimary'
            py={0.25}
            px={1.5}
            minW='fit-content'
          >
            <Text
              variant='label-600-lg'
              textTransform='lowercase'
            >
              {format(meeting?.start_at, 'hh:mm a')}
            </Text>
          </Tag>
        )}
        <Text
          variant='label-600-lg'
          fontWeight={500}
          color='surface.onSurface'
          layerStyle='ellipsis-text'
          maxW='full'
        >
          {title}
        </Text>
        <Spacer />
        {isLoading ? (
          <Spinner
            size='sm'
            color='brandPrimary.primary'
          />
        ) : (
          <SFPlusNoCircleIcon color='brandPrimary.primary' />
        )}
      </HStack>
    </MenuItem>
  );
};

const AddMenuItemGroup = ({ children, ...props }) => {
  return (
    <Stack
      gap={0}
      sx={{
        '&>*': {
          _notLast: {
            borderBottom: 'none',
            borderBottomRadius: 'unset'
          },
          _notFirst: {
            borderTopRadius: 'unset'
          }
        }
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

// ===

function LegacyAddMenu() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const tenant = useUserStore((state) => state?.tenant);
  const isSlackEnabled = !!tenant?.slack_config?.access_token;
  const isTeamsEnabled = !!tenant?.teams_config?.access_token;
  const onEmailClick = useMailtoFunctionality();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const addForaModalDisclosure = useDisclosure();

  return (
    <>
      <Menu
        data-testid='legacy-add-menu'
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement='left-start'
      >
        <MenuButton
          data-testid='legacy-add-menu-button'
          as={IconButton}
          icon={
            <MotionBox
              animate={{ rotate: isOpen ? 45 : 0 }}
              mx='auto'
              w='fit-content'
            >
              <SFAddCircleFilledIcon />
            </MotionBox>
          }
          color='brandPrimary.onContainer'
          h='60px'
          p={3}
          bgColor={isOpen ? 'surface.containerLow' : 'unset'}
          _hover={{ bgColor: 'surface.containerHigh' }}
          _active={{ bgColor: 'surface.containerHigh' }}
          onClick={(e) => e?.stopPropagation()}
        />
        <MenuList gap={3}>
          <MenuItem
            color='brandPrimary.primary'
            onClick={addForaModalDisclosure.onOpen}
          >
            <HStack>
              <Icon
                as={SFCalendarIcon}
                boxSize={4}
                marginTop={0.5}
              />
              <Text fontWeight={600}>{t('addMenu.addForaToA')}</Text>
            </HStack>
          </MenuItem>
          {(isSlackEnabled || isTeamsEnabled) && (
            <>
              <MenuDivider />
              <MenuOptionGroup title={t('addMenu.digests')}>
                {isSlackEnabled && (
                  <MenuItem
                    icon={<SlackIcon w={5} />}
                    onClick={() => navigate('/digests/create/slack')}
                  >
                    <HStack justifyContent='space-between'>
                      <Text>{t('addMenu.slackDigest')}</Text>
                      <Icon
                        as={SFPlusNoCircleIcon}
                        boxSize='18px'
                      />
                    </HStack>
                  </MenuItem>
                )}
                {isTeamsEnabled && (
                  <MenuItem
                    icon={<TeamsIcon w={5} />}
                    onClick={() => navigate('/digests/create/teams')}
                  >
                    <HStack justifyContent='space-between'>
                      <Text>{t('addMenu.teamsDigest')}</Text>
                      <Icon
                        as={SFPlusNoCircleIcon}
                        boxSize='18px'
                      />
                    </HStack>
                  </MenuItem>
                )}
              </MenuOptionGroup>
            </>
          )}
          <MenuDivider />
          <MenuItem onClick={(e) => onEmailClick(e, 'feed@fora.day', "Fora's email address")}>
            <Stack
              fontSize='xs'
              gap={0}
            >
              <Text
                fontWeight={600}
                color='surface.onSurfaceVariant'
              >
                {t('addMenu.noteForwardEmailThreads')}
              </Text>
              <Text
                color='surface.onSurfaceVariant'
                fontWeight={700}
              >
                {t('addMenu.feedForaDay')}
              </Text>
            </Stack>
          </MenuItem>
        </MenuList>
      </Menu>
      <CreateMeetingModal disclosure={addForaModalDisclosure} />
    </>
  );
}
