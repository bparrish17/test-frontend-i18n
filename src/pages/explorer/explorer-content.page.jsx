import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Flex } from '@chakra-ui/react';
import { useChatStore } from '../../store/chat/chat.store';
import { useUserStore } from '../../store/app.store';
import { usePusherChannel, usePusherEvent } from '../../util/hooks';
import CardExplorerChat from '../../components/explorer/explorer-chat.component';

export function CardExplorerPageContent({ conversation }) {
  const { conversationId } = useParams();
  const setConversation = useChatStore((state) => state.setConversation);
  const setDisplayMessages = useChatStore((state) => state.setDisplayMessages);
  const setActiveArtifactIndex = useChatStore((state) => state.setActiveArtifactIndex);
  const appendThoughtToChain = useChatStore((state) => state.appendThoughtToChain);
  const setShowReasoningPanel = useChatStore((state) => state.setShowReasoningPanel);
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state?.user);

  const { channel } = usePusherChannel(user?.id);
  usePusherEvent(channel, 'card-explorer-chat-CoT', (data) => {
    console.log('card-explorer-chat-CoT', { data });
    if (data.thoughtData) {
      appendThoughtToChain(data.thoughtData);
      setShowReasoningPanel(true);
    }

    if (data.conversationId === conversationId) {
      queryClient.invalidateQueries({
        queryKey: ['conversations', { id: data.conversationId }]
      });
    }
  });

  // Update the chat store when conversation changes
  useEffect(() => {
    if (conversation) {
      setConversation(conversation);
      setDisplayMessages(conversation?.messages || []);
      if (conversation?.artifacts?.length) {
        setActiveArtifactIndex(conversation.artifacts.length - 1);
      }
    }
  }, [conversation]);

  return (
    <Flex
      direction='column'
      height='90vh'
      maxHeight='90vh'
      overflow='hidden'
    >
      <Box
        flex={1}
        overflow='hidden'
        padding='5px'
      >
        <CardExplorerChat />
      </Box>
    </Flex>
  );
}

export default CardExplorerPageContent;
