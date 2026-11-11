import {
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useOutsideClick
} from '@chakra-ui/react';
import { forwardRef, useRef } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useStatsigClient } from '@statsig/react-bindings/src';

import {
  ChevronDownIcon,
  InfoIcon,
  MailIcon,
  SFGearIcon,
  SFBoltFillIcon,
  SFDocRichTextOutlinedIcon,
  SFDollarSignCircleIcon,
  SFPlusNoCircleIcon,
  SFVolume,
  SlackFilledIcon,
  TeamsFilledIcon
} from '@assets/icons';
import { useIsUserType, useMailtoFunctionality } from '@util/hooks';
import { MotionBox } from '@components/general/motion-box.component';
import SummarizeEarningsCalls from '@components/layout/summarize/summarize-earnings-calls.component';
import SummarizeDocument from '@components/layout/summarize/summarize-document.component';
import SlackDigestModal from '@components/digest/slack-digest-modal.component';
import TeamsDigestModal from '@components/digest/teams-digest-modal.component';
import SummarizeAudioVideo from '@components/layout/summarize/summarize-audio-video.component';
import { useTranslation } from 'react-i18next';

const SummarizeMenu = () => {
  const { t } = useTranslation();

  const { isOpen, onToggle, onClose } = useDisclosure();
  const summarizeAudioVideoDisclosure = useDisclosure();
  const summarizeEarningsCallsDisclosure = useDisclosure();
  const summarizeDocumentDisclosure = useDisclosure();
  const summarizeSlackDisclosure = useDisclosure();
  const summarizeTeamsDisclosure = useDisclosure();

  const { checkGate } = useStatsigClient();
  const isTeamsEnabled = checkGate('teams-digests');
  const isAudioVideoEnabled = checkGate('summarize-audio-video');
  const isSummarizeEarningsCallsEnabled = useIsUserType('Admin', 'Executive');

  const menuContainerRef = useRef();
  const summarizeButtonRef = useRef();

  const onItemClick = (disclosure) => {
    disclosure.onOpen();
    onClose();
  };

  useOutsideClick({
    ref: menuContainerRef,
    handler: onClose
  });

  const onEmailClick = useMailtoFunctionality();
  const bgGradient = 'linear(to-b, brandPrimary.primary, brandSecondary.primary)';

  return (
    <Stack
      ref={menuContainerRef}
      data-testid='summarize-menu'
      position='relative'
    >
      <SummarizeButton
        ref={summarizeButtonRef}
        onToggle={onToggle}
        isOpen={isOpen}
        bgColor='transparent'
        zIndex={1}
      />
      <Box
        position='absolute'
        pt={`${summarizeButtonRef?.current?.clientHeight ?? 0}px`}
        left={0}
        right={0}
        bgGradient={bgGradient}
        borderRadius='md'
      >
        <Collapse
          animateOpacity
          in={isOpen}
        >
          <Stack
            gap={0}
            border='none'
            borderTopRadius='none'
          >
            <SummarizeMenuDivider />
            {isAudioVideoEnabled && (
              <SummarizeMenuItem
                icon={<SFVolume />}
                title={t('summarizeMenu.audioVideo')}
                onClick={() => onItemClick(summarizeAudioVideoDisclosure)}
              />
            )}
            <SummarizeMenuItem
              icon={<SFDocRichTextOutlinedIcon />}
              title={t('summarizeMenu.document')}
              onClick={() => onItemClick(summarizeDocumentDisclosure)}
            />
            {isSummarizeEarningsCallsEnabled && (
              <SummarizeMenuItem
                icon={<SFDollarSignCircleIcon />}
                title={t('summarizeMenu.earningsCall')}
                onClick={() => onItemClick(summarizeEarningsCallsDisclosure)}
              />
            )}
            <SummarizeMenuItem
              icon={<SlackFilledIcon boxSize={5} />}
              title={t('summarizeMenu.slackChannels')}
              onClick={() => onItemClick(summarizeSlackDisclosure)}
            />
            {isTeamsEnabled && (
              <SummarizeMenuItem
                icon={<TeamsFilledIcon boxSize={5} />}
                title={t('summarizeMenu.teamsChannels')}
                onClick={() => onItemClick(summarizeTeamsDisclosure)}
              />
            )}
            <SummarizeMenuDivider />
            <SummarizeMenuItem
              icon={<SFGearIcon />}
              title={t('summarizeMenu.manageUploads')}
              as={ReactRouterLink}
              to='/settings/manage-uploads'
              onClick={onClose}
              borderBottomRadius='md'
              showPlusIcon={false}
            />
            <SummarizeMenuItem
              h='fit-content'
              pt={2}
              pb={2.5}
              as={Box}
              _hover={{}}
              _active={{}}
            >
              <Flex
                w='full'
                gap={3}
              >
                <Icon
                  as={MailIcon}
                  boxSize='18px'
                  pl={1}
                />

                <Stack
                  fontSize='xs'
                  gap={0}
                  w='full'
                  textAlign='left'
                >
                  <Text fontWeight={500}>{t('summarizeMenu.forwardEmailTo')}</Text>
                  <Text
                    fontWeight={600}
                    cursor='pointer'
                    _hover={{ textDecor: 'underline' }}
                    w='fit-content'
                    onClick={(e) => onEmailClick(e, 'feed@fora.day', "Fora's email address")}
                  >
                    {t('summarizeMenu.feedForaDay')}
                  </Text>
                </Stack>

                <Tooltip
                  fontSize='xs'
                  label={t('summarizeMenu.forwardEmailsToFeed')}
                >
                  <IconButton
                    color='etc.whiteFixed'
                    rounded='full'
                    size='xs'
                    variant='reskinGhost'
                    _hover={{ bgColor: 'whiteAlpha.400' }}
                    icon={<InfoIcon />}
                  />
                </Tooltip>
              </Flex>
            </SummarizeMenuItem>
          </Stack>
        </Collapse>
      </Box>
      <SlackDigestModal disclosure={summarizeSlackDisclosure} />
      {isTeamsEnabled && <TeamsDigestModal disclosure={summarizeTeamsDisclosure} />}
      {isSummarizeEarningsCallsEnabled && (
        <SummarizeEarningsCalls disclosure={summarizeEarningsCallsDisclosure} />
      )}
      <SummarizeAudioVideo disclosure={summarizeAudioVideoDisclosure} />
      <SummarizeDocument disclosure={summarizeDocumentDisclosure} />
    </Stack>
  );
};

