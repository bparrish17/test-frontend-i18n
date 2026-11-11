// Mock definitions must come before imports
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useBreakpoints } from '@util/hooks';
import { useChatStore } from '@store/chat/chat.store';
import FloatingChatView from '@components/chat/chat-floating.component';

vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => {
    // Identify the outer mobile container
    if (props.position === 'fixed' && props.display === 'flex' && props.bg === 'white') {
      return (
        <div
          data-testid='mobile-outer-container'
          {...props}
        >
          {children}
        </div>
      );
    }
    // Identify the inner input container in mobile view
    if (props.position === 'absolute' && props.borderTop === '1px') {
      return (
        <div
          data-testid='mobile-input-container'
          {...props}
        >
          {children}
        </div>
      );
    }
    // Default case for other Box components
    return (
      <div
        data-testid='generic-box'
        {...props}
      >
        {children}
      </div>
    );
  },
  Flex: ({ children, ...props }) => (
    <div
      data-testid='flex'
      {...props}
    >
      {children}
    </div>
  ),
  Button: ({ children, onClick, ...props }) => (
    <button
      data-testid='button'
      onClick={onClick}
      {...props}
    >
      {children || props.text}
    </button>
  ),
  SlideFade: ({ children, in: isVisible }) => (
    <div
      data-testid='slide-fade'
      data-visible={isVisible}
    >
      {children}
    </div>
  )
}));

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn()
}));

vi.mock('@components/chat/chat-header.component', () => ({
  default: ({ isArtifactView, setIsArtifactView }) => (
    <div data-testid='chat-header'>
      Chat Header
      {setIsArtifactView && (
        <button onClick={() => setIsArtifactView(!isArtifactView)}>Toggle Artifact View</button>
      )}
    </div>
  ),
  ChatHeader: ({ isArtifactView, setIsArtifactView }) => (
    <div data-testid='chat-header'>
      Chat Header
      {setIsArtifactView && (
        <button onClick={() => setIsArtifactView(!isArtifactView)}>Toggle Artifact View</button>
      )}
    </div>
  )
}));

vi.mock('@components/chat/chat-content.component', () => ({
  default: ({ scrollerRef, setIsArtifactView }) => (
    <div
      data-testid='chat-content'
      ref={scrollerRef}
    >
      Chat Content
      {setIsArtifactView && <button onClick={() => setIsArtifactView(true)}>Show Artifact</button>}
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
  const mockStore = vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        conversation: {
          messages: []
        },
        expansionState: 'floating',
        inputRef: { current: { focus: vi.fn() } },
        send: vi.fn(),
        isThinking: false,
        inputValue: '',
        setInputValue: vi.fn(),
        displayMessages: [],
        setDisplayMessages: vi.fn(),
        showFullscreenChat: vi.fn(),
        initiatorData: {
          id: 'meeting123',
          title: 'Test Meeting'
        }
      });
    }
    // Direct state access (for ChatActionButtons)
    return {
      conversation: {
        messages: []
      }
    };
  });
  return { useChatStore: mockStore };
});

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  })
}));

