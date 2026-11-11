import { useUserStore } from '@store/app.store';
import { setConversationArchived } from '@services/query-services/conversations.query-service';
import { sendChatMessage } from '@services/query-services/lambda.query-service';
import { rollbar } from '@util/helpers';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers';
import RecallService from '@services/recall.service';
const recallService = RecallService.getInstance();
/**
 * Creates the base state and actions for chat stores.
 * This function contains common functionality shared across different chat implementations.
 * @param {Function} set - Zustand's set function to update the store state.
 * @param {Function} get - Zustand's get function to access the current store state.
 * @param {object} options - Configuration options for the base store.
 * @param {string} options.chatType - The type of chat (e.g., 'meeting-chat', 'earnings-call-chat', 'custom-summary-chat').
 * @param {string} options.trackingEvent - The name of the Pendo tracking event.
 * @param {string} options.errorTitle - The title to use for error reporting.
 * @param {string} options.queryKey - The React Query key to invalidate.
 * @param {object} options.sourceData - Initial source data to bootstrap the chat store.
 * @param {string} options.sourceType - Type of the source data (e.g., 'Meeting', 'Earnings_Call').
 * @returns {object} An object containing the base state and actions for chat stores.
 */
export const createBaseStoreFunction = (set, get, options) => ({
  conversation: null,
  isThinking: false,
  isErrorState: false,
  inputRef: null,
  expansionState: options.expansionState || 'collapsed',
  reasoningPanelTouched: false,
  inputValue: '',
  displayMessages: [],
  artifactIndexMap: {},
  activeArtifactIndex: null,
  activeChainOfThought: [],
  showReasoningPanel: false,
  closeFn: options.closeFn || null,

  initiatorData: bootstrapInitiatorData(options.initiatorData) || null,
  initiatorType: options.initiatorType || null,
  setInitiatorData: (initiatorData) => set({ initiatorData }),
  setInitiatorType: (initiatorType) => set({ initiatorType }),

  title: null,
  setTitle: (title) => set({ title }),
  isTitleFormDirty: false,
  setIsTitleFormDirty: (isTitleFormDirty) => set({ isTitleFormDirty }),

  setShowReasoningPanel: (showReasoningPanel) => set({ showReasoningPanel }),

  setConversation: (conversation) => {
    let artifactIndexCounter = 0;
    conversation.messages = conversation?.messages?.map((m, index) => {
      if (m.artifact) {
        m.artifact.messageIndex = index;
        if (conversation.artifacts?.[artifactIndexCounter]) {
          conversation.artifacts[artifactIndexCounter].messageIndex = index;
          artifactIndexCounter++;
        }
      }
      return m;
    });
    set({ conversation });
    if (conversation.title && conversation.title !== 'Untitled Conversation') {
      set({ title: conversation.title });
    }
  },

  setInputRef: (ref) => set({ inputRef: ref }),
  setInputValue: (inputValue) => set({ inputValue }),
  setIsThinking: (isThinking) => set({ isThinking }),
  setIsErrorState: (isErrorState) => set({ isErrorState }),
  setDisplayMessages: (displayMessages) => set({ displayMessages }),

  setActiveArtifactIndex: (activeArtifactIndex) => {
    set({ activeArtifactIndex });
  },

  setActiveChainOfThought: (activeChainOfThought) => {
    set({ activeChainOfThought });
  },

  appendThoughtToChain: (thought) => {
    const { activeChainOfThought } = get();
    set({ activeChainOfThought: [...activeChainOfThought, thought] });
  },

  setReasoningPanelTouched: (reasoningPanelTouched) => set({ reasoningPanelTouched }),

  send: async (messageObj, queryClient) => {
    const user = useUserStore.getState().user;

    set({ isThinking: true, activeChainOfThought: [] });
    const { conversation, setIsErrorState, setIsThinking, title, setTitle, isTitleFormDirty } =
      get();
    try {
      const messageObject = {
        conversationId: conversation?.id,
        incomingChatMessage: messageObj
      };
      const sourcesCheck = conversation?.messages?.filter((m) => !!m.sources && !!m.sources.length);
      if (!sourcesCheck?.length && conversation?.sources?.length) {
        messageObject.sources = conversation.sources;
        messageObject.incomingChatMessage = {
          ...messageObject.incomingChatMessage,
          sources: conversation.sources
        };
      }

      let assistantResponse = await sendChatMessage(options.chatType, messageObject);

      if (window?.pendo) {
        window?.pendo?.track(options.trackingEvent, {
          userId: user?.id,
          num_messages: conversation?.messages?.length
        });
      }

      if (typeof assistantResponse === 'string') {
        assistantResponse = JSON.parse(assistantResponse);
      }

      if (!assistantResponse?.role) {
        assistantResponse.role = 'assistant';
      }

      queryClient.invalidateQueries({
        queryKey: ['conversations', options.queryKey]
      });

      if (get().inputRef) {
        get().inputRef.current?.focus();
      }

      if (assistantResponse.reason) {
        rollbar?.error(formatRollbarTitle('Manual', options.errorTitle), assistantResponse.reason, {
          sources: conversation?.sources
        });
        setIsErrorState(true);
      }
      setIsThinking(false);

      if (!title && !isTitleFormDirty) {
        if (assistantResponse.artifact) {
          get().setTitle(assistantResponse.artifact.title);
        } else {
          const generatedTitle = await recallService.generateTitle(
            [messageObj, assistantResponse].map((m) => JSON.stringify(m))
          );
          setTitle(generatedTitle);
        }
      }

      return assistantResponse;
    } catch (e) {
      // Network Errors are common due to browser-based timeouts while waiting for an LLM response,
      // the Pusher events handle this case appropriately, so we can ignore these errors.s
      if (e.message !== 'Network Error') {
        rollbar?.error(formatRollbarTitle('Manual', options.errorTitle), e);
        setIsThinking(false);
        setIsErrorState(true);
        return {
          role: 'assistant',
          content:
            "I'm sorry, something does not compute on my end. I seem to have encountered an error. Please try again."
        };
      }
    }
  },

  clearChat: async (toast) => {
    const { conversation, setConversation, setActiveChainOfThought } = get();
    const originalSources = conversation?.messages[0]?.sources;
    await setConversationArchived(conversation.id, true);
    setConversation({
      messages: [],
      sources: [...originalSources]
    });
    setActiveChainOfThought([]);
    if (toast) {
      toast({
        title: 'Chat Cleared!',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    }
  },

  setExpansionState: (state) => set({ expansionState: state }),
  showFullscreenChat: () => set({ expansionState: 'fullscreen' }),
  showFloatingChat: () => set({ expansionState: 'floating' }),
  showCollapsedChat: () => set({ expansionState: 'collapsed' }),
  getFormattingInstructions: (content, isArtifact) => {
    if (isArtifact) {
      return `Please generate a response that roughly aligns with the following content format: ${content}`;
    }
    return `Please generate a response based on the following content: ${content}`;
  }
});

function bootstrapInitiatorData(initiatorData) {
  if (Array.isArray(initiatorData)) {
    return initiatorData.reduce((result, item) => {
      const addition = {
        [item.type.toLowerCase()]: item
      };
      return Object.assign(result, addition);
    }, {});
  } else return initiatorData;
}
