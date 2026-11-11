import { Box, Portal } from '@chakra-ui/react';
import { useEffect } from 'react';
import { CustomSummaryChatProvider } from '@store/chat/custom-summary-chat.store.jsx';
import FullscreenChatView from '@components/chat/chat-fullscreen.component';
import { useChatStore } from '@store/chat/chat.store';
import { find } from 'lodash-es';
import { useCustomSummaryConversation } from '@util/hooks/chat.hooks';

const CustomSummaryChatWrapped = ({ initialSourceData }) => {
  const setConversation = useChatStore((state) => state.setConversation);
  const setActiveArtifactIndex = useChatStore((state) => state.setActiveArtifactIndex);
  const setTitle = useChatStore((state) => state.setTitle);
  const isTitleFormDirty = useChatStore((state) => state.isTitleFormDirty);

  const meeting = find(initialSourceData, { type: 'Meeting' });
  const card = find(initialSourceData, { type: 'Card' });

  // this hook retrieves and/or configures the custom summary conversation object
  // it will also update the conversation in the store
  const conversation = useCustomSummaryConversation({ initialSourceData });

  useEffect(() => {
    if (!conversation) {
      const initialArtifact = {
        type: 'text/markdown',
        content: cardToMarkdown(card),
        title: `Original Summary of ${meeting?.title}`
      };
      const initialMessage = {
        role: 'assistant',
        value:
          "Chat with me to create a custom template for this meeting and similar ones. I'll generate a summary for this meeting based on your input, and we can revise it together.\nConsider including:\n- **Sections** (e.g., Goals, Action Items, Next Steps).\n- **Details** (e.g., stakeholders, deadlines, risks).\n- **Focus areas** (e.g., blockers, missing roles, follow-ups).\nAdd as much or as little as you want—it's entirely up to you.",
        artifact: initialArtifact
      };
      const newConversation = {
        messages: [initialMessage],
        artifacts: [initialArtifact],
        sources: initialSourceData,
        tags: ['type-custom-summary'],
        title: initialArtifact.title
      };
      setConversation(newConversation);
      setTitle(initialArtifact.title);
      setActiveArtifactIndex(
        newConversation && newConversation.artifacts?.length
          ? newConversation.artifacts.length - 1
          : null
      );
    } else {
      setConversation(conversation);
      setActiveArtifactIndex(
        conversation && conversation.artifacts?.length ? conversation.artifacts.length - 1 : null
      );
      if (conversation.artifacts.length && !isTitleFormDirty) {
        setTitle(conversation.artifacts[conversation.artifacts.length - 1].title);
      }
    }
  }, [conversation]);

  return (
    <Box
      position='fixed'
      right={0}
      bottom={0}
      zIndex='modal'
      pointerEvents='none'
    >
      <Box pointerEvents='auto'>
        <FullscreenChatView />
      </Box>
    </Box>
  );
};

const CustomSummaryChat = ({ initialSourceData, setShowCustomSummaryChat }) => {
  const closeFn = () => {
    setShowCustomSummaryChat(false);
  };

  return (
    <Portal>
      <CustomSummaryChatProvider
        initiatorData={initialSourceData}
        closeFn={closeFn}
      >
        <CustomSummaryChatWrapped initialSourceData={initialSourceData} />
      </CustomSummaryChatProvider>
    </Portal>
  );
};

export default CustomSummaryChat;

function cardToMarkdown(card) {
  if (!card) return '';
  return (
    '## ' +
    card.headline +
    '\n\n' +
    card.sections
      .map(
        (section) => `**${section.title}**` + `\n\n${section.content.split('*').join('\n-')}\n\n`
      )
      .join('\n')
  );
}
