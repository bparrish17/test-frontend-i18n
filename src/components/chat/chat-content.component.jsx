import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Stack,
  Button,
  Collapse,
  Spacer
} from '@chakra-ui/react';
import { useState } from 'react';
import { uniqueId } from 'lodash-es';
import MessageContent from './chat-message-content.component';

import { CloseIcon, CopyIcon, SFBookPagesOutlinedIcon, SFBrainHeadProfile } from '@assets/icons';
import { useBreakpoints, useCopyToClipboard } from '@util/hooks';
import { useChatStore } from '@store/chat/chat.store.jsx';
import ChatSplashScreen from './chat-splash-screen.component';
import ActiveChainOfThoughtDisplay from './chat-cot-display.component';
import ForaBadge from './chat-fora-badge.component';
import ThinkingMessage from './chat-thinking-message.component';

const ChatContent = ({
  scrollerRef,
  setIsArtifactView,
  customSplashScreen = <ChatSplashScreen />
}) => {
  const copyToClipboard = useCopyToClipboard();
  const { isMobile } = useBreakpoints();
  const [showThinking, setShowThinking] = useState(false);

  const conversation = useChatStore((state) => state.conversation);
  const showFullscreenChat = useChatStore((state) => state.showFullscreenChat);
  const displayMessages = useChatStore((state) => state.displayMessages);
  const setActiveArtifactIndex = useChatStore((state) => state.setActiveArtifactIndex);
  const isThinking = useChatStore((state) => state.isThinking);
  const isErrorState = useChatStore((state) => state.isErrorState);
  const setIsErrorState = useChatStore((state) => state.setIsErrorState);
  const activeChainOfThought = useChatStore((state) => state.activeChainOfThought);

  console.log('displayMessages', { displayMessages });

  return (
    <VStack
      flex={1}
      overflowY='auto'
      spacing={4}
      p={3}
      align='stretch'
      bg='surface.containerLow'
      height='100%'
      width='100%'
      // pb={isMobile ? 100 : 3}
      pb='0'
      style={{ scrollbarWidth: 'none' }}
      maxWidth='720px'
    >
      {!isThinking && displayMessages && !displayMessages.length && customSplashScreen}
      {displayMessages?.map((message, index) => {
        if (typeof message === 'string') message = JSON.parse(message);
        const content = message?.value;
        if (!content) return null;
        const isLastMessage = index === displayMessages.length - 1;
        return (
          <Box key={uniqueId(message?.role)}>
            {message?.role === 'user' ? (
              <Box
                bg='surface.containerHigh'
                p={3}
                borderRadius='lg'
                maxW='90%'
                ml='auto'
                mr={0}
                ref={index === displayMessages.length - 2 ? scrollerRef : null}
              >
                <MessageContent content={content} />
              </Box>
            ) : (
              <Stack>
                <ForaBadge />
                {message?.artifact && (
                  <HStack
                    bg='white'
                    p={4}
                    borderRadius='lg'
                    boxShadow='sm'
                    maxW='100%'
                    justify='flex-start'
                    cursor='pointer'
                    onClick={() => {
                      const artifactIndex = conversation?.artifacts?.findIndex(
                        (a) => a.messageIndex === index
                      );
                      setActiveArtifactIndex(artifactIndex);
                      if (!isMobile) {
                        showFullscreenChat();
                      } else {
                        setIsArtifactView(true);
                      }
                    }}
                  >
                    <SFBookPagesOutlinedIcon
                      w={8}
                      h={8}
                      color='brandPrimary.primary'
                    />
                    <VStack
                      align='flex-start'
                      spacing={0}
                      px={4}
                    >
                      <Text
                        as='span'
                        fontWeight='500'
                      >
                        {message?.artifact?.title || 'Untitled Content'}
                      </Text>
                      <Text
                        as='span'
                        fontWeight='300'
                      >
                        Tap to Open
                      </Text>
                    </VStack>
                  </HStack>
                )}
                <Box
                  bgColor='neutral.onPrimary'
                  p={4}
                  borderRadius='lg'
                  boxShadow='sm'
                  maxW='100%'
                >
                  <MessageContent
                    content={content}
                    animateText
                  />
                  <HStack spacing={2}>
                    {isLastMessage && !isThinking && activeChainOfThought?.length > 0 && (
                      <Button
                        size='xs'
                        colorScheme='neutral'
                        variant='ghost'
                        leftIcon={showThinking ? <CloseIcon /> : <SFBrainHeadProfile boxSize={4} />}
                        onClick={() => setShowThinking(!showThinking)}
                      >
                        <Text variant='body-sm'>{showThinking ? 'Hide' : 'Show'} thinking</Text>
                      </Button>
                    )}
                    <Spacer />
                    <IconButton
                      icon={<CopyIcon />}
                      variant='ghost'
                      size='sm'
                      aria-label='Copy'
                      color='surface.onSurfaceVariant'
                      onClick={() => copyToClipboard(content)}
                      hidden={!!message?.hideCopyButton}
                    />
                  </HStack>
                  <Collapse in={showThinking && isLastMessage}>
                    <ActiveChainOfThoughtDisplay />
                  </Collapse>
                </Box>
              </Stack>
            )}
          </Box>
        );
      })}
      {isErrorState && (
        <Box
          bg='white'
          p={4}
          borderRadius='lg'
          borderColor='critical.primary'
          boxShadow='sm'
          maxW='100%'
        >
          <MessageContent content='I seem to have encountered an error. Please try again.' />
          <button onClick={() => setIsErrorState(false)}>dismiss</button>
        </Box>
      )}
      {isThinking && <ThinkingMessage />}
    </VStack>
  );
};

export default ChatContent;
