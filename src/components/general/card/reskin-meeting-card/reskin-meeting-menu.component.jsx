import {
  HorizontalDotMenuIcon,
  SFApplePencil,
  SFBookPagesOutlinedIcon,
  SFSquareArrowUp,
  SFTrashIcon,
  SFXMarkFilled,
  StatusPausedIcon,
  StatusRecordingIcon
} from '@assets/icons';
import {
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import CategoryModal from '@components/general/card/category-modal.component';

import TranscriptModal from '@components/general/card/reskin-meeting-card/transcript-modal.component';
import DeleteConfirmationModal from '@components/general/modals/delete-confirmation-modal.component';
import ShareMeetingModal from '@components/meeting/share-meeting-modal.component';
import analyticsService from '@services/analytics.service';
import { useUserStore } from '@store/app.store';
import { getMeetingSource } from '@util/helpers';
import {
  useIsUserType,
  useMeetingBotStatuses,
  useMeetingManagementActions,
  useMeetingTimeStatus,
  useRemoveFora,
  useReskinMeetingCardContext
} from '@util/hooks';
import ReskinSummaryCardMenu from '../reskin-summary-card/reskin-summary-card-menu.component';
import { useTranslation } from 'react-i18next';

export default function ReskinMeetingMenu({ buttonProps, showViewTranscriptButton }) {
  const { t } = useTranslation();

  const { meeting, bot, onMeetingActionClick, labelsModalDisclosure } =
    useReskinMeetingCardContext();
  const {
    transcriptAvailable,
    showJoinButton,
    showPauseResumeButton,
    pauseResume,
    startMeetingAndRecording,
    showStartEarlyButton,
    isShareable
  } = useMeetingManagementActions(meeting, bot);
  const transcriptDisclosure = useDisclosure();
  const categoryModalDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const { isDone, wasSummarized } = useMeetingBotStatuses(bot);
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const handleInitiativeUpdated = (meetingInitiative) => {
    onMeetingActionClick('initiative', meetingInitiative, meeting);
    categoryModalDisclosure.onClose();
  };

  const handleDelete = (e) => {
    onMeetingActionClick('archive', null, meeting);
    deleteDisclosure.onClose();
    e.stopPropagation();
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    analyticsService.trackMenuClick('Meeting Action Overflow Menu Click', {
      meetingId: meeting?.id,
      route: window?.location?.pathname
    });
  };

  return (
    <>
      <Menu
        closeOnSelect={false}
        placement='left-start'
      >
        {({ isOpen }) => (
          <>
            <MenuButton
              as={IconButton}
              variant='reskinWhite'
              onClick={handleMenuToggle}
              icon={
                <Icon
                  as={HorizontalDotMenuIcon}
                  boxSize='13px'
                  color='brandPrimary.primary'
                />
              }
              {...buttonProps}
            />
            <MenuList>
              <MenuOptionGroup title={t('reskinMeetingMenu.meetingOptions')}>
                {isDone || wasSummarized || (!bot && meetingTimeStatus === 'done') ? (
                  <MeetingMenuAfter
                    isOpen={isOpen}
                    categoryModalDisclosure={categoryModalDisclosure}
                    transcriptDisclosure={transcriptDisclosure}
                    deleteDisclosure={deleteDisclosure}
                    isShareable={isShareable}
                    showViewTranscriptButton={showViewTranscriptButton}
                    transcriptAvailable={transcriptAvailable}
                    labelsModalDisclosure={labelsModalDisclosure}
                  />
                ) : (
                  <MeetingMenuBeforeDuring
                    categoryModalDisclosure={categoryModalDisclosure}
                    transcriptDisclosure={transcriptDisclosure}
                    showPauseResumeButton={showPauseResumeButton}
                    pauseResume={pauseResume}
                    showJoinButton={showJoinButton}
                    showStartEarlyButton={showStartEarlyButton}
                    startEarly={startMeetingAndRecording}
                    showViewTranscriptButton={showViewTranscriptButton}
                    transcriptAvailable={transcriptAvailable}
                    labelsModalDisclosure={labelsModalDisclosure}
                  />
                )}
              </MenuOptionGroup>
            </MenuList>
          </>
        )}
      </Menu>
      <TranscriptModal
        meeting={meeting}
        bot={bot}
        disclosure={transcriptDisclosure}
      />
      <DeleteConfirmationModal
        disclosure={deleteDisclosure}
        onConfirmDelete={handleDelete}
      >
        <Stack
          gap={3}
          color='surface.onSurfaceVariant'
        >
          <Text variant='body-500-md'>
            {t('reskinMeetingMenu.youAreAboutTo')}
            <Text
              as='span'
              color='surface.onSurface'
              variant='body-600-md'
            >
              {t('reskinMeetingMenu.permanently')}
            </Text>
          </Text>
          <Text variant='body-500-md'>
            {t('reskinMeetingMenu.thisAction')}
            <Text
              as='span'
              color='surface.onSurface'
              variant='body-600-md'
            >
              {t('reskinMeetingMenu.cannotBeUndone')}
            </Text>
          </Text>
          <Text variant='body-500-md'>
            Your&nbsp;
            <Text
              as='span'
              color='surface.onSurface'
              variant='body-600-md'
            >
              {t('reskinMeetingMenu.colleaguesWillAlsoLose')}
            </Text>
            to this content.
          </Text>
          <Divider my={3} />
          <Text variant='body-500-sm'>{t('reskinMeetingMenu.noteAnyInsightsGenerated')}</Text>
        </Stack>
      </DeleteConfirmationModal>
      <CategoryModal
        disclosure={categoryModalDisclosure}
        title={t('reskinMeetingMenu.meetingCategory')}
        initialValue={meeting?.initiative?.id || meeting?.card?.initiative?.id}
        descriptionText='Note: If you change the meeting type after a meeting has completed, FORA may regenerate the summary to fit the selected meeting type.'
        handleCategoryUpdated={handleInitiativeUpdated}
      />
    </>
  );
}

function MeetingMenuBeforeDuring({
  categoryModalDisclosure,
  showPauseResumeButton,
  showJoinButton,
  showStartEarlyButton,
  labelsModalDisclosure
}) {
  const { t } = useTranslation();

  const { meeting, bot } = useReskinMeetingCardContext();
  const { botWasScheduled, isOnPause } = useMeetingBotStatuses(bot);
  const { removeFora, isRemovingFora, removeFromSeries, isRemovingFromSeries } = useRemoveFora(
    meeting,
    bot
  );

  const meetingSource = getMeetingSource(meeting);
  let recordingButtonText = 'Pause';
  if (isOnPause) {
    recordingButtonText = 'Resume';
  } else if (showStartEarlyButton) {
    recordingButtonText = 'Start';
  }

  return (
    <>
      {showJoinButton && (
        <MenuItem
          icon={
            <Icon
              as={meetingSource?.icon}
              boxSize={meetingSource?.iconSize}
              w={5}
            />
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          as='a'
          href={meeting?.url}
          target='_blank'
        >
          {t('reskinMeetingMenu.joinMeeting')}
        </MenuItem>
      )}
      {(showPauseResumeButton || showStartEarlyButton) && (
        <MenuItem
          icon={
            <Icon
              as={isOnPause || showStartEarlyButton ? StatusRecordingIcon : StatusPausedIcon}
              boxSize={5}
              color={isOnPause || showStartEarlyButton ? 'live.primary' : 'surface.outline'}
              w={5}
            />
          }
          onClick={(e) => {
            e.stopPropagation();
            labelsModalDisclosure?.onOpen();
          }}
        >
          {t('reskinMeetingMenu.recording', { recordingButtonText })}
        </MenuItem>
      )}

      {(showJoinButton || showPauseResumeButton || showStartEarlyButton) && <MenuDivider />}

      <MenuItem
        icon={<SFApplePencil w={5} />}
        onClick={(e) => {
          e.stopPropagation();
          labelsModalDisclosure?.onOpen();
        }}
      >
        {t('reskinMeetingMenu.editLabels')}
      </MenuItem>

      <MenuItem
        icon={<SFApplePencil w={5} />}
        onClick={(e) => {
          e.stopPropagation();
          categoryModalDisclosure?.onOpen();
        }}
      >
        {t('reskinMeetingMenu.editCategory')}
      </MenuItem>

      {botWasScheduled && (
        <>
          <MenuDivider />
          <MenuItem
            icon={<SFXMarkFilled w={5} />}
            onClick={(e) => {
              e.stopPropagation();
              removeFora();
            }}
            isDisabled={isRemovingFora}
          >
            {t('reskinMeetingMenu.removeFora')}
          </MenuItem>
          {meeting?.parent_id && (
            <MenuItem
              icon={<SFXMarkFilled w={5} />}
              onClick={(e) => {
                e.stopPropagation();
                removeFromSeries();
              }}
              isDisabled={isRemovingFromSeries}
            >
              {t('reskinMeetingMenu.removeForaFromSeries')}
            </MenuItem>
          )}
        </>
      )}
    </>
  );
}

function MeetingMenuAfter({
  categoryModalDisclosure,
  transcriptDisclosure,
  deleteDisclosure,
  showViewTranscriptButton,
  transcriptAvailable,
  labelsModalDisclosure,
  isShareable
}) {
  const { t } = useTranslation();

  const { meeting, bot, card, showCardActions, onCardActionClick, showShareInMenu } =
    useReskinMeetingCardContext();
  const shareMeetingDisclosure = useDisclosure();
  const user = useUserStore((state) => state.user);
  const isGuest = !!user?.isGuest;
  const isExecutiveOrAdmin = useIsUserType('Executive', 'Admin');

  return (
    <ReskinSummaryCardMenu
      meeting={meeting}
      card={card}
      showCardActions={showCardActions}
      onCardActionClick={onCardActionClick}
    >
      {showShareInMenu && isShareable && !isGuest && (
        <ShareMeetingModal
          meeting={meeting}
          bot={bot}
          showSharedSummary
          customDisclosure={shareMeetingDisclosure}
          openButton={
            <MenuItem
              icon={<SFSquareArrowUp w={5} />}
              onClick={(e) => {
                e.stopPropagation();
                shareMeetingDisclosure.onOpen();
              }}
            >
              {t('reskinMeetingMenu.shareSummary')}
            </MenuItem>
          }
        />
      )}
      {showViewTranscriptButton && transcriptAvailable && (
        <MenuItem
          icon={<SFBookPagesOutlinedIcon w={5} />}
          onClick={(e) => {
            e.stopPropagation();
            transcriptDisclosure.onOpen();
          }}
        >
          {t('reskinMeetingMenu.viewTranscript')}
        </MenuItem>
      )}

      {((showViewTranscriptButton && transcriptAvailable) || (isShareable && !isGuest)) && (
        <MenuDivider />
      )}

      <MenuItem
        icon={<SFApplePencil w={5} />}
        onClick={(e) => {
          e.stopPropagation();
          labelsModalDisclosure?.onOpen();
        }}
      >
        {t('reskinMeetingMenu.editLabels')}
      </MenuItem>
      <MenuItem
        icon={<SFApplePencil w={5} />}
        onClick={(e) => {
          e.stopPropagation();
          categoryModalDisclosure?.onOpen();
        }}
      >
        {t('reskinMeetingMenu.editCategory')}
      </MenuItem>

      {isExecutiveOrAdmin && (
        <>
          <MenuDivider />
          <MenuItem
            color='critical.primaryDimmer'
            icon={
              <SFTrashIcon
                ml={0.5}
                mr={1}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              deleteDisclosure.onOpen();
            }}
          >
            {t('reskinMeetingMenu.deleteMeeting')}
          </MenuItem>
        </>
      )}
    </ReskinSummaryCardMenu>
  );
}
