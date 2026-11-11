import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useChatStore } from '@store/chat/chat.store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FullscreenChatView from '@components/chat/chat-fullscreen.component';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  }),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }) => children
}));

// Rest of the mocks remain the same
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => (
    <div
      data-testid='box'
      {...props}
    >
      {children}
    </div>
  ),
  Flex: ({ children, ...props }) => (
    <div
      data-testid='flex'
      {...props}
    >
      {children}
    </div>
  ),
  VStack: ({ children, ...props }) => (
    <div
      data-testid='vstack'
      {...props}
    >
      {children}
    </div>
  )
}));

vi.mock('@components/chat/chat-header.component', () => ({
  default: ({ meeting }) => <div data-testid='chat-header'>Header: {meeting?.title}</div>
}));

vi.mock('@components/chat/chat-content.component', () => ({
  default: ({ scrollerRef }) => (
    <div
      data-testid='chat-content'
      ref={scrollerRef}
    >
      Chat Content
    </div>
  )
}));

vi.mock('@components/chat/chat-input.component', () => ({
  default: ({ handleSubmit, inputValue, setInputValue, isThinking, inputRef }) => (
    <form
      data-testid='chat-input'
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isThinking}
      />
      <button type='submit'>Send</button>
    </form>
  )
}));

vi.mock('@components/chat/chat-artifact-content.component', () => ({
  default: () => <div data-testid='artifact-content'>Artifact Content</div>
}));

vi.mock('@store/chat/chat.store', () => {
  const mockStore = vi.fn();
  return { useChatStore: mockStore };
});

const renderWithProviders = (ui, mockQueryClient = new QueryClient()) => {
  return render(<QueryClientProvider client={mockQueryClient}>{ui}</QueryClientProvider>);
};

describe('FullscreenChatView', () => {
  const mockSetDisplayMessages = vi.fn();
  const mockSetActiveArtifactIndex = vi.fn();
  const mockSetInputValue = vi.fn();
  const mockSend = vi.fn();
  const mockInputRef = { current: null };
  const mockQueryClient = {};

  const mockInitialSourceData = [{ type: 'Meeting', id: 'meeting123', title: 'Test Meeting' }];

  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.mockImplementation((selector) =>
      selector({
        conversation: {
          messages: [],
          artifacts: []
        },
        inputRef: mockInputRef,
        send: mockSend,
        isThinking: false,
        inputValue: '',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      })
    );

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  describe('Layout', () => {
    it('renders basic chat layout components', () => {
      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);

      expect(screen.getByTestId('chat-header')).toBeInTheDocument();
      expect(screen.getByTestId('chat-content')).toBeInTheDocument();
      expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('shows artifact content when artifacts exist', () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: {
            messages: [],
            artifacts: [{ id: 'art1' }]
          },
          inputRef: mockInputRef,
          send: mockSend,
          isThinking: false,
          inputValue: '',
          setInputValue: mockSetInputValue,
          displayMessages: [],
          setDisplayMessages: mockSetDisplayMessages,
          setActiveArtifactIndex: mockSetActiveArtifactIndex
        })
      );

      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);
      expect(screen.getByTestId('artifact-content')).toBeInTheDocument();
    });

    it('hides artifact content when no artifacts exist', () => {
      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);
      expect(screen.queryByTestId('artifact-content')).not.toBeInTheDocument();
    });
  });

  describe('Message Handling', () => {
    it('updates display messages when conversation changes', () => {
      const mockMessages = [{ role: 'user', value: 'test message' }];
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: {
            messages: mockMessages,
            artifacts: []
          },
          inputRef: mockInputRef,
          send: mockSend,
          isThinking: false,
          inputValue: '',
          setInputValue: mockSetInputValue,
          displayMessages: [],
          setDisplayMessages: mockSetDisplayMessages,
          setActiveArtifactIndex: mockSetActiveArtifactIndex
        })
      );

      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);

      expect(mockSetDisplayMessages).toHaveBeenCalledWith(mockMessages);
    });

    it('handles message submission', async () => {
      const testMessage = 'test message';
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: {
            // No id to trigger the sources addition
            messages: [],
            artifacts: []
          },
          inputRef: mockInputRef,
          send: mockSend,
          isThinking: false,
          inputValue: testMessage,
          setInputValue: mockSetInputValue,
          displayMessages: [],
          setDisplayMessages: mockSetDisplayMessages,
          setActiveArtifactIndex: mockSetActiveArtifactIndex
        })
      );

      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);

      const form = screen.getByTestId('chat-input');
      await act(async () => {
        fireEvent.submit(form);
      });

      const expectedMessage = {
        role: 'user',
        value: testMessage,
        sources: mockInitialSourceData
      };

      // Verify all calls to setDisplayMessages
      expect(mockSetDisplayMessages.mock.calls).toEqual([
        [[]], // Initial empty state
        [[expectedMessage]] // After submit
      ]);

      expect(mockSetInputValue).toHaveBeenCalledWith('');
      expect(mockSend).toHaveBeenCalledWith(expectedMessage, expect.any(Object));
    });

    it('prevents submission of empty messages', async () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: {
            messages: [],
            artifacts: []
          },
          inputRef: mockInputRef,
          send: mockSend,
          isThinking: false,
          inputValue: '   ',
          setInputValue: mockSetInputValue,
          displayMessages: [],
          setDisplayMessages: mockSetDisplayMessages,
          setActiveArtifactIndex: mockSetActiveArtifactIndex
        })
      );

      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);

      const form = screen.getByTestId('chat-input');
      await act(async () => {
        fireEvent.submit(form);
      });

      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Thinking State', () => {
    it('does not update display messages while thinking', () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: {
            messages: [{ role: 'user', value: 'test' }],
            artifacts: []
          },
          inputRef: mockInputRef,
          send: mockSend,
          isThinking: true,
          inputValue: '',
          setInputValue: mockSetInputValue,
          displayMessages: [],
          setDisplayMessages: mockSetDisplayMessages,
          setActiveArtifactIndex: mockSetActiveArtifactIndex
        })
      );

      renderWithProviders(<FullscreenChatView initialSourceData={mockInitialSourceData} />);

      expect(mockSetDisplayMessages).not.toHaveBeenCalled();
    });
  });
});
