import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Stack,
  Switch,
  Text,
  Tooltip,
  Spinner
} from '@chakra-ui/react';
import { isAfter } from 'date-fns';

import { useUserStore } from '@store/app.store';
import { SFPlusCircleFilledIcon } from '@assets/icons';
import AddForaModal from '@components/meeting/add-fora-modal.component';
import PrivacyMenu from '@components/privacy/privacy-menu.component.jsx';
import ViewsMenu from '@components/privacy/views-menu.component.jsx';
import ProgressBar from '@components/general/card/reskin-meeting-card/progress-bar.component';
import { getMeetingSource } from '@util/helpers';
import {
  useMeetingBotStatuses,
  useMeetingManagementActions,
  useMeetingTimeProgress,
  useControlBarState,
  useReskinMeetingCardContext
} from '@util/hooks';
import ReskinMeetingMenu from './reskin-meeting-menu.component';
import ShareMeetingModal from '@components/meeting/share-meeting-modal.component';
import { useTranslation } from 'react-i18next';

// Figma States: https://www.figma.com/design/ivKzvIcNj3u98amA95iA2s/FORA-Design-System?node-id=550-107841&t=R4AOuHH8zcVdZVvV-0

const sizeStyles = {
  sm: {
    container: {
      p: 3
    },
    button: {
      size: 'reskinMd',
      px: 2
    },
    textContainer: {
      gap: 2
    },
    text: {
      fontSize: 'sm'
    }
  },
  lg: {
    container: {
      px: 11,
      py: 4
    },
    button: {
      size: 'reskinLg',
      px: 3
    },
    text: {},
    textContainer: {
      gap: 3
    }
  }
};

