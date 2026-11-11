import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, beforeAll } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import CardExplorerChat from '@components/explorer/explorer-chat.component';
import { useConversationById } from '@services/query-services/conversations.query-service';
import { useExplorerPageStore, useUserStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store';

// Mock the essential hooks and services
vi.mock('@services/query-services/conversations.query-service', () => ({
  useConversationById: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useExplorerPageStore: vi.fn(),
  useUserStore: vi.fn()
}));

vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  usePusherChannel: vi.fn(() => ({ channel: null })),
  usePusherEvent: vi.fn(),
  useStyledToast: vi.fn(() => vi.fn())
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardsCleanBody: vi.fn(() => ({ data: [] }))
}));

import { useCardsCleanBody } from '@services/query-services/cards.query-service';

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

// Get the mocked functions for use in tests
const mockUseConversationById = vi.mocked(useConversationById);
const mockUseExplorerPageStore = vi.mocked(useExplorerPageStore);
const mockUseUserStore = vi.mocked(useUserStore);
const mockUseChatStore = vi.mocked(useChatStore);
const mockUseCardsCleanBody = vi.mocked(useCardsCleanBody);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useParams: () => ({ conversationId: 'test-conversation-id' }),
    useLocation: () => ({ pathname: '/explorer/test-conversation-id' }),
    useNavigate: () => mockNavigate
  };
});

vi.mock('@store/chat/card-explorer-chat.store', () => ({
  CardExplorerChatProvider: ({ children, initiatorData }) => (
    <div
      data-testid='card-explorer-chat-provider'
      data-initiator={JSON.stringify(initiatorData)}
    >
      {children}
    </div>
  )
}));

vi.mock('@components/chat/chat-content.component', () => ({
  __esModule: true,
  default: ({ customSplashScreen }) => (
    <div data-testid='chat-content'>
      Chat Content
      {customSplashScreen}
    </div>
  )
}));

vi.mock('@components/chat/chat-input.component', () => ({
  __esModule: true,
  default: ({ handleSubmit, inputValue, setInputValue, isThinking, inputRef }) => (
    <form
      onSubmit={handleSubmit}
      data-testid='chat-input'
    >
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isThinking}
        data-testid='chat-input-field'
      />
      <button
        type='submit'
        disabled={isThinking}
      >
        Send
      </button>
    </form>
  )
}));

vi.mock('@components/chat/chat-artifact-content.component', () => ({
  __esModule: true,
  default: () => <div data-testid='artifact-content'>Artifact Content</div>
}));

vi.mock('@components/explorer/explorer-splash.component', () => ({
  __esModule: true,
  default: () => <div data-testid='explorer-splash'>Explorer Splash Screen</div>
}));

vi.mock('@components/explorer/explorer-right-rail.component', () => ({
  __esModule: true,
  default: () => <div data-testid='explorer-right-rail'>Right Rail</div>
}));

vi.mock('@layouts/columned.layout', () => ({
  __esModule: true,
  default: ({ children, rightRailContent, isRightRailExpanded }) => (
    <div
      data-testid='columned-layout'
      data-right-rail-expanded={isRightRailExpanded}
    >
      <div data-testid='main-content'>{children}</div>
      <div data-testid='right-rail'>{rightRailContent}</div>
    </div>
  )
}));

vi.mock('@components/explorer/explorer-sources-content.component', () => ({
  __esModule: true,
  default: () => <div data-testid='explorer-sources-content'>Explorer Sources Content</div>
}));

