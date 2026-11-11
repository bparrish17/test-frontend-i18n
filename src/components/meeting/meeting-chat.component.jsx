import { Box, Portal } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useUserStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store.jsx';
import { MeetingChatProvider } from '@store/chat/meeting-chat.store.jsx';
import FullscreenChatView from '../chat/chat-fullscreen.component';
import CollapsedView from '../chat/chat-collapsed-views.component';
import FloatingChatView from '../chat/chat-floating.component';
import { usePusherChannel, usePusherEvent } from '@util/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useMeetingChatConversation } from '@util/hooks/chat.hooks';

const expansionStateMap = {
  collapsed: CollapsedView,
  floating: FloatingChatView,
  fullscreen: FullscreenChatView
};

const MeetingChatWrapped = () => {
  const user = useUserStore((state) => state.user);
  const expansionState = useChatStore((state) => state.expansionState);
  // const showFullscreenChat = useChatStore((state) => state.showFullscreenChat);
  const setInputRef = useChatStore((state) => state.setInputRef);
  const setShowReasoningPanel = useChatStore((state) => state.setShowReasoningPanel);
  const setIsThinking = useChatStore((state) => state.setIsThinking);
  const appendThoughtToChain = useChatStore((state) => state.appendThoughtToChain);
  const queryClient = useQueryClient();
  const meeting = useChatStore((state) => state.initiatorData);

  const ActiveChatView = expansionStateMap[expansionState] || CollapsedView;

  // retrieves and / or configures the meeting chat conversation object
  // this hook will also update the conversation in the store
  useMeetingChatConversation({ meeting });

  const { channel } = usePusherChannel(user?.id);
  usePusherEvent(channel, 'meeting-chat-CoT', (data) => {
    if (data.meetingId === meeting.id) {
      appendThoughtToChain(data.thoughtData);
      setShowReasoningPanel(true);
    }
    queryClient.invalidateQueries({ queryKey: ['conversations', 'type-vanilla', meeting?.id] });
  });

  usePusherEvent(channel, 'refetch-conversation', () => {
    queryClient.invalidateQueries({ queryKey: ['conversations', 'type-vanilla', meeting?.id] });
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
        <ActiveChatView />
      </Box>
    </Box>
  );
};

const MeetingChat = ({ meeting }) => (
  <Portal>
    <MeetingChatProvider initiatorData={meeting}>
      <MeetingChatWrapped />
    </MeetingChatProvider>
  </Portal>
);

export default MeetingChat;
