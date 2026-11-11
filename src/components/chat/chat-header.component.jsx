import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  ExpandIcon as ExternalLinkIcon,
  SFChatBubblesIconOutlined as ChatIcon,
  MinimizeIcon,
  ContractIcon,
  SFBookPagesOutlinedIcon,
  CloseIcon,
  HorizontalDotMenuIcon,
  SFMinusCircleFillIcon,
  SFBrainHeadProfile
} from '@assets/icons';
import { useChatStore } from '@store/chat/chat.store.jsx';
import { useBreakpoints, useStyledToast } from '@util/hooks';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const ChatHeader = ({ isArtifactView, setIsArtifactView }) => {
  const { t } = useTranslation();

  const { isMobile } = useBreakpoints();
  const conversation = useChatStore((state) => state.conversation);
  const expansionState = useChatStore((state) => state.expansionState);
  const activeArtifactIndex = useChatStore((state) => state.activeArtifactIndex);
  const activeChainOfThought = useChatStore((state) => state.activeChainOfThought);
  const showReasoningPanel = useChatStore((state) => state.showReasoningPanel);
  const setShowReasoningPanel = useChatStore((state) => state.setShowReasoningPanel);
  const setReasoningPanelTouched = useChatStore((state) => state.activeChainOfThought);
  const initiatorData = useChatStore((state) => state.initiatorData);
  const initiatorType = useChatStore((state) => state.initiatorType);
  const closeFn = useChatStore((state) => state.closeFn);

  return (
    <Flex
      bg='brandPrimary.primary'
      color='brandPrimary.onPrimary'
      py={3}
      px={4}
      alignItems='center'
      justifyContent='space-between'
      width={expansionState === 'fullscreen' ? '100%' : ''}
    >
      <VStack
        align='flex-start'
        spacing={0}
      >
        <HStack
          spacing={3}
          align='center'
        >
          <Box
            bg='brandPrimary.primary'
            p={2}
            borderRadius='md'
            color='brandPrimary.primary'
          >
            {isArtifactView ? (
              <SFBookPagesOutlinedIcon
                color='white'
                h='36px'
                w='36px'
              />
            ) : (
              <ChatIcon color='white' />
            )}
          </Box>
          <VStack
            alignItems='flex-start'
            spacing={0}
          >
            <HStack>
              {isMobile && isArtifactView ? (
                <Text fontWeight='bold'>
                  {conversation?.artifacts[activeArtifactIndex]?.title ||
                    t('chatHeader.untitledContent')}
                </Text>
              ) : (
                <Text fontWeight='bold'>{t('chatHeader.askFora')}</Text>
              )}
            </HStack>
            <HStack>
              <Text
                fontSize='sm'
                color='whiteAlpha.800'
              >
                {initiatorData?.title || initiatorData?.meeting?.title}
              </Text>
              {initiatorType === 'Meeting' &&
                initiatorData?.start_at &&
                expansionState === 'fullscreen' && (
                  <Text
                    fontSize='sm'
                    color='whiteAlpha.600'
                  >
                    {format(new Date(initiatorData?.start_at), 'eee, MMM d, yyyy')}
                  </Text>
                )}
            </HStack>
          </VStack>
        </HStack>{' '}
      </VStack>
      <HStack spacing={1}>
        <OverflowMenu />
        <IconButton
          icon={<SFBrainHeadProfile boxSize={4} />}
          variant='ghost'
          colorScheme='surface'
          size='sm'
          _hover={{ bg: 'whiteAlpha.200' }}
          aria-label={t('chatHeader.showHideReasoningAriaLabel')}
          disabled={!activeChainOfThought || !activeChainOfThought.length}
          onClick={() => {
            setShowReasoningPanel(!showReasoningPanel);
            setReasoningPanelTouched(true);
          }}
        />
        {closeFn && <CloseButton closeFn={closeFn} />}
        {!closeFn && expansionState === 'floating' && <ExpandButton />}
        {!closeFn && expansionState === 'fullscreen' && <ContractButton />}
        {!closeFn && expansionState !== 'collapsed' && <MinimizeButton />}
        {isMobile && isArtifactView && (
          <CloseArtifactOnMobileButton setIsArtifactView={setIsArtifactView} />
        )}
      </HStack>
    </Flex>
  );
};

const OverflowMenu = () => {
  const { t } = useTranslation();

  const toast = useStyledToast();
  const conversation = useChatStore((state) => state.conversation);
  const clearChatFunction = useChatStore((state) => state.clearChat);

  const shouldShowClearChat = conversation?.messages?.filter((m) => m.role === 'user').length > 0;
  if (!shouldShowClearChat) return '';
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<HorizontalDotMenuIcon boxSize={4} />}
        variant='ghost'
        color='white'
        size='sm'
        _hover={{ bg: 'whiteAlpha.200' }}
        aria-label={t('chatHeader.optionOverflowMenuAriaLabel')}
      />
      <MenuList
        title={t('chatHeader.summaryOptions')}
        display='flex'
        alignItems='center'
        justifyContent='space-around'
      >
        <MenuItem
          icon={
            <SFMinusCircleFillIcon
              w={4}
              h={4}
            />
          }
          onClick={() => clearChatFunction(toast)}
        >
          {t('chatHeader.clearChat')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const CloseButton = ({ closeFn }) => {
  const { t } = useTranslation();

  return (
    <IconButton
      icon={<CloseIcon boxSize={4} />}
      variant='ghost'
      colorScheme='surface'
      size='sm'
      _hover={{ bg: 'whiteAlpha.200' }}
      aria-label={t('chatHeader.contractAriaLabel')}
      onClick={() => closeFn()}
    />
  );
};

const ContractButton = () => {
  const { t } = useTranslation();

  const showFloatingChat = useChatStore((state) => state.showFloatingChat);

  return (
    <IconButton
      icon={<ContractIcon boxSize={4} />}
      variant='ghost'
      colorScheme='surface'
      size='sm'
      _hover={{ bg: 'whiteAlpha.200' }}
      aria-label={t('chatHeader.contractAriaLabel')}
      onClick={() => showFloatingChat()}
    />
  );
};

const ExpandButton = () => {
  const { t } = useTranslation();

  const showFullscreenChat = useChatStore((state) => state.showFullscreenChat);

  return (
    <IconButton
      icon={<ExternalLinkIcon boxSize={4} />}
      variant='ghost'
      colorScheme='surface'
      size='sm'
      _hover={{ bg: 'whiteAlpha.200' }}
      aria-label={t('chatHeader.expandAriaLabel')}
      onClick={() => showFullscreenChat()}
    />
  );
};

const MinimizeButton = () => {
  const { t } = useTranslation();

  const showCollapsedChat = useChatStore((state) => state.showCollapsedChat);
  return (
    <IconButton
      icon={<MinimizeIcon boxsize={3} />}
      variant='ghost'
      color='white'
      size='sm'
      _hover={{ bg: 'whiteAlpha.200' }}
      aria-label={t('chatHeader.collapseAriaLabel')}
      onClick={() => showCollapsedChat()}
    />
  );
};

const CloseArtifactOnMobileButton = ({ setIsArtifactView }) => {
  const { t } = useTranslation();

  return (
    <IconButton
      icon={<CloseIcon boxsize={3} />}
      variant='ghost'
      color='white'
      size='sm'
      _hover={{ bg: 'whiteAlpha.200' }}
      aria-label={t('chatHeader.collapseAriaLabel')}
      onClick={() => setIsArtifactView(false)}
    />
  );
};

export default ChatHeader;
