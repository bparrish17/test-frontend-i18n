import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MeetingChatProvider, createStoreFunction } from '@store/chat/meeting-chat.store';
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

describe('Meeting Chat Store', () => {
  const mockUser = {
    id: 'user123',
    tenants: [{ id: 'tenant123' }]
  };
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };
  const mockMeetingData = {
    id: 'meeting123',
    title: 'Test Meeting',
    start_at: '2025-01-28T18:30:00Z',
    type: 'Meeting'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.getState.mockReturnValue({ user: mockUser });
    sendChatMessage.mockResolvedValue({ role: 'assistant', content: 'Test response' });
  });

  describe('MeetingChatProvider', () => {
    it('should initialize with default values', () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
          initiatorData: mockMeetingData,
          initiatorType: 'Meeting',
          title: null,
          isTitleFormDirty: false
        })
      );
    });

    it('should handle initiatorData correctly', () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toEqual(mockMeetingData);
      expect(result.current.initiatorType).toBe('Meeting');
    });

    it('should handle missing initiatorData', () => {
      const wrapper = ({ children }) => <MeetingChatProvider>{children}</MeetingChatProvider>;

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current.initiatorData).toBeNull();
      expect(result.current.initiatorType).toBe('Meeting');
    });
  });

  describe('Basic State Management', () => {
    it('should manage expansion states', () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
          sources: [mockMeetingData]
        });
      });

      let response;
      await act(async () => {
        response = await result.current.send(
          { role: 'user', value: 'test message' },
          mockQueryClient
        );
      });

      expect(sendChatMessage).toHaveBeenCalledWith('meeting-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          role: 'user',
          value: 'test message',
          sources: [
            {
              id: 'meeting123',
              start_at: '2025-01-28T18:30:00Z',
              title: 'Test Meeting',
              type: 'Meeting'
            }
          ]
        },
        sources: [
          {
            id: 'meeting123',
            start_at: '2025-01-28T18:30:00Z',
            title: 'Test Meeting',
            type: 'Meeting'
          }
        ]
      });

      expect(response).toEqual(mockResponse);
    });

    it('should add sources to message when conversation has sources but no messages with sources', async () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [{ content: 'message without sources' }],
          sources: [mockMeetingData]
        });
      });

      const messageObj = { content: 'Test message', role: 'user' };

      await act(async () => {
        await result.current.send(messageObj, mockQueryClient);
      });

      expect(sendChatMessage).toHaveBeenCalledWith('meeting-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          ...messageObj,
          sources: [mockMeetingData]
        },
        sources: [mockMeetingData]
      });
    });

    it('should handle send message error', async () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const error = new Error('Network error');
      sendChatMessage.mockRejectedValue(error);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockMeetingData]
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const mockResponse = { role: 'assistant', content: 'Test response' };
      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [mockMeetingData]
        });
      });

      await act(async () => {
        await result.current.send('test message', mockQueryClient);
      });

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['conversations', 'type-vanilla']
      });
    });
  });

  describe('Chat Clearing', () => {
    it('should clear chat with toast', async () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const mockToast = vi.fn();
      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message1', sources: [mockMeetingData] }],
        sources: [mockMeetingData]
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const mockConversation = {
        id: 'conv123',
        messages: [{ content: 'message1', sources: [mockMeetingData] }],
        sources: [mockMeetingData]
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const Wrapper2 = ({ children }) => (
        <MeetingChatProvider initiatorData={{ ...mockMeetingData, id: 'meeting456' }}>
          {children}
        </MeetingChatProvider>
      );

      const { result: result1 } = renderHook(() => useChatStore((state) => state), {
        wrapper: Wrapper1
      });
      const { result: result2 } = renderHook(() => useChatStore((state) => state), {
        wrapper: Wrapper2
      });

      // Modify state in first store
      act(() => {
        result1.current.setTitle('Meeting 1 Title');
      });

      // Check if stores are independent
      expect(result1.current.title).toBe('Meeting 1 Title');
      expect(result2.current.title).toBeNull();
      expect(result1.current.initiatorData.id).toBe('meeting123');
      expect(result2.current.initiatorData.id).toBe('meeting456');
    });

    it('should maintain store instance across re-renders', () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
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
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      const conversation = {
        messages: [],
        title: 'Untitled Conversation'
      };

      act(() => {
        result.current.setConversation(conversation);
      });

      expect(result.current.conversation).toEqual(conversation);
      expect(result.current.title).toBeNull(); // Should not be set to "Untitled Conversation"
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useChatStore is used outside provider', () => {
      expect(() => {
        renderHook(() => useChatStore((state) => state));
      }).toThrow('Missing ChatStoreContext.Provider in the tree');
    });

    it('should handle conversation errors gracefully', async () => {
      const wrapper = ({ children }) => (
        <MeetingChatProvider initiatorData={mockMeetingData}>{children}</MeetingChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      // Test with malformed conversation
      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: null, // This should not cause errors
          sources: [mockMeetingData]
        });
      });

      expect(result.current.conversation.id).toBe('conv123');
    });
  });
});