describe('FloatingChatView', () => {
  const mockSetDisplayMessages = vi.fn();
  const mockSetInputValue = vi.fn();
  const mockSend = vi.fn();
  const mockShowFullscreenChat = vi.fn();
  const mockInputRef = { current: { focus: vi.fn() } };

  beforeEach(() => {
    vi.clearAllMocks();

    const mockState = {
      conversation: {
        messages: []
      },
      expansionState: 'floating',
      inputRef: mockInputRef,
      send: mockSend,
      isThinking: false,
      inputValue: '',
      setInputValue: mockSetInputValue,
      displayMessages: [],
      setDisplayMessages: mockSetDisplayMessages,
      showFullscreenChat: mockShowFullscreenChat,
      initiatorData: {
        id: 'meeting123',
        title: 'Test Meeting'
      }
    };

    useChatStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState);
      }
      return mockState;
    });

    // Default to desktop view
    useBreakpoints.mockReturnValue({ isMobile: false });
  });

  describe('Desktop View', () => {
    it('renders floating chat layout', () => {
      render(<FloatingChatView />);

      expect(screen.getByTestId('slide-fade')).toBeInTheDocument();
      expect(screen.getByTestId('chat-header')).toBeInTheDocument();
      expect(screen.getByTestId('chat-content')).toBeInTheDocument();
      expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('switches to fullscreen when receiving artifact response', async () => {
      // Make sure we're in desktop view
      useBreakpoints.mockReturnValue({ isMobile: false });

      const mockShowFullscreenChat = vi.fn();
      const mockSend = vi.fn().mockResolvedValue({
        role: 'assistant',
        content: 'Test response',
        artifact: { id: 'art1' }
      });

      // Set up initial state with all required functions
      const mockState = {
        conversation: { messages: [] },
        inputValue: 'test message',
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages,
        setInputValue: mockSetInputValue,
        send: mockSend,
        showFullscreenChat: mockShowFullscreenChat,
        isThinking: false,
        inputRef: mockInputRef,
        initiatorData: {
          id: 'meeting123',
          title: 'Test Meeting'
        }
      };

      useChatStore.mockImplementation((selector) => {
        if (typeof selector === 'function') {
          return selector(mockState);
        }
        return mockState;
      });

      render(<FloatingChatView />);

      const form = screen.getByTestId('chat-input');

      await act(async () => {
        fireEvent.submit(form);
        // Wait for all promises to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(mockSend).toHaveBeenCalled();
      expect(mockShowFullscreenChat).toHaveBeenCalled();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      useBreakpoints.mockReturnValue({ isMobile: true });
    });

    it('renders mobile layout', () => {
      render(<FloatingChatView />);

      expect(screen.getByTestId('mobile-outer-container')).toHaveAttribute('position', 'fixed');
      expect(screen.getByTestId('chat-header')).toBeInTheDocument();
      expect(screen.getByTestId('chat-content')).toBeInTheDocument();
      expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('toggles between chat and artifact views', () => {
      useBreakpoints.mockReturnValue({ isMobile: true });

      // Create state setter mock for isArtifactView
      const setIsArtifactView = vi.fn();

      // Mock the button component to render properly
      vi.mock('@chakra-ui/react', () => ({
        ...vi.importActual('@chakra-ui/react'),
        Box: ({ children, ...props }) => {
          // Identify the outer mobile container
          if (props.position === 'fixed' && props.display === 'flex' && props.bg === 'white') {
            return (
              <div
                data-testid='mobile-outer-container'
                {...props}
              >
                {children}
              </div>
            );
          }
          // Identify the inner input container in mobile view
          if (props.position === 'absolute' && props.borderTop === '1px') {
            return (
              <div
                data-testid='mobile-input-container'
                {...props}
              >
                {children}
              </div>
            );
          }
          // Default case for other Box components
          return (
            <div
              data-testid='generic-box'
              {...props}
            >
              {children}
            </div>
          );
        },
        Flex: ({ children, ...props }) => (
          <div
            data-testid='flex'
            {...props}
          >
            {children}
          </div>
        ),
        Button: ({ children, onClick, ...props }) => (
          <button
            data-testid='button'
            onClick={onClick}
            {...props}
          >
            {children}
          </button>
        ),
        SlideFade: ({ children, in: isVisible }) => (
          <div
            data-testid='slide-fade'
            data-visible={isVisible}
          >
            {children}
          </div>
        )
      }));

      const mockState = {
        conversation: {
          messages: ['message1'],
          artifacts: [{ id: 'art1', content: 'hello world' }]
        },
        expansionState: 'floating',
        inputRef: mockInputRef,
        send: mockSend,
        isThinking: false,
        inputValue: '',
        setInputValue: mockSetInputValue,
        displayMessages: ['message1'],
        setDisplayMessages: mockSetDisplayMessages,
        showFullscreenChat: mockShowFullscreenChat,
        initiatorData: {
          id: 'meeting123',
          title: 'Test Meeting'
        }
      };

      useChatStore.mockImplementation((selector) => {
        if (typeof selector === 'function') {
          return selector(mockState);
        }
        return mockState;
      });

      const { rerender } = render(<FloatingChatView />);

      // First show chat content
      expect(screen.getByTestId('chat-content')).toBeInTheDocument();

      // Click to show artifact
      const showArtifactButton = screen.getByText('Show Artifact');
      act(() => {
        fireEvent.click(showArtifactButton);
      });

      // Verify artifact content is shown
      expect(screen.getByTestId('artifact-content')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-content')).not.toBeInTheDocument();

      // Find and click the back button directly via header
      const toggleButton = screen.getByText('Toggle Artifact View');
      act(() => {
        fireEvent.click(toggleButton);
      });

      // Verify we're back to chat view
      expect(screen.queryByTestId('artifact-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('chat-content')).toBeInTheDocument();
    });
  });

  describe('Message Handling', () => {
    it('handles message submission', async () => {
      const testMessage = 'test message';
      const mockSend = vi.fn().mockResolvedValue({
        role: 'assistant',
        content: 'Test response',
        artifact: { id: 'art1' }
      });

      const mockState = {
        conversation: {},
        inputRef: mockInputRef,
        send: mockSend,
        isThinking: false,
        inputValue: testMessage,
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages,
        showFullscreenChat: mockShowFullscreenChat,
        initiatorData: {
          id: 'meeting123',
          title: 'Test Meeting'
        }
      };

      useChatStore.mockImplementation((selector) => {
        if (typeof selector === 'function') {
          return selector(mockState);
        }
        return mockState;
      });

      render(<FloatingChatView />);

      const form = screen.getByTestId('chat-input');
      await act(async () => {
        fireEvent.submit(form);
      });

      expect(mockSetDisplayMessages).toHaveBeenCalled();
      expect(mockSetInputValue).toHaveBeenCalledWith('');
      expect(mockSend).toHaveBeenCalled();
    });

    it('prevents empty message submission', async () => {
      const mockSend = vi.fn().mockResolvedValue({
        role: 'assistant',
        content: 'Test response',
        artifact: { id: 'art1' }
      });

      const mockState = {
        conversation: {},
        inputRef: mockInputRef,
        send: mockSend,
        isThinking: false,
        inputValue: '   ',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages,
        showFullscreenChat: mockShowFullscreenChat,
        initiatorData: {
          id: 'meeting123',
          title: 'Test Meeting'
        }
      };

      useChatStore.mockImplementation((selector) => {
        if (typeof selector === 'function') {
          return selector(mockState);
        }
        return mockState;
      });

      render(<FloatingChatView />);

      const form = screen.getByTestId('chat-input');
      await act(async () => {
        fireEvent.submit(form);
      });

      expect(mockSend).not.toHaveBeenCalled();
    });
  });
});
