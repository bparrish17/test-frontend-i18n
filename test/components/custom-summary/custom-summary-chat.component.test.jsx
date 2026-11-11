// Mock definitions must come before imports
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useUserStore } from '@store/app.store';
import { useConversations } from '@services/query-services/conversations.query-service';
import CustomSummaryChat from '@components/custom-summary/custom-summary-chat.component';
import { useChatStore } from '@store/chat/chat.store';

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

vi.mock('@components/chat/chat-fullscreen.component', () => ({
  default: ({ initialSourceData }) => (
    <div data-testid='fullscreen-view'>
      Fullscreen View:{' '}
      {initialSourceData && initialSourceData[0] ? initialSourceData[0].title : 'No data'}
    </div>
  )
}));

vi.mock('@store/chat/custom-summary-chat.store', () => ({
  CustomSummaryChatProvider: ({ children }) => children
}));

vi.mock('@chakra-ui/react', () => ({
  Portal: ({ children }) => children,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>
}));

describe('CustomSummaryChat', () => {
  const mockMeeting = {
    id: 'meeting123',
    title: 'Test Meeting',
    type: 'Meeting'
  };

  const mockCard = {
    id: 'card123',
    type: 'Card',
    headline: 'Test Card',
    sections: [
      {
        title: 'Section 1',
        content: 'Point 1*Point 2*Point 3'
      },
      {
        title: 'Section 2',
        content: 'Detail 1*Detail 2'
      }
    ]
  };

  const mockInitialSourceData = [mockMeeting, mockCard];

  const mockUser = {
    id: 'user123'
  };

  const mockSetConversation = vi.fn();
  const mockSetActiveArtifactIndex = vi.fn();
  const mockSetTitle = vi.fn();
  const mockSetShowCustomSummaryChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useUserStore.mockImplementation((selector) => selector({ user: mockUser }));

    useChatStore.mockImplementation((selector) =>
      selector({
        expansionState: 'fullscreen',
        setConversation: mockSetConversation,
        setActiveArtifactIndex: mockSetActiveArtifactIndex,
        setTitle: mockSetTitle,
        isTitleFormDirty: false
      })
    );

    useConversations.mockReturnValue({
      data: undefined
    });
  });

  describe('Initial Rendering', () => {
    it('initializes with a new conversation when no existing conversation', () => {
      render(
        <CustomSummaryChat
          initialSourceData={mockInitialSourceData}
          setShowCustomSummaryChat={mockSetShowCustomSummaryChat}
        />
      );

      const expectedMarkdown =
        '## Test Card\n\n**Section 1**\n\nPoint 1\n-Point 2\n-Point 3\n\n\n**Section 2**\n\nDetail 1\n-Detail 2\n\n';

      expect(mockSetConversation).toHaveBeenCalledWith({
        messages: [
          {
            role: 'assistant',
            value:
              "Chat with me to create a custom template for this meeting and similar ones. I'll generate a summary for this meeting based on your input, and we can revise it together.\nConsider including:\n- **Sections** (e.g., Goals, Action Items, Next Steps).\n- **Details** (e.g., stakeholders, deadlines, risks).\n- **Focus areas** (e.g., blockers, missing roles, follow-ups).\nAdd as much or as little as you want—it's entirely up to you.",
            artifact: {
              type: 'text/markdown',
              content: expectedMarkdown,
              title: 'Original Summary of Test Meeting'
            }
          }
        ],
        artifacts: [
          {
            type: 'text/markdown',
            content: expectedMarkdown,
            title: 'Original Summary of Test Meeting'
          }
        ],
        sources: mockInitialSourceData,
        tags: ['type-custom-summary'],
        title: 'Original Summary of Test Meeting'
      });
    });

    it('loads existing conversation when available', () => {
      const mockExistingConversation = {
        id: 'conv123',
        messages: ['message1'],
        artifacts: [{ title: 'Existing Template' }]
      };

      useConversations.mockReturnValue({
        data: mockExistingConversation
      });

      render(
        <CustomSummaryChat
          initialSourceData={mockInitialSourceData}
          setShowCustomSummaryChat={mockSetShowCustomSummaryChat}
        />
      );

      expect(mockSetConversation).toHaveBeenCalledWith(mockExistingConversation);
      expect(mockSetTitle).toHaveBeenCalledWith('Existing Template');
    });
  });

  describe('View Management', () => {
    it('shows fullscreen view when in fullscreen state', () => {
      render(
        <CustomSummaryChat
          initialSourceData={mockInitialSourceData}
          setShowCustomSummaryChat={mockSetShowCustomSummaryChat}
        />
      );

      expect(screen.getByTestId('fullscreen-view')).toBeInTheDocument();
    });
  });

  describe('Conversation Query', () => {
    it('uses correct parameters for conversation query', () => {
      render(
        <CustomSummaryChat
          initialSourceData={mockInitialSourceData}
          setShowCustomSummaryChat={mockSetShowCustomSummaryChat}
        />
      );

      expect(useConversations).toHaveBeenCalledWith(
        {
          creator_id: mockUser.id,
          source_ids: [mockMeeting.id],
          has_archived_at: false,
          sort: 'created_at',
          asc: false,
          tags: ['type-custom-summary']
        },
        expect.any(Object)
      );
    });
  });
});
