import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, beforeAll } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import CardExplorerPageContent from '@pages/explorer/explorer-content.page';
import { useConversationById } from '@services/query-services/conversations.query-service';
import { useExplorerPageStore, useUserStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store';

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
});

const renderWithProviders = (component) => {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

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
  usePusherEvent: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardsCleanBody: vi.fn(() => ({ data: [] }))
}));

import { useCardsCleanBody } from '@services/query-services/cards.query-service';

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

vi.mock('@components/explorer/explorer-chat.component', () => ({
  __esModule: true,
  default: () => (
    <div
      data-testid='card-explorer-chat-provider'
    >
      Card Explorer Chat Component
    </div>
  )
}));

describe('CardExplorerPageContent component', () => {
  const mockUseConversationById = vi.mocked(useConversationById);
  const mockUseExplorerPageStore = vi.mocked(useExplorerPageStore);
  const mockUseUserStore = vi.mocked(useUserStore);
  const mockUseChatStore = vi.mocked(useChatStore);
  const mockUseCardsCleanBody = vi.mocked(useCardsCleanBody);
  
  const mockSetConversation = vi.fn();
  const mockSetDisplayMessages = vi.fn();
  const mockSetActiveArtifactIndex = vi.fn();
  const mockSetIsRightRailExpanded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Override explorer page store for these tests
    mockUseExplorerPageStore.mockImplementation((selector) => {
      const store = {
        isRightRailExpanded: false,
        setIsRightRailExpanded: mockSetIsRightRailExpanded,
        sources: []
      };
      return selector ? selector(store) : store;
    });

    mockUseUserStore.mockReturnValue({ user: { id: 'test-user' } });
    mockUseCardsCleanBody.mockReturnValue({ data: [] });
    
    mockUseChatStore.mockImplementation((selector) => {
      const store = {
        setConversation: mockSetConversation,
        setDisplayMessages: mockSetDisplayMessages,
        setActiveArtifactIndex: mockSetActiveArtifactIndex,
        conversation: null,
        inputRef: { current: null },
        send: vi.fn(),
        isThinking: false,
        inputValue: '',
        setInputValue: vi.fn(),
        displayMessages: []
      };
      return selector ? selector(store) : store;
    });
  });

  it('renders the CardExplorerPageContent component', () => {
    renderWithProviders(<CardExplorerPageContent conversation={null} />);

    expect(screen.getByTestId('card-explorer-chat-provider')).toBeInTheDocument();
  });

  it('updates chat store when conversation changes', async () => {
    const mockConversation = {
      id: 'test-conversation',
      messages: [{ role: 'user', content: 'test message' }],
      artifacts: [{ id: 'artifact-1' }]
    };

    renderWithProviders(<CardExplorerPageContent conversation={mockConversation} />);

    await waitFor(() => {
      expect(mockSetConversation).toHaveBeenCalledWith(mockConversation);
      expect(mockSetDisplayMessages).toHaveBeenCalledWith(mockConversation.messages);
      expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(0);
    });
  });

  it('renders without conversation data', () => {
    renderWithProviders(<CardExplorerPageContent conversation={null} />);

    expect(screen.getByTestId('card-explorer-chat-provider')).toBeInTheDocument();
    expect(screen.getByText('Card Explorer Chat Component')).toBeInTheDocument();
  });
});
