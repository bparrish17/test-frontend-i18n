import { Box, Portal } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useUserStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store.jsx';
import { EarningsCallChatProvider } from '@store/chat/earnings-call-chat.store';
import FullscreenChatView from '@components/chat/chat-fullscreen.component';
import CollapsedView from '@components/chat/chat-collapsed-views.component';
import FloatingChatView from '@components/chat/chat-floating.component';
import { usePusherChannel, usePusherEvent } from '@util/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useEarningsCallConversation } from '@util/hooks/chat.hooks';

const expansionStateMap = {
  collapsed: CollapsedView,
  floating: FloatingChatView,
  fullscreen: FullscreenChatView
};

const EarningsCallChatWrapped = () => {
  const user = useUserStore((state) => state.user);
  const expansionState = useChatStore((state) => state.expansionState);
  const showFullscreenChat = useChatStore((state) => state.showFullscreenChat);
  const setInputRef = useChatStore((state) => state.setInputRef);
  const setShowReasoningPanel = useChatStore((state) => state.setShowReasoningPanel);
  const setIsThinking = useChatStore((state) => state.setIsThinking);
  const appendThoughtToChain = useChatStore((state) => state.appendThoughtToChain);
  const queryClient = useQueryClient();
  const bot = useChatStore((state) => state.initiatorData);

  const ActiveChatView = expansionStateMap[expansionState] || CollapsedView;

  // retrieves and / or configures the earnings call conversation object
  // this hook will also update the conversation in the store
  useEarningsCallConversation({ bot });

  const { channel } = usePusherChannel(user?.id);
  usePusherEvent(channel, 'earnings-call-chat-CoT', (data) => {
    if (data.botId === bot.id) {
      appendThoughtToChain(data.thoughtData);
      showFullscreenChat();
      setShowReasoningPanel(true);
    }
    queryClient.invalidateQueries({ queryKey: ['conversations', 'type-earnings-call', bot?.id] });
  });

  usePusherEvent(channel, 'refetch-conversation', () => {
    queryClient.invalidateQueries({ queryKey: ['conversations', 'type-earnings-call', bot?.id] });
    setIsThinking(false);
  });

  const ref = useRef();
  useEffect(() => {
    setInputRef(ref);
  }, []);

  return (
    <Box
      position='fixed'
      right={0}
      bottom={0}
      zIndex='modal'
      pointerEvents='none'
    >
      <Box pointerEvents='auto'>
        <ActiveChatView meeting={bot} />
      </Box>
    </Box>
  );
};

const EarningsCallChat = ({ bot }) => (
  <Portal>
    <EarningsCallChatProvider
      initiatorData={{
        ...bot,
        title: `Q${bot?.earnings_call?.quarter} ${bot?.earnings_call?.year} ${bot?.earnings_call?.company_name} Earnings Call`
      }}
    >
      <EarningsCallChatWrapped />
    </EarningsCallChatProvider>
  </Portal>
);

export default EarningsCallChat;
