import React, { useEffect, useRef, useState } from 'react';
import { Box, Flex, SlideFade, Button } from '@chakra-ui/react';
import { useBreakpoints } from '@util/hooks';
import ChatHeader from './chat-header.component';
import ChatContent from './chat-content.component';
import ChatInputSection from './chat-input.component';
import { useChatStore } from '@store/chat/chat.store.jsx';
import ArtifactContent from './chat-artifact-content.component';
import { useQueryClient } from '@tanstack/react-query';

const FloatingChatView = () => {
  const { isMobile } = useBreakpoints();

  const conversation = useChatStore((state) => state.conversation);
  const inputRef = useChatStore((state) => state.inputRef);
  const send = useChatStore((state) => state.send);
  const isThinking = useChatStore((state) => state.isThinking);
  const inputValue = useChatStore((state) => state.inputValue);
  const setInputValue = useChatStore((state) => state.setInputValue);
  const displayMessages = useChatStore((state) => state.displayMessages);
  const setDisplayMessages = useChatStore((state) => state.setDisplayMessages);
  const showFullscreenChat = useChatStore((state) => state.showFullscreenChat);
  const queryClient = useQueryClient();
  const meeting = useChatStore((state) => state.initiatorData);

  useEffect(() => {
    if (conversation && setDisplayMessages) {
      if (!isThinking) {
        setDisplayMessages(conversation.messages);
      }
    } else {
      setDisplayMessages([]);
    }
  }, [conversation, isThinking]);

  const scrollerRef = useRef(null);

  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      value: inputValue.trim()
    };

    setDisplayMessages([
      ...displayMessages,
      userMessage
      // {
      //   role: 'assistant',
      //   value: 'Thinking...',
      //   hideCopyButton: true
      // }
    ]);

    setInputValue('');

    if (!conversation?.id) {
      userMessage.sources = [{ id: meeting.id, title: meeting.title, type: 'Meeting' }];
    }

    setTimeout(() => {
      scrollerRef?.current?.scrollIntoView?.();
    }, 250);
    const responseMessage = await send(userMessage, queryClient);
    if (!isMobile && responseMessage?.artifact) {
      showFullscreenChat();
    }
    setTimeout(() => {
      scrollerRef?.current?.scrollIntoView?.();
    }, 500);
  };

  const [isArtifactView, setIsArtifactView] = useState(false);

  if (isMobile) {
    return (
      <Box
        position='fixed'
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg='white'
        zIndex='modal'
        display='flex'
        flexDirection='column'
      >
        {/* Header */}
        <ChatHeader
          meeting={meeting}
          isArtifactView={isArtifactView}
          setIsArtifactView={setIsArtifactView}
        />

        {/* Messages Container */}
        {isArtifactView ? (
          <ArtifactContent />
        ) : (
          <ChatContent
            isThinking={isThinking}
            scrollerRef={scrollerRef}
            setIsArtifactView={setIsArtifactView}
          />
        )}

        {isArtifactView && isMobile ? (
          ''
        ) : (
          <Box
            position='absolute'
            bottom={0}
            left={0}
            right={0}
            py={conversation?.messages?.length ? 4 : 0}
            bg='surface.containerLow'
            borderTop='1px'
            borderColor='surface.outline'
          >
            <ChatActionButtons
              isArtifactView={isArtifactView}
              setIsArtifactView={setIsArtifactView}
            />
            {/* Input Area */}
            <ChatInputSection
              handleSubmit={handleSubmit}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isThinking={isThinking}
              inputRef={inputRef}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      position='fixed'
      right={4}
      bottom={0}
      zIndex='modal'
    >
      <SlideFade
        in
        offsetY='20px'
      >
        <Box
          w='450px'
          h='85vh'
          bg='surface.containerLow'
          borderRadius='lg'
          boxShadow='xl'
          display='flex'
          flexDirection='column'
          overflow='hidden'
        >
          {/* Header */}
          <ChatHeader />

          {/* Messages Container */}
          <ChatContent scrollerRef={scrollerRef} />

          {/* Clear Chat Button */}
          <ChatActionButtons />
          {/* Input Area */}
          <ChatInputSection
            handleSubmit={handleSubmit}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isThinking={isThinking}
            inputRef={inputRef}
          />
        </Box>
      </SlideFade>
    </Box>
  );
};

export const ChatActionButtons = ({ isArtifactView, setIsArtifactView }) => {
  const { conversation } = useChatStore();
  const { isMobile } = useBreakpoints();

  if (!conversation?.messages?.length) {
    return null;
  }

  return (
    <Flex
      width='100%'
      justifyContent='space-around'
    >
      {isMobile && isArtifactView ? (
        <Button
          size='sm'
          variant='reskinWhite'
          mt={isMobile ? 0 : 4}
          mb={4}
          onClick={() => setIsArtifactView(false)}
          p={4}
        >
          Back to Chat
        </Button>
      ) : (
        ''
      )}
      {/* {isArtifactView ? (
        ''
      ) : (
        <Button
          size="sm"
          variant="reskinWhite"
          mt={isMobile ? 0 : 4}
          mb={4}
          onClick={() => clearChat(toast)}
        >
          Clear Chat
        </Button>
      )} */}
    </Flex>
  );
};

export default FloatingChatView;
