import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import CardSearchModal from '@components/search/card-search-modal.component';
import { useChatStore } from '@store/chat/chat.store';
import { useUserStore } from '@store/app.store';
import { usePusherChannel, usePusherEvent, useCopyToClipboard } from '@util/hooks';
import { getConversationById } from '@services/query-services/conversations.query-service';

vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  usePusherChannel: vi.fn(),
  usePusherEvent: vi.fn(),
  useCopyToClipboard: vi.fn()
}));

vi.mock('@services/query-services/conversations.query-service', () => ({
  getConversationById: vi.fn()
}));

vi.mock('@store/chat/card-search-chat.store', () => ({
  CardSearchChatProvider: ({ children }) => <div data-testid='chat-provider'>{children}</div>
}));

vi.mock('@components/general/modals/styled-modal.component', () => ({
  default: ({ title, children, disclosure, customHeader }) => (
    <div data-testid='styled-modal'>
      <Modal isOpen={true} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <div data-testid='modal-title'>{title}</div>
          {customHeader}
          <ModalCloseButton />
          <ModalBody>
            <div data-testid='modal-content'>{children}</div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}));

vi.mock('@components/chat/chat-input.component', () => ({
  default: ({ handleSubmit, inputValue, setInputValue, isThinking, disabled }) => (
    <div data-testid='chat-input'>
      <input
        data-testid='chat-input-field'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={disabled || isThinking}
      />
      <button 
        data-testid='submit-button' 
        onClick={handleSubmit}
        disabled={disabled || isThinking}
      >
        Submit
      </button>
    </div>
  )
}));

vi.mock('@components/search/card-search-modal-content.component', () => ({
  default: ({ customSplashScreen, cardIds, setCardIds }) => (
    <div data-testid='modal-content-component'>
      {customSplashScreen}
      <div data-testid='card-count'>{cardIds.length}</div>
      <button onClick={() => setCardIds(['test-card-1', 'test-card-2'])}>
        Add Cards
      </button>
    </div>
  )
}));

describe('CardSearchModal', () => {
  const mockSubmitFn = vi.fn();
  const mockDisclosure = {
    isOpen: true,
    onClose: vi.fn(),
    onOpen: vi.fn()
  };

  const mockChatStoreState = {
    conversation: null,
    setConversation: vi.fn(),
    displayMessages: [],
    setDisplayMessages: vi.fn(),
    inputValue: '',
    setInputValue: vi.fn(),
    setInputRef: vi.fn(),
    isThinking: false,
    isErrorState: false,
    setIsErrorState: vi.fn(),
    activeChainOfThought: [],
    send: vi.fn(),
    appendThoughtToChain: vi.fn(),
    setShowReasoningPanel: vi.fn(),
    setIsThinking: vi.fn()
  };

  const mockUserStoreState = {
    user: { id: 'test-user-id' }
  };

  const renderComponent = (props = {}) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <CardSearchModal disclosure={mockDisclosure} submitFn={mockSubmitFn} {...props} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useChatStore.mockImplementation((selector) => selector(mockChatStoreState));
    useUserStore.mockImplementation((selector) => selector(mockUserStoreState));
    usePusherChannel.mockReturnValue({ channel: {} });
    usePusherEvent.mockImplementation(() => {});
    useCopyToClipboard.mockReturnValue(vi.fn());
    getConversationById.mockResolvedValue(null);
  });

  it('renders modal with correct title and structure', () => {
    renderComponent();
    
    expect(screen.getByTestId('styled-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Search Meeting Summaries');
    expect(screen.getByTestId('chat-provider')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content-component')).toBeInTheDocument();
  });

  it('renders custom splash screen', () => {
    renderComponent();
    expect(screen.getAllByText('Search Meeting Summaries')).toHaveLength(3); // Title, custom header, and splash
    expect(screen.getByText('Ask me to help you find specific meeting summaries or content from your meetings.')).toBeInTheDocument();
  });

  it('renders chat input component', () => {
    renderComponent();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input-field')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('handles input value changes', () => {
    const mockSetInputValue = vi.fn();
    useChatStore.mockImplementation((selector) => 
      selector({ ...mockChatStoreState, setInputValue: mockSetInputValue })
    );

    renderComponent();
    
    const inputField = screen.getByTestId('chat-input-field');
    fireEvent.change(inputField, { target: { value: 'test message' } });
    
    expect(mockSetInputValue).toHaveBeenCalledWith('test message');
  });

  it('handles form submission', async () => {
    const mockSend = vi.fn().mockResolvedValue({ conversationId: 'test-conversation-id' });
    const mockSetInputValue = vi.fn();
    
    useChatStore.mockImplementation((selector) => 
      selector({
        ...mockChatStoreState,
        inputValue: 'test query',
        send: mockSend,
        setInputValue: mockSetInputValue
      })
    );

    renderComponent();
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith(
        { role: 'user', value: 'test query' },
        expect.any(Object)
      );
    });

    expect(mockSetInputValue).toHaveBeenCalledWith('');
  });

  it('prevents submission when input is empty', async () => {
    const mockSend = vi.fn();
    useChatStore.mockImplementation((selector) => 
      selector({ ...mockChatStoreState, inputValue: '', send: mockSend })
    );

    renderComponent();
    
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('prevents submission when thinking', async () => {
    const mockSend = vi.fn();
    useChatStore.mockImplementation((selector) => 
      selector({
        ...mockChatStoreState,
        inputValue: 'test',
        isThinking: true,
        send: mockSend
      })
    );

    renderComponent();
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('renders submit button with card count', () => {
    renderComponent();
    
    const addCardsButton = screen.getByText('Add Cards');
    fireEvent.click(addCardsButton);
    
    expect(screen.getByText('Add 2 Summaries to Selection')).toBeInTheDocument();
  });

  it('disables submit button when no cards selected', () => {
    renderComponent();
    
    const submitButton = screen.getByText('Add Summaries to Selection');
    expect(submitButton).toBeDisabled();
  });

  it('calls submitFn and closes modal when submit button clicked', () => {
    renderComponent();
    
    const addCardsButton = screen.getByText('Add Cards');
    fireEvent.click(addCardsButton);
    
    const submitButton = screen.getByText('Add 2 Summaries to Selection');
    fireEvent.click(submitButton);
    
    expect(mockSubmitFn).toHaveBeenCalledWith(['test-card-1', 'test-card-2']);
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('renders clear button', () => {
    renderComponent();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('fetches conversation when conversationId is set', async () => {
    const mockConversation = {
      id: 'test-conversation',
      messages: [{ role: 'user', value: 'test message' }]
    };
    
    const mockSetConversation = vi.fn();
    const mockSetDisplayMessages = vi.fn();
    
    getConversationById.mockResolvedValue(mockConversation);
    useChatStore.mockImplementation((selector) => 
      selector({
        ...mockChatStoreState,
        setConversation: mockSetConversation,
        setDisplayMessages: mockSetDisplayMessages
      })
    );

    renderComponent();

    // Simulate pusher event that sets conversationId
    const pusherEventHandler = usePusherEvent.mock.calls.find(
      call => call[1] === 'refetch-modal-conversation'
    )[2];
    
    pusherEventHandler({ conversationId: 'test-conversation' });

    await waitFor(() => {
      expect(getConversationById).toHaveBeenCalledWith('test-conversation');
      expect(mockSetConversation).toHaveBeenCalledWith(mockConversation);
      expect(mockSetDisplayMessages).toHaveBeenCalledWith(mockConversation.messages);
    });
  });

  it('handles pusher CoT events', () => {
    const mockAppendThoughtToChain = vi.fn();
    const mockSetShowReasoningPanel = vi.fn();
    
    useChatStore.mockImplementation((selector) => 
      selector({
        ...mockChatStoreState,
        appendThoughtToChain: mockAppendThoughtToChain,
        setShowReasoningPanel: mockSetShowReasoningPanel
      })
    );

    renderComponent();

    // Find the CoT pusher event handler
    const cotEventHandler = usePusherEvent.mock.calls.find(
      call => call[1] === 'card-search-chat-CoT'
    )[2];
    
    const testThoughtData = { thought: 'test thought' };
    cotEventHandler({ thoughtData: testThoughtData });

    expect(mockAppendThoughtToChain).toHaveBeenCalledWith(testThoughtData);
    expect(mockSetShowReasoningPanel).toHaveBeenCalledWith(true);
  });

  it('uses default disclosure when none provided', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <CardSearchModal submitFn={mockSubmitFn} />
      </QueryClientProvider>
    );
    expect(screen.getByTestId('styled-modal')).toBeInTheDocument();
  });
});