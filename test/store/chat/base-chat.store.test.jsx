import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createBaseStoreFunction } from '@store/chat/base-chat.store';
import { useUserStore } from '@store/app.store';
import { setConversationArchived } from '@services/query-services/conversations.query-service';
import { sendChatMessage } from '@services/query-services/lambda.query-service';
import { rollbar } from '@util/helpers';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers';
import RecallService from '@services/recall.service';

// Mock external dependencies
vi.mock('@store/app.store', () => ({
  useUserStore: {
    getState: vi.fn()
  }
}));

vi.mock('@services/query-services/conversations.query-service', () => ({
  setConversationArchived: vi.fn()
}));

vi.mock('@services/query-services/lambda.query-service', () => ({
  sendChatMessage: vi.fn()
}));

vi.mock('@util/helpers', () => ({
  rollbar: {
    error: vi.fn()
  }
}));

vi.mock('@util/helpers/error-boundary.helpers', () => ({
  formatRollbarTitle: vi.fn()
}));

vi.mock('@services/recall.service', () => {
  const mockInstance = {
    generateTitle: vi.fn()
  };

  return {
    default: {
      getInstance: vi.fn(() => mockInstance)
    }
  };
});

describe('Base Chat Store', () => {
  const mockUser = { id: 'user123' };
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };

  const defaultOptions = {
    chatType: 'test-chat',
    trackingEvent: 'test-event',
    errorTitle: 'Test Error',
    queryKey: 'test-query',
    sourceData: null,
    sourceType: 'Test',
    expansionState: 'collapsed',
    closeFn: vi.fn(),
    initiatorData: null,
    initiatorType: null
  };

  let mockSet, mockGet, store;

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.getState.mockReturnValue({ user: mockUser });

    // Create mock zustand functions
    mockSet = vi.fn();
    mockGet = vi.fn();

    // Create store instance
    store = createBaseStoreFunction(mockSet, mockGet, defaultOptions);

    // Mock get to return current store state
    mockGet.mockReturnValue(store);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store).toEqual(
        expect.objectContaining({
          conversation: null,
          isThinking: false,
          isErrorState: false,
          inputRef: null,
          expansionState: 'collapsed',
          reasoningPanelTouched: false,
          inputValue: '',
          displayMessages: [],
          artifactIndexMap: {},
          activeArtifactIndex: null,
          activeChainOfThought: [],
          showReasoningPanel: false,
          initiatorData: null,
          initiatorType: null,
          title: null,
          isTitleFormDirty: false
        })
      );
    });

    it('should initialize with custom options', () => {
      const customOptions = {
        ...defaultOptions,
        expansionState: 'fullscreen',
        closeFn: vi.fn(),
        initiatorData: { test: 'data' },
        initiatorType: 'Meeting'
      };

      const customStore = createBaseStoreFunction(mockSet, mockGet, customOptions);

      expect(customStore.expansionState).toBe('fullscreen');
      expect(customStore.closeFn).toBe(customOptions.closeFn);
      expect(customStore.initiatorData).toEqual({ test: 'data' });
      expect(customStore.initiatorType).toBe('Meeting');
    });
  });

  describe('State Setters', () => {
    it('should set initiator data', () => {
      const testData = { id: 'test', type: 'Meeting' };
      store.setInitiatorData(testData);
      expect(mockSet).toHaveBeenCalledWith({ initiatorData: testData });
    });

    it('should set initiator type', () => {
      store.setInitiatorType('Earnings_Call');
      expect(mockSet).toHaveBeenCalledWith({ initiatorType: 'Earnings_Call' });
    });

    it('should set title', () => {
      store.setTitle('Test Title');
      expect(mockSet).toHaveBeenCalledWith({ title: 'Test Title' });
    });

    it('should set title form dirty state', () => {
      store.setIsTitleFormDirty(true);
      expect(mockSet).toHaveBeenCalledWith({ isTitleFormDirty: true });
    });

    it('should set reasoning panel visibility', () => {
      store.setShowReasoningPanel(true);
      expect(mockSet).toHaveBeenCalledWith({ showReasoningPanel: true });
    });

    it('should set input reference', () => {
      const mockRef = { current: null };
      store.setInputRef(mockRef);
      expect(mockSet).toHaveBeenCalledWith({ inputRef: mockRef });
    });

    it('should set input value', () => {
      store.setInputValue('test input');
      expect(mockSet).toHaveBeenCalledWith({ inputValue: 'test input' });
    });

    it('should set thinking state', () => {
      store.setIsThinking(true);
      expect(mockSet).toHaveBeenCalledWith({ isThinking: true });
    });

    it('should set error state', () => {
      store.setIsErrorState(true);
      expect(mockSet).toHaveBeenCalledWith({ isErrorState: true });
    });

    it('should set display messages', () => {
      const messages = [{ id: 1, content: 'test' }];
      store.setDisplayMessages(messages);
      expect(mockSet).toHaveBeenCalledWith({ displayMessages: messages });
    });

    it('should set active artifact index', () => {
      store.setActiveArtifactIndex(2);
      expect(mockSet).toHaveBeenCalledWith({ activeArtifactIndex: 2 });
    });

    it('should set active chain of thought', () => {
      const thoughts = ['thought1', 'thought2'];
      store.setActiveChainOfThought(thoughts);
      expect(mockSet).toHaveBeenCalledWith({ activeChainOfThought: thoughts });
    });

    it('should set reasoning panel touched state', () => {
      store.setReasoningPanelTouched(true);
      expect(mockSet).toHaveBeenCalledWith({ reasoningPanelTouched: true });
    });
  });

  describe('Conversation Management', () => {
    it('should set conversation with artifact message indices', () => {
      const conversation = {
        messages: [
          { content: 'msg1' },
          { content: 'msg2', artifact: { id: 'art1' } },
          { content: 'msg3' },
          { content: 'msg4', artifact: { id: 'art2' } }
        ],
        artifacts: [{ id: 'art1' }, { id: 'art2' }],
        title: 'Test Conversation'
      };

      store.setConversation(conversation);

      // Check that artifact indices were set correctly
      expect(conversation.messages[1].artifact.messageIndex).toBe(1);
      expect(conversation.messages[3].artifact.messageIndex).toBe(3);
      expect(conversation.artifacts[0].messageIndex).toBe(1);
      expect(conversation.artifacts[1].messageIndex).toBe(3);

      expect(mockSet).toHaveBeenCalledWith({ conversation });
      expect(mockSet).toHaveBeenCalledWith({ title: 'Test Conversation' });
    });

    it('should not set title if conversation title is "Untitled Conversation"', () => {
      const conversation = {
        messages: [],
        title: 'Untitled Conversation'
      };

      store.setConversation(conversation);

      expect(mockSet).toHaveBeenCalledWith({ conversation });
      expect(mockSet).not.toHaveBeenCalledWith({ title: 'Untitled Conversation' });
    });

    it('should handle conversation without artifacts', () => {
      const conversation = {
        messages: [{ content: 'msg1' }, { content: 'msg2' }]
      };

      store.setConversation(conversation);

      expect(mockSet).toHaveBeenCalledWith({ conversation });
    });
  });

  describe('Chain of Thought Management', () => {
    it('should append thought to chain', () => {
      const initialThoughts = ['thought1', 'thought2'];
      mockGet.mockReturnValue({
        ...store,
        activeChainOfThought: initialThoughts
      });

      store.appendThoughtToChain('thought3');

      expect(mockSet).toHaveBeenCalledWith({
        activeChainOfThought: ['thought1', 'thought2', 'thought3']
      });
    });
  });

  describe('Expansion State Management', () => {
    it('should set expansion state', () => {
      store.setExpansionState('floating');
      expect(mockSet).toHaveBeenCalledWith({ expansionState: 'floating' });
    });

    it('should show fullscreen chat', () => {
      store.showFullscreenChat();
      expect(mockSet).toHaveBeenCalledWith({ expansionState: 'fullscreen' });
    });

    it('should show floating chat', () => {
      store.showFloatingChat();
      expect(mockSet).toHaveBeenCalledWith({ expansionState: 'floating' });
    });

    it('should show collapsed chat', () => {
      store.showCollapsedChat();
      expect(mockSet).toHaveBeenCalledWith({ expansionState: 'collapsed' });
    });
  });

  describe('Send Message', () => {
    const mockConversation = {
      id: 'conv123',
      messages: [{ content: 'existing message', sources: [{ id: 'source1', type: 'Meeting' }] }],
      sources: [{ id: 'source1', type: 'Meeting' }]
    };

    beforeEach(() => {
      mockGet.mockReturnValue({
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      });
    });

    it('should send message successfully', async () => {
      const mockResponse = {
        role: 'assistant',
        content: 'Test response'
      };
      sendChatMessage.mockResolvedValue(mockResponse);

      const messageObj = { content: 'Test message', role: 'user' };
      const result = await store.send(messageObj, mockQueryClient);

      expect(mockSet).toHaveBeenCalledWith({
        isThinking: true,
        activeChainOfThought: []
      });

      expect(sendChatMessage).toHaveBeenCalled();

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['conversations', 'test-query']
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle string response by parsing JSON', async () => {
      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(JSON.stringify(mockResponse));

      const messageObj = { content: 'Test message', role: 'user' };
      const result = await store.send(messageObj, mockQueryClient);

      expect(result).toEqual(mockResponse);
    });

    it('should add role if missing from response', async () => {
      const mockResponse = { content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const messageObj = { content: 'Test message', role: 'user' };
      const result = await store.send(messageObj, mockQueryClient);

      expect(result.role).toBe('assistant');
    });

    it('should handle error response with reason', async () => {
      const mockResponse = {
        role: 'assistant',
        content: 'Error response',
        reason: 'Something went wrong'
      };
      sendChatMessage.mockResolvedValue(mockResponse);

      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      };
      mockGet.mockReturnValue(mockStoreState);

      const messageObj = { content: 'Test message', role: 'user' };
      await store.send(messageObj, mockQueryClient);

      expect(rollbar.error).toHaveBeenCalled();
      expect(mockStoreState.setIsErrorState).toHaveBeenCalledWith(true);
      expect(mockStoreState.setIsThinking).toHaveBeenCalledWith(false);
    });

    it('should generate title when none exists and form is not dirty', async () => {
      const mockResponse = { role: 'assistant', content: 'Test response' };
      const mockRecallService = RecallService.getInstance();
      mockRecallService.generateTitle.mockResolvedValue('Generated Title');
      sendChatMessage.mockResolvedValue(mockResponse);

      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      };
      mockGet.mockReturnValue(mockStoreState);

      const messageObj = { content: 'Test message', role: 'user' };
      await store.send(messageObj, mockQueryClient);

      expect(mockRecallService.generateTitle).toHaveBeenCalled();
      expect(mockStoreState.setTitle).toHaveBeenCalledWith('Generated Title');
    });

    it('should use artifact title when response contains artifact', async () => {
      const mockResponse = {
        role: 'assistant',
        content: 'Test response',
        artifact: { title: 'Artifact Title' }
      };
      sendChatMessage.mockResolvedValue(mockResponse);

      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      };
      mockGet.mockReturnValue(mockStoreState);

      const messageObj = { content: 'Test message', role: 'user' };
      await store.send(messageObj, mockQueryClient);

      expect(mockStoreState.setTitle).toHaveBeenCalledWith('Artifact Title');
    });

    it('should handle send message error', async () => {
      const error = new Error('Network error');
      sendChatMessage.mockRejectedValue(error);

      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      };
      mockGet.mockReturnValue(mockStoreState);

      const messageObj = { content: 'Test message', role: 'user' };
      const result = await store.send(messageObj, mockQueryClient);

      expect(rollbar.error).toHaveBeenCalledWith(formatRollbarTitle('Manual', 'Test Error'), error);
      expect(mockStoreState.setIsThinking).toHaveBeenCalledWith(false);
      expect(mockStoreState.setIsErrorState).toHaveBeenCalledWith(true);
      expect(result.content).toContain("I'm sorry, something does not compute");
    });

    it('should focus input after successful send', async () => {
      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const mockFocus = vi.fn();
      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: mockFocus } }
      };
      mockGet.mockReturnValue(mockStoreState);

      const messageObj = { content: 'Test message', role: 'user' };
      await store.send(messageObj, mockQueryClient);

      expect(mockFocus).toHaveBeenCalled();
    });
  });

  describe('Clear Chat', () => {
    it('should clear chat with toast', async () => {
      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message1', sources: [{ id: 'source1' }] }],
        sources: [{ id: 'source1' }]
      };

      const mockToast = vi.fn();
      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setConversation: vi.fn(),
        setActiveChainOfThought: vi.fn(),
        initiatorData: null
      };
      mockGet.mockReturnValue(mockStoreState);

      setConversationArchived.mockResolvedValue();

      await store.clearChat(mockToast);

      expect(setConversationArchived).toHaveBeenCalledWith('conv123', true);
      expect(mockStoreState.setConversation).toHaveBeenCalledWith({
        messages: [],
        sources: mockConversation.sources
      });
      expect(mockStoreState.setActiveChainOfThought).toHaveBeenCalledWith([]);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Chat Cleared!',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    });

    it('should clear chat without toast', async () => {
      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message1', sources: [{ id: 'source1' }] }],
        sources: [{ id: 'source1' }]
      };

      const mockStoreState = {
        ...store,
        conversation: mockConversation,
        setConversation: vi.fn(),
        setActiveChainOfThought: vi.fn(),
        initiatorData: null
      };
      mockGet.mockReturnValue(mockStoreState);

      setConversationArchived.mockResolvedValue();

      await store.clearChat();

      expect(setConversationArchived).toHaveBeenCalledWith('conv123', true);
      expect(mockStoreState.setConversation).toHaveBeenCalledWith({
        messages: [],
        sources: mockConversation.sources
      });
      expect(mockStoreState.setActiveChainOfThought).toHaveBeenCalledWith([]);
    });
  });

  describe('Formatting Instructions', () => {
    it('should return artifact formatting instructions', () => {
      const content = 'test content';
      const result = store.getFormattingInstructions(content, true);

      expect(result).toBe(
        'Please generate a response that roughly aligns with the following content format: test content'
      );
    });

    it('should return regular formatting instructions', () => {
      const content = 'test content';
      const result = store.getFormattingInstructions(content, false);

      expect(result).toBe(
        'Please generate a response based on the following content: test content'
      );
    });
  });

  describe('Message Sources Handling', () => {
    it('should add sources to message when conversation has sources but no messages with sources', async () => {
      const mockConversation = {
        id: 'conv123',
        messages: [
          { content: 'message without sources' },
          { content: 'another message without sources' }
        ],
        sources: [{ id: 'source1', type: 'Meeting' }]
      };

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      mockGet.mockReturnValue({
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      });

      const messageObj = { content: 'Test message', role: 'user' };
      await store.send(messageObj, mockQueryClient);

      expect(sendChatMessage).toHaveBeenCalledWith('test-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          ...messageObj,
          sources: mockConversation.sources
        },
        sources: mockConversation.sources
      });
    });

    it('should not add sources when messages already have sources', async () => {
      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message with sources', sources: [{ id: 'existing' }] }],
        sources: [{ id: 'source1', type: 'Meeting' }]
      };

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      mockGet.mockReturnValue({
        ...store,
        conversation: mockConversation,
        setIsErrorState: vi.fn(),
        setIsThinking: vi.fn(),
        title: null,
        setTitle: vi.fn(),
        isTitleFormDirty: false,
        inputRef: { current: { focus: vi.fn() } }
      });

      const messageObj = { content: 'Test message', role: 'user' };
      await store.send(messageObj, mockQueryClient);

      expect(sendChatMessage).toHaveBeenCalledWith('test-chat', {
        conversationId: 'conv123',
        incomingChatMessage: messageObj
      });
    });
  });
});
