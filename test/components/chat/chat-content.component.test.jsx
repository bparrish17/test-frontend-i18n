import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatContent from '@components/chat/chat-content.component';
import { useChatStore } from '@store/chat/chat.store';
import { useBreakpoints, useCopyToClipboard } from '@util/hooks';

// Mock the hooks
vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn(),
  useCopyToClipboard: vi.fn()
}));

// Mock ChatSplashScreen component
vi.mock('@components/chat/chat-splash-screen.component', () => ({
  default: () => <div data-testid='splash-screen'>Splash Screen</div>
}));

// Mock the icons
vi.mock(import('@assets/icons'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    CopyIcon: () => 'CopyIcon',
    SFBookPagesOutlinedIcon: () => 'BookIcon'
  };
});

// Mock Markdown component
vi.mock('react-markdown', () => ({
  default: ({ children, components }) => <div data-testid='markdown'>{children}</div>
}));

describe('ChatContent', () => {
  const mockScrollerRef = { current: null };
  const mockSetIsArtifactView = vi.fn();
  const mockCopyToClipboard = vi.fn();
  const mockShowFullscreenChat = vi.fn();
  const mockSetActiveArtifactIndex = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useBreakpoints.mockReturnValue({ isMobile: false });
    useCopyToClipboard.mockReturnValue(mockCopyToClipboard);
  });

  it('renders splash screen when no messages are present', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: null,
        displayMessages: [],
        activeChainOfThought: [],
        showFullscreenChat: mockShowFullscreenChat,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    render(
      <ChatContent
        scrollerRef={mockScrollerRef}
        setIsArtifactView={mockSetIsArtifactView}
      />
    );

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });

  it('renders user messages correctly', () => {
    const testMessage = 'Hello, this is a test message';
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: null,
        displayMessages: [{ role: 'user', value: testMessage }],
        activeChainOfThought: [],
        showFullscreenChat: mockShowFullscreenChat,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    render(
      <ChatContent
        scrollerRef={mockScrollerRef}
        setIsArtifactView={mockSetIsArtifactView}
      />
    );

    expect(screen.getByTestId('markdown')).toHaveTextContent(testMessage);
  });

  it('renders assistant messages with FORA badge', () => {
    const testMessage = 'This is an assistant response';
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: null,
        displayMessages: [{ role: 'assistant', value: testMessage }],
        activeChainOfThought: [],
        showFullscreenChat: mockShowFullscreenChat,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    render(
      <ChatContent
        scrollerRef={mockScrollerRef}
        setIsArtifactView={mockSetIsArtifactView}
      />
    );

    expect(screen.getByTestId('fora-badge')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toHaveTextContent(testMessage);
  });

  it('handles copy to clipboard functionality', () => {
    const testMessage = 'Copy this message';
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: null,
        displayMessages: [{ role: 'assistant', value: testMessage }],
        activeChainOfThought: [],
        showFullscreenChat: mockShowFullscreenChat,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    render(
      <ChatContent
        scrollerRef={mockScrollerRef}
        setIsArtifactView={mockSetIsArtifactView}
      />
    );

    fireEvent.click(screen.getByLabelText('Copy'));
    expect(mockCopyToClipboard).toHaveBeenCalledWith(testMessage);
  });

  it('handles artifact rendering and interaction', () => {
    const artifactTitle = 'Test Artifact';
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          artifacts: [{ messageIndex: 0, title: artifactTitle }]
        },
        displayMessages: [
          {
            role: 'assistant',
            value: 'Message with artifact',
            artifact: { title: artifactTitle }
          }
        ],
        activeChainOfThought: [],
        showFullscreenChat: mockShowFullscreenChat,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    render(
      <ChatContent
        scrollerRef={mockScrollerRef}
        setIsArtifactView={mockSetIsArtifactView}
      />
    );

    expect(screen.getByText(artifactTitle)).toBeInTheDocument();
    expect(screen.getByText('Tap to Open')).toBeInTheDocument();

    // Test artifact click behavior
    fireEvent.click(screen.getByText(artifactTitle));
    expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(0);
    expect(mockShowFullscreenChat).toHaveBeenCalled();
  });

  it('handles mobile artifact interaction correctly', () => {
    useBreakpoints.mockReturnValue({ isMobile: true });

    const artifactTitle = 'Mobile Artifact';
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          artifacts: [{ messageIndex: 0, title: artifactTitle }]
        },
        displayMessages: [
          {
            role: 'assistant',
            value: 'Message with artifact',
            artifact: { title: artifactTitle }
          }
        ],
        activeChainOfThought: [],
        showFullscreenChat: mockShowFullscreenChat,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    render(
      <ChatContent
        scrollerRef={mockScrollerRef}
        setIsArtifactView={mockSetIsArtifactView}
      />
    );

    fireEvent.click(screen.getByText(artifactTitle));
    expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(0);
    expect(mockSetIsArtifactView).toHaveBeenCalledWith(true);
    expect(mockShowFullscreenChat).not.toHaveBeenCalled();
  });
});
