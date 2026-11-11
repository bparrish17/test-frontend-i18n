import React, { useEffect, useRef } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import ChatHeader from './chat-header.component';
import ChatContent from './chat-content.component';
import ChatInputSection from './chat-input.component';
import { useChatStore } from '@store/chat/chat.store.jsx';
import ArtifactContent from './chat-artifact-content.component';
import { useQueryClient } from '@tanstack/react-query';

const FullscreenChatView = ({ initialSourceData }) => {
  const conversation = useChatStore((state) => state.conversation);
  const inputRef = useChatStore((state) => state.inputRef);
  const send = useChatStore((state) => state.send);
  const isThinking = useChatStore((state) => state.isThinking);
  const inputValue = useChatStore((state) => state.inputValue);
  const setInputValue = useChatStore((state) => state.setInputValue);
  const displayMessages = useChatStore((state) => state.displayMessages);
  const setDisplayMessages = useChatStore((state) => state.setDisplayMessages);
  const queryClient = useQueryClient();

  const scrollerRef = useRef(null);

  useEffect(() => {
    if (conversation && setDisplayMessages) {
      if (!isThinking) {
        setDisplayMessages(conversation.messages);
      }
    } else {
      setDisplayMessages([]);
    }
  }, [conversation, isThinking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      value: inputValue.trim()
    };

    setDisplayMessages([...displayMessages, userMessage]);

    setInputValue('');

    if (!conversation.id) {
      userMessage.sources = initialSourceData;
    }

    setTimeout(() => {
      scrollerRef?.current?.scrollIntoView();
    }, 250);
    await send(userMessage, queryClient);
    setTimeout(() => {
      scrollerRef?.current?.scrollIntoView();
    }, 500);
  };

  return (
    <VStack
      zIndex='modal'
      position='fixed'
      gap={0}
      left={0}
      top={0}
      h='100vh'
      w='100vw'
    >
      <ChatHeader />
      <Flex
        bg='surface.containerLow'
        direction='row'
        w='100%'
        h='100%'
        justify='center'
        px={{ md: 16, lg: 24, xl: 32 }}
      >
        {/* Left Side - Chat Interface */}
        <Box maxW='720px'>
          <Flex
            flexDirection='column'
            h='100%'
            maxHeight='90vh'
          >
            {/* Chat Messages Area */}
            <VStack
              flex='1'
              spacing={4}
              p={4}
              overflowY='auto'
            >
              <ChatContent scrollerRef={scrollerRef} />
            </VStack>

            {/* Input Area */}
            <Box
              px={4}
              py={0}
            >
              {/* <ChatActionButtons /> */}
              <ChatInputSection
                handleSubmit={handleSubmit}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isThinking={isThinking}
                inputRef={inputRef}
              />
            </Box>
          </Flex>
        </Box>

        {/* Right Side - Artifact Viewer */}
        {conversation?.artifacts?.length ? <ArtifactContent /> : ''}
      </Flex>
    </VStack>
  );
};

export default FullscreenChatView;
