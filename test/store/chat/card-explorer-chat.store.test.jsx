import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  CardExplorerChatProvider,
  createStoreFunction
} from '@store/chat/card-explorer-chat.store';
import { useUserStore } from '@store/app.store';
import { setConversationArchived } from '@services/query-services/conversations.query-service';
import { sendChatMessage } from '@services/query-services/lambda.query-service';
import { useChatStore } from '@store/chat/chat.store';

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

describe('Card Explorer Chat Store', () => {
  const mockUser = {
    id: 'user123',
    tenants: [{ id: 'tenant123' }]
  };
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };
  const mockCardExplorerData = {
    id: 'cardExplorer123',
    title: 'Test Card Explorer',
    type: 'card-explorer',
    data: { filters: { industry: 'tech' } }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.getState.mockReturnValue({ user: mockUser });
    sendChatMessage.mockResolvedValue({ role: 'assistant', content: 'Test response' });
  });

  describe('CardExplorerChatProvider', () => {
    it('should initialize with default values', () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current).toEqual(
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
          initiatorData: mockCardExplorerData,
          initiatorType: 'Global',
          title: null,
          isTitleFormDirty: false
        })
      );
    });

    it('should handle initiatorData correctly', () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toEqual(mockCardExplorerData);
      expect(result.current.initiatorType).toBe('Global');
    });

    it('should handle missing initiatorData', () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider>{children}</CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toBeNull();
      expect(result.current.initiatorType).toBe('Global');
    });

    it('should handle array initiatorData', () => {
      const arrayData = [
        { id: 'card1', type: 'card', title: 'Card 1' },
        { id: 'card2', type: 'card', title: 'Card 2' }
      ];

      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={arrayData}>{children}</CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toEqual({
        card: { id: 'card2', type: 'card', title: 'Card 2' }
      });
      expect(result.current.initiatorType).toBe('Global');
    });
  });

  describe('Basic State Management', () => {
    it('should manage expansion states', () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.showFullscreenChat();
      });

      expect(result.current.expansionState).toBe('fullscreen');

      act(() => {
        result.current.showFloatingChat();
      });

      expect(result.current.expansionState).toBe('floating');

      act(() => {
        result.current.showCollapsedChat();
      });

      expect(result.current.expansionState).toBe('collapsed');
    });

    it('should manage conversation state', () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'test message' }],
        title: 'Test Conversation'
      };

      act(() => {
        result.current.setConversation(mockConversation);
      });

      expect(result.current.conversation).toEqual(mockConversation);
      expect(result.current.title).toBe('Test Conversation');
    });

    it('should manage thinking state', () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setIsThinking(true);
      });

      expect(result.current.isThinking).toBe(true);

      act(() => {
        result.current.setIsThinking(false);
      });

      expect(result.current.isThinking).toBe(false);
    });
  });

  describe('Message Sending', () => {
    it('should send message successfully', async () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const mockResponse = {
        role: 'assistant',
        content: 'Test response'
      };

      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockCardExplorerData]
        });
      });

      let response;
      await act(async () => {
        response = await result.current.send(
          { role: 'user', value: 'test message' },
          mockQueryClient
        );
      });

      expect(sendChatMessage).toHaveBeenCalledWith('card-explorer-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          role: 'user',
          value: 'test message',
          sources: [mockCardExplorerData]
        },
        sources: [mockCardExplorerData]
      });

      expect(response).toEqual(mockResponse);
    });

    it('should add sources to message when conversation has sources but no messages with sources', async () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [{ content: 'message without sources' }],
          sources: [mockCardExplorerData]
        });
      });

      const messageObj = { content: 'Test message', role: 'user' };

      await act(async () => {
        await result.current.send(messageObj, mockQueryClient);
      });

      expect(sendChatMessage).toHaveBeenCalledWith('card-explorer-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          ...messageObj,
          sources: [mockCardExplorerData]
        },
        sources: [mockCardExplorerData]
      });
    });

    it('should handle send message error', async () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const error = new Error('Network error');
      sendChatMessage.mockRejectedValue(error);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockCardExplorerData]
        });
      });

      let response;
      await act(async () => {
        response = await result.current.send('test message', mockQueryClient);
      });

      expect(result.current.isThinking).toBe(false);
      expect(result.current.isErrorState).toBe(true);
      expect(response.content).toContain("I'm sorry, something does not compute");
    });

    it('should invalidate correct query keys after message send', async () => {
      const wrapper = ({ children }) => (
        <CardExplorerChatProvider initiatorData={mockCardExplorerData}>
          {children}
        </CardExplorerChatProvider>
      );

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockCardExplorerData]
        });
      });

      await act(async () => {
        await result.current.send('test message', mockQueryClient);
      });

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['conversations', 'type-card-explorer']
      });
    });
  });
});
