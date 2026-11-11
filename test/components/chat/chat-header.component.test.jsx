import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatHeader } from '@components/chat/chat-header.component';
import { useChatStore } from '@store/chat/chat.store';
import { useBreakpoints, useStyledToast } from '@util/hooks';

// Mock the hooks
vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn(),
  useStyledToast: vi.fn()
}));

// Mock the icons
vi.mock('@assets/icons', () => ({
  ExpandIcon: () => 'ExpandIcon',
  SFChatBubblesIconOutlined: () => 'ChatIcon',
  MinimizeIcon: () => 'MinimizeIcon',
  ContractIcon: () => 'ContractIcon',
  SFBookPagesOutlinedIcon: () => 'BookPagesIcon',
  CloseIcon: () => 'CloseIcon',
  HorizontalDotMenuIcon: () => 'DotMenuIcon',
  SFMinusCircleFillIcon: () => 'MinusCircleIcon',
  SFBrainHeadProfile: () => 'BrainHeadProfile'
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  VStack: ({ children, ...props }) => <div {...props}>{children}</div>,
  HStack: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }) => <span {...props}>{children}</span>,
  Flex: ({ children, ...props }) => <div {...props}>{children}</div>,
  Icon: ({ children, ...props }) => <span {...props}>{children}</span>,
  IconButton: ({ 'aria-label': ariaLabel, onClick, icon, ...props }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  ),
  Menu: ({ children }) => <div>{children}</div>,
  MenuButton: ({ as: As, children, ...props }) => {
    const Component = As || 'button';
    return <Component {...props}>{children}</Component>;
  },
  MenuList: ({ children, ...props }) => <div {...props}>{children}</div>,
  MenuItem: ({ children, onClick, ...props }) => (
    <button
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}));

describe('ChatHeader', () => {
  const mockMeeting = {
    id: 'meeting123',
    title: 'Test Meeting',
    start_at: '2025-01-28T18:30:00Z'
  };

  const mockShowFullscreenChat = vi.fn();
  const mockShowFloatingChat = vi.fn();
  const mockShowCollapsedChat = vi.fn();
  const mockClearChat = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useBreakpoints.mockReturnValue({ isMobile: false });
    useStyledToast.mockReturnValue(mockToast);

    // Default chat store state
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: [] },
        expansionState: 'floating',
        showFullscreenChat: mockShowFullscreenChat,
        showFloatingChat: mockShowFloatingChat,
        showCollapsedChat: mockShowCollapsedChat,
        clearChat: mockClearChat,
        activeArtifactIndex: 0,
        initiatorData: {
          title: 'Test Meeting',
          start_at: '2025-01-28T18:30:00Z'
        },
        initiatorType: 'Meeting'
      };
      return typeof selector === 'function' ? selector(state) : state;
    });
  });

  it('renders basic header information correctly', () => {
    render(
      <ChatHeader
        isArtifactView={false}
        setIsArtifactView={vi.fn()}
      />
    );

    expect(screen.getByText('Ask FORA')).toBeInTheDocument();
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
  });

  it('shows date when in fullscreen mode', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: [] },
        expansionState: 'fullscreen',
        showFullscreenChat: mockShowFullscreenChat,
        showFloatingChat: mockShowFloatingChat,
        showCollapsedChat: mockShowCollapsedChat,
        clearChat: mockClearChat,
        initiatorData: {
          title: 'Test Meeting',
          start_at: '2025-01-28T18:30:00Z'
        },
        initiatorType: 'Meeting'
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatHeader
        isArtifactView={false}
        setIsArtifactView={vi.fn()}
      />
    );

    expect(screen.getByText('Tue, Jan 28, 2025')).toBeInTheDocument();
  });

  it('shows artifact title when in artifact view on mobile', () => {
    useBreakpoints.mockReturnValue({ isMobile: true });
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          messages: [],
          artifacts: [{ title: 'Test Artifact' }]
        },
        expansionState: 'floating',
        activeArtifactIndex: 0
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatHeader
        isArtifactView={true}
        setIsArtifactView={vi.fn()}
      />
    );

    expect(screen.getByText('Test Artifact')).toBeInTheDocument();
  });

  it('shows correct expand/contract buttons based on expansion state', () => {
    const { rerender } = render(
      <ChatHeader
        isArtifactView={false}
        setIsArtifactView={vi.fn()}
      />
    );

    // In floating state, should show expand button
    expect(screen.getByLabelText('Expand')).toBeInTheDocument();

    // Change to fullscreen state
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: [] },
        expansionState: 'fullscreen',
        showFullscreenChat: mockShowFullscreenChat,
        showFloatingChat: mockShowFloatingChat,
        showCollapsedChat: mockShowCollapsedChat,
        initiatorData: {
          title: 'Test Meeting',
          start_at: '2025-01-28T18:30:00Z'
        },
        initiatorType: 'Meeting'
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    rerender(
      <ChatHeader
        isArtifactView={false}
        setIsArtifactView={vi.fn()}
      />
    );

    // In fullscreen state, should show contract button
    expect(screen.getByLabelText('Contract')).toBeInTheDocument();
  });

  it('handles chat clearing through overflow menu', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          messages: [
            { role: 'user', content: 'test' },
            { role: 'assistant', content: 'response' }
          ]
        },
        clearChat: mockClearChat,
        expansionState: 'floating'
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatHeader
        isArtifactView={false}
        setIsArtifactView={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Option Overflow Menu'));
    fireEvent.click(screen.getByText('Clear Chat'));

    expect(mockClearChat).toHaveBeenCalledWith(mockToast);
  });

  it('hides overflow menu when there are no user messages', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          messages: [] // No messages
        },
        clearChat: mockClearChat,
        expansionState: 'floating'
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatHeader
        isArtifactView={false}
        setIsArtifactView={vi.fn()}
      />
    );

    expect(screen.queryByLabelText('Option Overflow Menu')).not.toBeInTheDocument();
  });
});