describe('CardExplorerChat component', () => {
  const mockSend = vi.fn();
  const mockSetInputValue = vi.fn();
  const mockSetDisplayMessages = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        conversation: null,
        inputRef: { current: null },
        send: mockSend,
        isThinking: false,
        setIsThinking: vi.fn(),
        inputValue: '',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages
      };
      return selector ? selector(store) : store;
    });

    mockUseExplorerPageStore.mockImplementation((selector) => {
      const store = {
        sources: [],
        isRightRailExpanded: false
      };
      return selector ? selector(store) : store;
    });
  });

  it('renders chat content and input without artifacts', () => {
    renderWithProviders(<CardExplorerChat />);

    expect(screen.getByTestId('chat-content')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('explorer-splash')).toBeInTheDocument();
  });

  it('renders artifacts when conversation has them', () => {
    const mockConversation = {
      id: 'test-conversation',
      artifacts: [{ id: 'artifact-1' }]
    };

    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        conversation: mockConversation,
        inputRef: { current: null },
        send: mockSend,
        isThinking: false,
        setIsThinking: vi.fn(),
        inputValue: '',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages
      };
      return selector ? selector(store) : store;
    });

    renderWithProviders(<CardExplorerChat />);

    expect(screen.getByTestId('artifact-content')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockResponse = { conversationId: 'new-conversation-id' };
    mockSend.mockResolvedValue(mockResponse);

    // Mock the cards data that will be used to build sources
    mockUseCardsCleanBody.mockReturnValue({
      data: [
        {
          id: 'source-1',
          source_data: { title: 'Test Source' }
        }
      ]
    });

    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        conversation: null,
        inputRef: { current: null },
        send: mockSend,
        isThinking: false,
        setIsThinking: vi.fn(),
        inputValue: 'test message',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages
      };
      return selector ? selector(store) : store;
    });

    mockUseExplorerPageStore.mockImplementation((selector) => {
      const store = {
        sources: [{ id: 'source-1' }],
        isRightRailExpanded: false
      };
      return selector ? selector(store) : store;
    });

    renderWithProviders(<CardExplorerChat />);

    const form = screen.getByTestId('chat-input');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user',
          value: 'test message',
          sources: [
            {
              id: 'source-1',
              title: 'Test Source',
              type: 'Card'
            }
          ]
        }),
        expect.any(Object)
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/explorer/new-conversation-id', {
        replace: true
      });
    });
  });

  it('prevents submission with empty input', () => {
    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        conversation: null,
        inputRef: { current: null },
        send: mockSend,
        isThinking: false,
        setIsThinking: vi.fn(),
        inputValue: '   ',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages
      };
      return selector ? selector(store) : store;
    });

    renderWithProviders(<CardExplorerChat />);

    const form = screen.getByTestId('chat-input');
    fireEvent.submit(form);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('handles send error gracefully', async () => {
    mockSend.mockRejectedValue(new Error('Send failed'));

    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        conversation: null,
        inputRef: { current: null },
        send: mockSend,
        isThinking: false,
        setIsThinking: vi.fn(),
        inputValue: 'test message',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages
      };
      return selector ? selector(store) : store;
    });

    // Mock console.error to prevent error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(<CardExplorerChat />);

    const form = screen.getByTestId('chat-input');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[CardExplorerChat] Error sending message, but maybe thats ok so dont fail'
    );

    consoleSpy.mockRestore();
  });

  it('adjusts layout based on right rail expansion and artifacts', () => {
    const mockConversation = {
      id: 'test-conversation',
      artifacts: [{ id: 'artifact-1' }]
    };

    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        conversation: mockConversation,
        inputRef: { current: null },
        send: mockSend,
        isThinking: false,
        setIsThinking: vi.fn(),
        inputValue: '',
        setInputValue: mockSetInputValue,
        displayMessages: [],
        setDisplayMessages: mockSetDisplayMessages
      };
      return selector ? selector(store) : store;
    });

    mockUseExplorerPageStore.mockImplementation((selector) => {
      const store = {
        sources: [],
        isRightRailExpanded: true
      };
      return selector ? selector(store) : store;
    });

    renderWithProviders(<CardExplorerChat />);

    // Check that the component renders with artifacts
    expect(screen.getByTestId('artifact-content')).toBeInTheDocument();

    // Check that chat content is still present
    expect(screen.getByTestId('chat-content')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });
});
