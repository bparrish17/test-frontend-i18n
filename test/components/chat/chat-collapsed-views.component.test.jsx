import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CollapsedChatView,
  CollapsedChatViewDesktop,
  CollapsedChatViewMobile
} from '@components/chat/chat-collapsed-views.component';
import { useChatStore } from '@store/chat/chat.store';
import { useBreakpoints } from '@util/hooks';

// Mock the hooks
vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn()
}));

vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  VStack: ({ children, ...props }) => <div {...props}>{children}</div>,
  HStack: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }) => <span {...props}>{children}</span>,
  Fade: ({ children, ...props }) => <div {...props}>{children}</div>
}));

// Mock icons
vi.mock('@assets/icons', () => ({
  SFChatBubblesIconOutlined: () => <div data-testid='chat-icon'>Chat Icon</div>,
  ChevronUpIcon: () => <div data-testid='chevron-up-icon'>Chevron Up</div>
}));

describe('CollapsedChatView', () => {
  const mockMeeting = {
    id: 'meeting123',
    title: 'Test Meeting'
  };

  const mockShowFloatingChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default chat store implementation
    useChatStore.mockImplementation((selector) =>
      selector({
        conversation: { messages: [] },
        showFloatingChat: mockShowFloatingChat,
        initiatorData: mockMeeting
      })
    );
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      useBreakpoints.mockReturnValue({ isMobile: false });
    });

    it('renders desktop view when not on mobile', () => {
      render(<CollapsedChatView meeting={mockMeeting} />);
      expect(screen.getByText('Ask FORA')).toBeInTheDocument();
      expect(screen.getByText('Test Meeting')).toBeInTheDocument();
    });

    it('shows message count when messages exist', () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: { messages: ['msg1', 'msg2', 'msg3', 'msg4'] },
          showFloatingChat: mockShowFloatingChat,
          initiatorData: mockMeeting
        })
      );

      render(<CollapsedChatView meeting={mockMeeting} />);
      expect(screen.getByText('(2)')).toBeInTheDocument(); // 4 messages / 2 = 2 conversations
    });

    it('calls showFloatingChat when clicked', () => {
      render(<CollapsedChatViewDesktop meeting={mockMeeting} />);
      fireEvent.click(screen.getByText('Ask FORA'));
      expect(mockShowFloatingChat).toHaveBeenCalled();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      useBreakpoints.mockReturnValue({ isMobile: true });
      // Mock document.querySelector for modal checks
      document.querySelector = vi.fn().mockReturnValue(null);
    });

    it('renders mobile view when on mobile', () => {
      render(<CollapsedChatView meeting={mockMeeting} />);
      expect(screen.getByText('Ask FORA')).toBeInTheDocument();
    });

    it('shows correct message count on mobile', () => {
      useChatStore.mockImplementation((selector) =>
        selector({
          conversation: { messages: ['msg1', 'msg2'] },
          showFloatingChat: mockShowFloatingChat,
          initiatorData: mockMeeting
        })
      );

      render(<CollapsedChatViewMobile />);
      expect(screen.getByText('1')).toBeInTheDocument(); // 2 messages / 2 = 1 conversation
    });

    it('does not render when modal is open', () => {
      document.querySelector = vi.fn().mockReturnValue({ className: 'chakra-modal__content' });
      const { container } = render(<CollapsedChatViewMobile />);
      expect(container).toBeEmptyDOMElement();
    });

    it('calls showFloatingChat when clicked on mobile', () => {
      render(<CollapsedChatViewMobile />);
      fireEvent.click(screen.getByText('Ask FORA'));
      expect(mockShowFloatingChat).toHaveBeenCalled();
    });
  });
});