export default function ReskinMeetingCardControlBar({
  size = 'sm',
  enableMenu = true,
  showShareEmailButton = false,
  showViewTranscriptButton = true,
  showPrivacyButton = false,
  canShowAddForaBackButton = false,
  ...containerProps
}) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const isGuest = !!user?.isGuest;

  const { meeting, bot } = useReskinMeetingCardContext();
  const { isOnPause, isCallEnded, botWasScheduled, botWasNeverAdmitted } =
    useMeetingBotStatuses(bot);
  const { elapsedTime, progress } = useMeetingTimeProgress(meeting, bot);
  const {
    showJoinButton,
    showStartEarlyButton,
    isStartingRecording,
    startMeetingAndRecording,
    showPauseResumeButton,
    pauseResume,
    isPausingResuming,
    showAddForaButton,
    showAddForaBackButton,
    addForaModalDisclosure,
    isShareable
  } = useMeetingManagementActions(meeting, bot);
  const controlBarState = useControlBarState(meeting, bot);
  const sizeStyle = sizeStyles[size];
  const isDone = botWasNeverAdmitted ? isAfter(new Date(), meeting?.end_at) : isCallEnded;

  const meetingSource = getMeetingSource(meeting);

  const controlBarStateTextDisplay =
    window.innerWidth < 400 && controlBarState?.text === 'Summarized' ? 'none' : 'block';

  if (!controlBarState) {
    return null;
  }

  return (
    <Stack
      p={3}
      bgColor={controlBarState?.bgColor}
      borderBottomRadius='inherit'
      {...sizeStyle.container}
      {...containerProps}
    >
      <Flex
        flexWrap={{ base: 'wrap', lg: 'unset' }}
        justify='space-between'
        align='center'
        gap={2}
      >
        {/* Left Label + Element (if applicable) */}
        {showPauseResumeButton ? (
          <HStack>
            <Switch
              id='pause-resume-switch'
              isChecked={!isOnPause}
              isDisabled={isPausingResuming}
              onChange={pauseResume}
              variant='live'
            />
            <Tooltip label={controlBarState.toolTip || ''}>
              <Text
                htmlFor='schedule-switch'
                fontWeight={500}
                color={controlBarState.color}
                whiteSpace='normal'
                {...(controlBarState.toolTip
                  ? {
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '2px'
                    }
                  : {})}
                mb={0}
                {...sizeStyle.text}
              >
                {controlBarState.text}{' '}
                {isPausingResuming && (
                  <Spinner
                    size='xs'
                    ml={1}
                  />
                )}
              </Text>
            </Tooltip>
          </HStack>
        ) : (
          // todo: abstract this status label to a general component
          <Flex
            gap={1.5}
            align='center'
          >
            {controlBarState?.leftElement}
            <Tooltip label={controlBarState.toolTip || controlBarState.text}>
              <Text
                fontWeight={500}
                maxW={450}
                color={controlBarState.color}
                display={controlBarStateTextDisplay}
                {...(controlBarState.toolTip
                  ? {
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '2px'
                    }
                  : {})}
                {...sizeStyle.text}
              >
                <HStack>
                  <div>{controlBarState.text}</div>{' '}
                  {controlBarState?.rightElement && controlBarState.rightElement}
                </HStack>
              </Text>
            </Tooltip>
          </Flex>
        )}

        {/* Right Actions */}
        <HStack ml='auto'>
          {meeting && showPrivacyButton && !isGuest && (
            <HStack
              spacing={0}
              borderRadius='md'
              border='reskin'
              overflow='hidden'
            >
              <PrivacyMenu meeting={meeting} />
              <ViewsMenu meeting={meeting} />
            </HStack>
          )}
          {showShareEmailButton && isShareable && !isGuest && (
            <ShareMeetingModal
              meeting={meeting}
              bot={bot}
              buttonStyles={sizeStyle.button}
              showSharedSummary
            />
          )}
          {showStartEarlyButton && (
            <Tooltip label={t('reskinMeetingCardControlBar.startingEarlyAddFora')}>
              <Button
                variant='reskinWhite'
                {...sizeStyle.button}
                isLoading={isStartingRecording}
                leftIcon={
                  <Box
                    w={3}
                    h={3}
                    borderRadius='full'
                    bgColor='live.primary'
                  />
                }
                onClick={startMeetingAndRecording}
              >
                {t('reskinMeetingCardControlBar.start')}
              </Button>
            </Tooltip>
          )}
          {showAddForaBackButton && canShowAddForaBackButton && (
            <Button
              variant='reskinWhite'
              {...sizeStyle.button}
              isLoading={isStartingRecording}
              leftIcon={
                <Icon
                  as={SFPlusCircleFilledIcon}
                  color='brandPrimary.primary'
                  boxSize={5}
                  p={0}
                />
              }
              onClick={startMeetingAndRecording}
            >
              {t('reskinMeetingCardControlBar.addForaBack')}
            </Button>
          )}
          {showJoinButton && (
            <Button
              variant='reskinWhite'
              {...sizeStyle.button}
              as='a'
              href={meeting?.url}
              target='_blank'
              leftIcon={
                <Icon
                  as={meetingSource?.icon}
                  boxSize={meetingSource?.iconSize}
                />
              }
            >
              {t('reskinMeetingCardControlBar.join')}
            </Button>
          )}
          {showAddForaButton && (
            <Button
              variant='reskinWhite'
              {...sizeStyle.button}
              onClick={addForaModalDisclosure.onOpen}
            >
              {t('reskinMeetingCardControlBar.addFora')}
            </Button>
          )}
          {enableMenu && (
            <ReskinMeetingMenu
              buttonProps={sizeStyle.button}
              showViewTranscriptButton={showViewTranscriptButton}
            />
          )}
        </HStack>
      </Flex>
      <ProgressBar
        elapsedTime={elapsedTime}
        isDone={isDone}
        isStartingRecording={isStartingRecording}
        botWasScheduled={botWasScheduled}
        isOnPause={isOnPause}
        progress={progress}
      />
      <AddForaModal
        meeting={meeting}
        disclosure={addForaModalDisclosure}
      />
    </Stack>
  );
}
