// Mock definitions must come before imports
// Imports come after all vi.mock() calls
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useUserStore } from '@store/app.store';
import { useConversations } from '@services/query-services/conversations.query-service';
import MeetingChat from '@components/meeting/meeting-chat.component';
import { useChatStore } from '@store/chat/chat.store';
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn().mockReturnValue({
    invalidateQueries: vi.fn()
    // Add any other methods you need from queryClient
  }),
  useQuery: vi.fn()
}));

vi.mock('@services/query-services/conversations.query-service', () => {
  const mock = vi.fn();
  return {
    useConversations: mock,
    setConversationArchived: vi.fn()
  };
});

vi.mock('@store/chat/chat.store', () => {
  const mock = vi.fn();
  return { useChatStore: mock };
});

vi.mock('@store/app.store', () => {
  const mock = vi.fn();
  return { useUserStore: mock };
});

// Mock chat view components using aliases
vi.mock('@components/chat/chat-fullscreen.component', () => ({
  default: ({ meeting }) => (
    <div data-testid='fullscreen-view'>Fullscreen View: {meeting?.title}</div>
  )
}));

vi.mock('@components/chat/chat-floating.component', () => ({
  default: ({ meeting }) => <div data-testid='floating-view'>Floating View: {meeting?.title}</div>
}));

vi.mock('@components/chat/chat-collapsed-views.component', () => ({
  default: ({ meeting }) => <div data-testid='collapsed-view'>Collapsed View: {meeting?.title}</div>
}));

vi.mock('@store/chat/meeting-chat.store', () => ({
  MeetingChatProvider: ({ children }) => children
}));

describe('MeetingChat', () => {
  const mockMeeting = {
    id: 'meeting123',
    title: 'Test Meeting'
  };

  const mockUser = {
    id: 'user123'
  };

  const mockSetConversation = vi.fn();
  const mockSetActiveArtifactIndex = vi.fn();
  const mockSetInputRef = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useUserStore.mockImplementation((selector) => selector({ user: mockUser }));

    useChatStore.mockImplementation((selector) =>
      selector({
        expansionState: 'collapsed',
        setConversation: mockSetConversation,
        setActiveArtifactIndex: mockSetActiveArtifactIndex,
        setInputRef: mockSetInputRef,
        initiatorData: mockMeeting,
        initiatorType: 'Meeting'
      })
    );

    useConversations.mockReturnValue({
      data: undefined
    });
  });

  describe('Chat State Management', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('initializes with empty conversation when no existing conversation exists', () => {
      // Setup useConversations to use the placeholderData function
      useConversations.mockImplementation((_, options) => {
        const placeholderData = options.placeholderData();

        // Call the placeholderData function which will call setConversation
        return {
          data: placeholderData,
          isLoading: false,
          error: null
        };
      });

      render(<MeetingChat meeting={mockMeeting} />);

      // Advance timers to trigger the setTimeout
      vi.advanceTimersByTime(0);

      // Now check if setConversation was called with the correct data
      expect(mockSetConversation).toHaveBeenCalledWith({
        messages: [],
        tags: ['type-vanilla'],
        sources: [
          {
            id: mockMeeting.id,
            title: mockMeeting.title,
            type: 'Meeting'
          }
        ]
      });
    });

    it('loads existing conversation when available', () => {
      // Create a valid mock conversation with all required properties
      const mockConversation = {
        id: 'conv123',
        messages: [{ id: 'msg1', content: 'Hello' }], // Ensure messages is an array with at least one item
        artifacts: [{ id: 'art1' }]
      };

      // Setup useConversations mock but don't call onSuccess yet
      useConversations.mockImplementation((_, options) => {
        return {
          data: mockConversation,
          isLoading: false,
          error: null
        };
      });

      render(<MeetingChat meeting={mockMeeting} />);

      // Manually call the onSuccess callback with the mock data
      const onSuccessCallback = useConversations.mock.calls[0][1].onSuccess;
      onSuccessCallback(mockConversation);

      // Verify that setConversation was called with the mock conversation
      expect(mockSetConversation).toHaveBeenCalledWith(mockConversation);
    });
  });

  describe('View Rendering', () => {
    it('shows collapsed view by default', () => {
      render(<MeetingChat meeting={mockMeeting} />);
      expect(screen.getByTestId('collapsed-view')).toBeInTheDocument();
    });

    it('shows fullscreen view when in fullscreen state', () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          expansionState: 'fullscreen',
          setConversation: mockSetConversation,
          setActiveArtifactIndex: mockSetActiveArtifactIndex,
          setInputRef: mockSetInputRef,
          initiatorData: mockMeeting,
          initiatorType: 'Meeting'
        })
      );

      render(<MeetingChat meeting={mockMeeting} />);
      expect(screen.getByTestId('fullscreen-view')).toBeInTheDocument();
    });

    it('shows floating view when in floating state', () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          expansionState: 'floating',
          setConversation: mockSetConversation,
          setActiveArtifactIndex: mockSetActiveArtifactIndex,
          setInputRef: mockSetInputRef,
          initiatorData: mockMeeting,
          initiatorType: 'Meeting'
        })
      );

      render(<MeetingChat meeting={mockMeeting} />);
      expect(screen.getByTestId('floating-view')).toBeInTheDocument();
    });
  });

  describe('Conversation Query', () => {
    it('uses correct parameters for conversation query', () => {
      render(<MeetingChat meeting={mockMeeting} />);

      expect(useConversations).toHaveBeenCalledWith(
        {
          creator_id: mockUser.id,
          source_ids: [mockMeeting.id],
          has_archived_at: false,
          sort: 'created_at',
          asc: false,
          tags: ['type-vanilla']
        },
        expect.any(Object)
      );
    });
  });
});