const SummarizeMenuDivider = () => (
  <Center
    py={1}
    px={3}
  >
    <Divider borderColor='etc.scrim_10' />
  </Center>
);

const SummarizeButton = forwardRef(({ onToggle, isOpen, ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <Button
      ref={ref}
      onClick={onToggle}
      leftIcon={
        <SFBoltFillIcon
          fill='white'
          boxSize={5}
        />
      }
      rightIcon={
        <MotionBox
          initial={{ rotate: 360 }}
          animate={{ rotate: isOpen ? 180 : 360 }}
          transition='linear'
        >
          <Center boxSize={5}>
            <ChevronDownIcon />
          </Center>
        </MotionBox>
      }
      h={11}
      px={3}
      _hover={{}}
      _active={{}}
      borderBottomRadius={isOpen ? 'none' : 'md'}
      {...props}
    >
      <Text
        variant='label-caps-600-lg'
        w='full'
      >
        {t('summarizeMenu.summarize')}
      </Text>
    </Button>
  );
});

const SummarizeMenuItem = ({ title, children, icon, showPlusIcon = true, ...props }) => (
  <Button
    rounded='none'
    h={8}
    px={3}
    variant='reskinGhost'
    color='brandPrimary.onPrimary'
    _hover={{ bg: 'brandPrimary.primaryDim' }}
    {...props}
  >
    {children ?? (
      <HStack w='full'>
        <Center boxSize={5}>{icon}</Center>
        <Text
          fontWeight={500}
          fontSize='xs'
        >
          {title}
        </Text>
        {showPlusIcon && (
          <>
            <Spacer />
            <Icon
              as={SFPlusNoCircleIcon}
              boxSize={5}
              data-testid='plus-icon'
            />
          </>
        )}
      </HStack>
    )}
  </Button>
);

export default SummarizeMenu;
