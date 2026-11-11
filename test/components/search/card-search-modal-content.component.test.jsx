import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardSearchModalContent from '@components/search/card-search-modal-content.component';
import { useChatStore } from '@store/chat/chat.store';
import { useCopyToClipboard } from '@util/hooks';
import { useCardsCleanBody } from '@services/query-services/cards.query-service';

vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCopyToClipboard: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardsCleanBody: vi.fn()
}));

vi.mock('@components/chat/chat-cot-display.component', () => ({
  default: () => <div data-testid='chain-of-thought'>Chain of Thought</div>
}));

vi.mock('@components/chat/chat-fora-badge.component', () => ({
  default: () => <div data-testid='fora-badge'>FORA Badge</div>
}));

vi.mock('@components/chat/chat-thinking-message.component', () => ({
  default: () => <div data-testid='thinking-message'>Thinking...</div>
}));

vi.mock('@components/general/card/reskin-summary-card/reskin-summary-card.component', () => ({
  default: ({ card, removeFn }) => (
    <div data-testid={`card-${card.id}`}>
      <div>{card.title}</div>
      <button
        onClick={removeFn}
        data-testid={`remove-${card.id}`}
      >
        Remove
      </button>
    </div>
  )
}));

vi.mock('@assets/icons', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    CloseIcon: () => 'CloseIcon',
    CopyIcon: () => 'CopyIcon',
    SFBrainHeadProfile: () => 'BrainIcon'
  };
});

vi.mock('react-markdown', () => ({
  default: ({ children }) => <div data-testid='markdown'>{children}</div>
}));

describe('CardSearchModalContent', () => {
  const mockScrollerRef = { current: null };
  const mockSetCardIds = vi.fn();
  const mockCopyToClipboard = vi.fn();

  const defaultProps = {
    scrollerRef: mockScrollerRef,
    customSplashScreen: <div data-testid='splash-screen'>Splash Screen</div>,
    cardIds: [],
    setCardIds: mockSetCardIds
  };

  const mockChatStoreState = {
    displayMessages: [],
    isThinking: false,
    isErrorState: false,
    setIsErrorState: vi.fn(),
    activeChainOfThought: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useCopyToClipboard.mockReturnValue(mockCopyToClipboard);
    useCardsCleanBody.mockReturnValue({ data: [], isLoading: false });
    useChatStore.mockImplementation((selector) => selector(mockChatStoreState));
  });

  it('renders splash screen when no messages are present', () => {
    render(<CardSearchModalContent {...defaultProps} />);
    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });

  it('renders thinking message when isThinking is true', () => {
    useChatStore.mockImplementation((selector) =>
      selector({ ...mockChatStoreState, isThinking: true })
    );

    render(<CardSearchModalContent {...defaultProps} />);
    expect(screen.getByTestId('thinking-message')).toBeInTheDocument();
  });

  it('renders user messages correctly', () => {
    const testMessage = 'Hello, this is a test message';
    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [{ role: 'user', value: testMessage }]
      })
    );

    render(<CardSearchModalContent {...defaultProps} />);
    expect(screen.getByTestId('markdown')).toHaveTextContent(testMessage);
  });

  it('renders assistant messages with FORA badge', () => {
    const testMessage = 'This is an assistant response';
    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [{ role: 'assistant', value: testMessage }]
      })
    );

    render(<CardSearchModalContent {...defaultProps} />);
    expect(screen.getByTestId('fora-badge')).toBeInTheDocument();
    expect(screen.getByTestId('markdown')).toHaveTextContent(testMessage);
  });

  it('handles copy to clipboard functionality', () => {
    const testMessage = 'Copy this message';
    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [{ role: 'assistant', value: testMessage }]
      })
    );

    render(<CardSearchModalContent {...defaultProps} />);

    const copyButton = screen.getByLabelText('Copy');
    fireEvent.click(copyButton);
    expect(mockCopyToClipboard).toHaveBeenCalledWith(testMessage);
  });

  it('shows thinking toggle button when activeChainOfThought has content', () => {
    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [{ role: 'assistant', value: 'Test message' }],
        activeChainOfThought: [{ content: 'thinking...' }]
      })
    );

    render(<CardSearchModalContent {...defaultProps} />);
    expect(screen.getByText('Show thinking')).toBeInTheDocument();
  });

  it('toggles thinking display when button is clicked', () => {
    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [{ role: 'assistant', value: 'Test message' }],
        activeChainOfThought: [{ content: 'thinking...' }]
      })
    );

    render(<CardSearchModalContent {...defaultProps} />);

    const thinkingButton = screen.getByText('Show thinking');
    fireEvent.click(thinkingButton);

    expect(screen.getByText('Hide thinking')).toBeInTheDocument();
    expect(screen.getByTestId('chain-of-thought')).toBeInTheDocument();
  });

  it('renders cards when artifact is present', () => {
    const mockCards = [
      { id: 'card-1', title: 'Test Card 1' },
      { id: 'card-2', title: 'Test Card 2' }
    ];

    useCardsCleanBody.mockReturnValue({ data: mockCards, isLoading: false });

    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [
          {
            role: 'assistant',
            value: 'Found some cards',
            artifact: { content: '["card-1", "card-2"]' }
          }
        ]
      })
    );

    render(
      <CardSearchModalContent
        {...defaultProps}
        cardIds={['card-1', 'card-2']}
      />
    );

    expect(screen.getByTestId('card-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-card-2')).toBeInTheDocument();
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    expect(screen.getByText('Test Card 2')).toBeInTheDocument();
  });

  it('handles card removal', () => {
    const mockCards = [{ id: 'card-1', title: 'Test Card 1' }];
    useCardsCleanBody.mockReturnValue({ data: mockCards, isLoading: false });

    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [
          {
            role: 'assistant',
            value: 'Found a card',
            artifact: { content: '["card-1"]' }
          }
        ]
      })
    );

    render(
      <CardSearchModalContent
        {...defaultProps}
        cardIds={['card-1']}
      />
    );

    const removeButton = screen.getByTestId('remove-card-1');
    fireEvent.click(removeButton);

    expect(mockSetCardIds).toHaveBeenCalledWith([]);
  });

  it('renders error state correctly', () => {
    const mockSetIsErrorState = vi.fn();
    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        isErrorState: true,
        setIsErrorState: mockSetIsErrorState
      })
    );

    render(<CardSearchModalContent {...defaultProps} />);

    expect(
      screen.getByText('I seem to have encountered an error. Please try again.')
    ).toBeInTheDocument();

    const dismissButton = screen.getByText('dismiss');
    fireEvent.click(dismissButton);
    expect(mockSetIsErrorState).toHaveBeenCalledWith(false);
  });

  it('updates cardIds when displayMessages change with artifacts', () => {
    const { rerender } = render(<CardSearchModalContent {...defaultProps} />);

    useChatStore.mockImplementation((selector) =>
      selector({
        ...mockChatStoreState,
        displayMessages: [
          {
            role: 'assistant',
            value: 'Found cards',
            artifact: { content: '["card-1", "card-2"]' }
          }
        ]
      })
    );

    rerender(<CardSearchModalContent {...defaultProps} />);

    expect(mockSetCardIds).toHaveBeenCalledWith(['card-1', 'card-2']);
  });
});
