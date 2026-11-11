import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  EarningsCallChatProvider,
  createStoreFunction
} from '@store/chat/earnings-call-chat.store';
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

describe('Earnings Call Chat Store', () => {
  const mockUser = {
    id: 'user123',
    tenants: [{ id: 'tenant123' }]
  };
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };
  const mockEarningsCallData = {
    id: 'earnings-call-123',
    title: 'Q1 2025 Earnings Call',
    start_at: '2025-01-28T18:30:00Z',
    type: 'Earnings_Call'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.getState.mockReturnValue({ user: mockUser });
    sendChatMessage.mockResolvedValue({ role: 'assistant', content: 'Test response' });
  });

  describe('EarningsCallChatProvider', () => {
    it('should initialize with default values', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
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
          initiatorData: mockEarningsCallData,
          initiatorType: 'Earnings_Call',
          title: null,
          isTitleFormDirty: false
        })
      );
    });

    it('should handle initiatorData correctly', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toEqual(mockEarningsCallData);
      expect(result.current.initiatorType).toBe('Earnings_Call');
    });

    it('should handle missing initiatorData', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider>{children}</EarningsCallChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toBeNull();
      expect(result.current.initiatorType).toBe('Earnings_Call');
    });
  });

  describe('Basic State Management', () => {
    it('should manage expansion states', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setExpansionState('fullscreen');
      });

      expect(result.current.expansionState).toBe('fullscreen');

      act(() => {
        result.current.setExpansionState('floating');
      });

      expect(result.current.expansionState).toBe('floating');

      act(() => {
        result.current.setExpansionState('collapsed');
      });

      expect(result.current.expansionState).toBe('collapsed');
    });

    it('should manage conversation state', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
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
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
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
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
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
          sources: [mockEarningsCallData]
        });
      });

      let response;
      await act(async () => {
        response = await result.current.send(
          { role: 'user', value: 'test message' },
          mockQueryClient
        );
      });

      expect(sendChatMessage).toHaveBeenCalledWith('earnings-call-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          role: 'user',
          value: 'test message',
          sources: [
            {
              id: 'earnings-call-123',
              start_at: '2025-01-28T18:30:00Z',
              title: 'Q1 2025 Earnings Call',
              type: 'Earnings_Call'
            }
          ]
        },
        sources: [
          {
            id: 'earnings-call-123',
            start_at: '2025-01-28T18:30:00Z',
            title: 'Q1 2025 Earnings Call',
            type: 'Earnings_Call'
          }
        ]
      });

      expect(response).toEqual(mockResponse);
    });

    it('should add sources to message when conversation has sources but no messages with sources', async () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [{ content: 'message without sources' }],
          sources: [mockEarningsCallData]
        });
      });

      const messageObj = { content: 'Test message', role: 'user' };

      await act(async () => {
        await result.current.send(messageObj, mockQueryClient);
      });

      expect(sendChatMessage).toHaveBeenCalledWith('earnings-call-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          ...messageObj,
          sources: [mockEarningsCallData]
        },
        sources: [mockEarningsCallData]
      });
    });

    it('should handle send message error', async () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const error = new Error('Network error');
      sendChatMessage.mockRejectedValue(error);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockEarningsCallData]
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
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockEarningsCallData]
        });
      });

      await act(async () => {
        await result.current.send('test message', mockQueryClient);
      });

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['conversations', 'type-earnings-call']
      });
    });
  });

  describe('Chat Clearing', () => {
    it('should clear chat with toast', async () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const mockToast = vi.fn();
      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message1', sources: [mockEarningsCallData] }],
        sources: [mockEarningsCallData]
      };

      setConversationArchived.mockResolvedValue();

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation(mockConversation);
      });

      await act(async () => {
        await result.current.clearChat(mockToast);
      });

      expect(setConversationArchived).toHaveBeenCalledWith('conv123', true);
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Chat Cleared!',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    });

    it('should clear chat without toast', async () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message1', sources: [mockEarningsCallData] }],
        sources: [mockEarningsCallData]
      };

      setConversationArchived.mockResolvedValue();

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation(mockConversation);
      });

      await act(async () => {
        await result.current.clearChat();
      });

      expect(setConversationArchived).toHaveBeenCalledWith('conv123', true);
    });
  });

  describe('Provider Integration', () => {
    it('should create separate stores for different provider instances', () => {
      const Wrapper1 = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const Wrapper2 = ({ children }) => (
        <EarningsCallChatProvider
          initiatorData={{ ...mockEarningsCallData, id: 'earnings-call-456' }}
        >
          {children}
        </EarningsCallChatProvider>
      );

      const { result: result1 } = renderHook(() => useChatStore((state) => state), {
        wrapper: Wrapper1
      });
      const { result: result2 } = renderHook(() => useChatStore((state) => state), {
        wrapper: Wrapper2
      });

      // Modify state in first store
      act(() => {
        result1.current.setTitle('Earnings Call 1 Title');
      });

      // Check if stores are independent
      expect(result1.current.title).toBe('Earnings Call 1 Title');
      expect(result2.current.title).toBeNull();
      expect(result1.current.initiatorData.id).toBe('earnings-call-123');
      expect(result2.current.initiatorData.id).toBe('earnings-call-456');
    });

    it('should maintain store instance across re-renders', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const { result, rerender } = renderHook(() => useChatStore((state) => state), { wrapper });

      // Modify state
      act(() => {
        result.current.setTitle('Test Title');
      });

      // Re-render the component
      rerender();

      // Check if the state persists
      expect(result.current.title).toBe('Test Title');
    });
  });

  describe('Conversation Management', () => {
    it('should set conversation with artifact message indices', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

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

      act(() => {
        result.current.setConversation(conversation);
      });

      // Check that artifact indices were set correctly
      expect(result.current.conversation.messages[1].artifact.messageIndex).toBe(1);
      expect(result.current.conversation.messages[3].artifact.messageIndex).toBe(3);
      expect(result.current.conversation.artifacts[0].messageIndex).toBe(1);
      expect(result.current.conversation.artifacts[1].messageIndex).toBe(3);
      expect(result.current.title).toBe('Test Conversation');
    });

    it('should not set title if conversation title is "Untitled Conversation"', () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      const mockConversation = {
        id: 'conv123',
        messages: [],
        title: 'Untitled Conversation'
      };

      act(() => {
        result.current.setConversation(mockConversation);
      });

      expect(result.current.conversation).toEqual(mockConversation);
      expect(result.current.title).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useChatStore is used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useChatStore((state) => state));
      }).toThrow();

      consoleError.mockRestore();
    });

    it('should handle conversation errors gracefully', async () => {
      const wrapper = ({ children }) => (
        <EarningsCallChatProvider initiatorData={mockEarningsCallData}>
          {children}
        </EarningsCallChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      const error = new Error('Conversation error');
      setConversationArchived.mockRejectedValue(error);

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [{ content: 'message1' }],
          sources: [mockEarningsCallData]
        });
      });

      let clearError;
      await act(async () => {
        try {
          await result.current.clearChat();
        } catch (e) {
          clearError = e;
        }
      });

      expect(clearError).toEqual(error);
    });
  });

  describe('Store Configuration', () => {
    it('should configure store with correct earnings call chat settings', () => {
      const mockSet = vi.fn();
      const mockGet = vi.fn();
      const options = { initiatorData: mockEarningsCallData };

      const storeConfig = createStoreFunction(mockSet, mockGet, options);

      // Test that the store function returns a configuration object
      expect(storeConfig).toBeDefined();
      expect(typeof storeConfig).toBe('object');
    });

    it('should handle missing options gracefully', () => {
      const mockSet = vi.fn();
      const mockGet = vi.fn();

      const storeConfig = createStoreFunction(mockSet, mockGet);

      expect(storeConfig).toBeDefined();
      expect(typeof storeConfig).toBe('object');
    });
  });
});
