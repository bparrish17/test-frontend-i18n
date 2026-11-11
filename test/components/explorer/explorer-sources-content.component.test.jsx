import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExplorerSourcesContent from '@components/explorer/explorer-sources-content.component';
import { useExplorerPageStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store';
import { useCardsCleanBody } from '@services/query-services/cards.query-service';
import { useStyledToast } from '@util/hooks';

// Mock the hooks
vi.mock('@store/app.store', () => ({
  useExplorerPageStore: vi.fn()
}));

vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardsCleanBody: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

// Mock the components
vi.mock('@components/general/card/reskin-summary-card/reskin-summary-card.component', () => ({
  default: ({ card, removeFn }) => (
    <div data-testid={`summary-card-${card.id}`}>
      <span>{card.title}</span>
      <button onClick={removeFn}>Remove</button>
    </div>
  )
}));

vi.mock('@components/search/card-search-modal.component', () => ({
  default: ({ disclosure, submitFn }) => (
    <div data-testid='card-search-modal'>
      {disclosure.isOpen && (
        <div>
          <span>Search Modal</span>
          <button onClick={() => submitFn(['card1', 'card2'])}>Submit</button>
          <button onClick={disclosure.onClose}>Close</button>
        </div>
      )}
    </div>
  )
}));

// Mock Lottie
vi.mock('lottie-react', () => ({
  default: () => <div data-testid='loading-animation'>Loading...</div>
}));

// Mock assets
vi.mock('@assets/icons', () => ({
  SFClockIcon: () => 'ClockIcon'
}));

vi.mock('@assets/animations/lottie/home-page-empty-no-insights.json', () => ({
  default: {}
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Stack: ({ children, gap, p, height, overflow, ...props }) => {
    const style = {
      ...(gap && { gap }),
      ...(p && { padding: p }),
      ...(height && { height }),
      ...(overflow && { overflow })
    };
    return (
      <div
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  },
  Text: ({ children, color, ...props }) => {
    const style = { ...(color && { color }) };
    return (
      <span
        style={style}
        {...props}
      >
        {children}
      </span>
    );
  },
  Heading: ({ children, size, color, display, justifyContent, alignItems, ...props }) => {
    const style = {
      ...(color && { color }),
      ...(display && { display }),
      ...(justifyContent && { justifyContent }),
      ...(alignItems && { alignItems })
    };
    return (
      <h2
        style={style}
        {...props}
      >
        {children}
      </h2>
    );
  },
  Icon: ({ as, boxSize, color, ...props }) => {
    const style = {
      ...(boxSize && { width: boxSize, height: boxSize }),
      ...(color && { color })
    };
    return (
      <span
        style={style}
        {...props}
      >
        {as()}
      </span>
    );
  },
  Box: ({ children, layerStyle, borderRadius, p, textAlign, ...props }) => {
    const style = {
      ...(borderRadius && { borderRadius }),
      ...(p && { padding: p }),
      ...(textAlign && { textAlign })
    };
    return (
      <div
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  },
  Button: ({ children, onClick, variant, size, px, ...props }) => {
    const style = { ...(px && { paddingLeft: px, paddingRight: px }) };
    return (
      <button
        onClick={onClick}
        style={style}
        {...props}
      >
        {children}
      </button>
    );
  },
  Center: ({ children, ...props }) => <div {...props}>{children}</div>,
  VStack: ({ children, gap, ...props }) => {
    const style = { ...(gap && { gap }) };
    return (
      <div
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  },
  Flex: ({ children, direction, align, justify, gap, ...props }) => {
    const style = {
      display: 'flex',
      ...(direction && { flexDirection: direction }),
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(gap && { gap })
    };
    return (
      <div
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  },
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn()
  })
}));

describe('ExplorerSourcesContent', () => {
  const mockSetSources = vi.fn();
  const mockToast = vi.fn();
  const mockCards = [
    { id: 'card1', title: 'Test Card 1' },
    { id: 'card2', title: 'Test Card 2' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        sources: [],
        setSources: mockSetSources
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: null
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useCardsCleanBody.mockReturnValue({
      data: mockCards,
      isLoading: false
    });

    useStyledToast.mockReturnValue(mockToast);
  });

  it('renders empty state when no sources selected', () => {
    render(<ExplorerSourcesContent />);

    expect(screen.getByText('No Selected Summaries')).toBeInTheDocument();
    expect(screen.getByText('Start by adding summaries')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders selected summaries when sources exist', () => {
    const sources = [
      { id: 'card1', type: 'Card' },
      { id: 'card2', type: 'Card' }
    ];

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        sources,
        setSources: mockSetSources
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(<ExplorerSourcesContent />);

    expect(screen.getByText('Selected Summaries')).toBeInTheDocument();
    expect(screen.getByTestId('summary-card-card1')).toBeInTheDocument();
    expect(screen.getByTestId('summary-card-card2')).toBeInTheDocument();
    expect(screen.getAllByText('Add')).toHaveLength(1);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('shows loading animation when cards are loading', () => {
    const sources = [{ id: 'card1', type: 'Card' }];

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        sources,
        setSources: mockSetSources
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useCardsCleanBody.mockReturnValue({
      data: [],
      isLoading: true
    });

    render(<ExplorerSourcesContent />);

    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('clears all sources when clear button is clicked', () => {
    const sources = [{ id: 'card1', type: 'Card' }];

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        sources,
        setSources: mockSetSources
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(<ExplorerSourcesContent />);

    fireEvent.click(screen.getByText('Clear'));

    expect(mockSetSources).toHaveBeenCalledWith([]);
  });

  it('removes individual source when remove button is clicked', () => {
    const sources = [
      { id: 'card1', type: 'Card' },
      { id: 'card2', type: 'Card' }
    ];

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        sources,
        setSources: mockSetSources
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(<ExplorerSourcesContent />);

    const card1 = screen.getByTestId('summary-card-card1');
    const removeButton = card1.querySelector('button');
    fireEvent.click(removeButton);

    expect(mockSetSources).toHaveBeenCalledWith([{ id: 'card2', type: 'Card' }]);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Source Removed',
      status: 'info',
      duration: 1000,
      isClosable: true
    });
  });

  it('uses conversation sources when active conversation exists', () => {
    const conversationSources = [{ id: 'conv1', type: 'Card' }];

    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          sources: conversationSources
        }
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useCardsCleanBody.mockReturnValue({
      data: [{ id: 'conv1', title: 'Conversation Card' }],
      isLoading: false
    });

    render(<ExplorerSourcesContent />);

    expect(screen.getByTestId('summary-card-conv1')).toBeInTheDocument();
  });

  it('uses localStorage sources when no active conversation', () => {
    const localStorageSources = [{ id: 'local1', type: 'Card' }];

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        sources: localStorageSources,
        setSources: mockSetSources
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: null
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(<ExplorerSourcesContent />);

    expect(useCardsCleanBody).toHaveBeenCalledWith({
      ids: ['local1']
    });
  });
});
