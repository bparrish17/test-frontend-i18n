import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LensInsightPage from '@pages/lens/lens-insight.page';
import { useRefStore, useUserStore } from '@store/app.store';
import { useInsightWithFootnotes } from '@services/query-services/insights.query-service';
import { useInitiativeById } from '@services/query-services/initiatives.query-service';
import { usePersonById } from '@services/query-services/people.query-service';
import { useBreakpointValue, useInfinitePreviousInsights } from '@util/hooks';

vi.mock('@util/hooks', () => ({
  useFullCards: vi.fn(() => ({ fullCards: [] })),
  usePusherChannel: vi.fn(() => ({ channel: null })),
  usePusherEvent: vi.fn(),
  useSetDocumentTitle: vi.fn(),
  useStyledToast: vi.fn(() => vi.fn()),
  useBreakpoints: vi.fn(() => ({ isMobile: false })),
  usePrefetchInfiniteSearchQuery: vi.fn(() => ({
    prefetch: vi.fn(),
    remove: vi.fn()
  })),
  useBreakpointValue: vi.fn(),
  useAllPreviousInsights: vi.fn(() => ({
    previousInsightsRes: { pages: [{ data: [] }] },
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isFetching: false
  })),
  useInfinitePreviousInsights: vi.fn(() => ({
    previousInsightsRes: { pages: [{ data: [] }] },
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isFetching: false
  }))
}));

const checkGateMock = vi.fn();
vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: () => ({ checkGate: checkGateMock })
}));

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }) => <div data-testid='markdown'>{children}</div>
}));

// Mock components
vi.mock('@components/common/skeleton.component', () => ({
  default: () => (
    <div>
      <div data-testid='skeleton' />
      <div data-testid='skeleton-text' />
    </div>
  )
}));

vi.mock('@components/lens/lens-insight-section.component', () => ({
  default: ({ section }) => (
    <article data-testid='lens-insight-section'>
      {section.title && <div data-testid='section-title'>{section.title}</div>}
      <div data-testid='section-content'>{section.content}</div>
    </article>
  )
}));

vi.mock('@components/lens/lens-meta.component', () => ({
  default: () => <div data-testid='lens-meta'>Lens Meta</div>
}));

vi.mock('@components/lens/insight-right-rail.component', () => ({
  default: () => <div data-testid='insight-right-rail'>Right Rail</div>
}));

vi.mock('@components/lens/about-this-lens.component', () => ({
  default: () => <div data-testid='about-this-lens'>About This Lens</div>
}));

vi.mock('@components/lens/insight-metadata.component', () => ({
  default: () => <div data-testid='insight-metadata'>Insight Metadata</div>
}));

vi.mock('@components/lens/insight-tabs.component', () => ({
  default: () => <div data-testid='insight-tabs'>Insight Tabs</div>
}));

vi.mock('@components/pulse/pulse-launch-container.jsx', () => ({
  default: () => <div data-testid='pulse-launch'>Pulse Launch</div>
}));

// Mock LensInsightSkeleton
vi.mock('@pages/lens/lens-insight.page', async () => {
  const actual = await vi.importActual('@pages/lens/lens-insight.page');
  return {
    ...actual,
    LensInsightSkeleton: () => (
      <div>
        <div data-testid='skeleton' />
        <div data-testid='skeleton' />
        <div data-testid='skeleton' />
        <div data-testid='skeleton-text' />
        <div data-testid='skeleton-text' />
      </div>
    )
  };
});

// Mock matchMedia
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

// Mock all the hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn()
  };
});

vi.mock('@store/app.store', () => ({
  useRefStore: vi.fn(),
  useUserStore: vi.fn()
}));

vi.mock('@services/query-services/insights.query-service', () => ({
  useInsightWithFootnotes: vi.fn(() => ({
    data: undefined,
    isLoading: true,
    refetch: vi.fn()
  }))
}));

vi.mock('@services/query-services/initiatives.query-service');
vi.mock('@services/query-services/people.query-service');

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  chakra: (v) => v,
  ChakraProvider: ({ children }) => children,
  Stack: ({ children, ...props }) => (
    <div
      data-testid='stack'
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
  ),
  HStack: ({ children, ...props }) => (
    <div
      data-testid='hstack'
      {...props}
    >
      {children}
    </div>
  ),
  Text: ({ children, ...props }) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }) => <div {...props}>{children}</div>,
  Icon: () => null,
  IconButton: () => null,
  Spacer: () => null,
  Divider: () => null,
  Show: ({ children }) => <div>{children}</div>,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Center: ({ children }) => <div>{children}</div>,
  Spinner: () => <div role='progressbar'>Loading...</div>,
  useBreakpointValue: () => false,
  Flex: ({ children, ...props }) => (
    <div
      data-testid='flex'
      {...props}
    >
      {children}
    </div>
  ),
  Skeleton: ({ children, ...props }) => (
    <div
      data-testid='skeleton'
      role='progressbar'
      {...props}
    >
      {children}
    </div>
  ),
  SkeletonText: ({ children, ...props }) => (
    <div
      data-testid='skeleton-text'
      role='progressbar'
      {...props}
    >
      {children}
    </div>
  ),
  Container: ({ children, ...props }) => <div {...props}>{children}</div>,
  Grid: ({ children, ...props }) => <div {...props}>{children}</div>,
  GridItem: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Menu: ({ children }) => <div>{children}</div>,
  MenuButton: ({ children }) => <div>{children}</div>,
  MenuList: ({ children }) => <div>{children}</div>,
  MenuItem: ({ children }) => <div>{children}</div>,
  Tooltip: ({ children }) => <div>{children}</div>,
  Alert: ({ children }) => <div>{children}</div>
}));

const mockUser = {
  id: 'test-user',
  name: 'Test User',
  email: 'test@example.com',
  first_name: 'Test'
};

const mockCreator = {
  id: 'test-creator',
  name: 'Test Creator',
  email: 'creator@example.com'
};

const mockInsight = {
  id: 'test-insight-id',
  headline: 'Test Headline',
  subheadline: 'Test Subheadline',
  updated_at: new Date('2024-01-15T12:00:00Z'),
  person: { id: 'test-user-id' },
  lens: { id: 'test-lens-id', title: 'Test Lens' },
  initiative: { id: 'test-initiative-id', type: 'Lens', title: 'Test Lens' },
  sections: [
    {
      type: 'intro',
      title: 'Introduction',
      content: 'Test intro content'
    },
    {
      type: 'main_content',
      title: 'Main Content',
      content: 'Test main content'
    },
    {
      type: 'conclusion',
      title: 'Conclusion',
      content: 'Test conclusion content'
    }
  ]
};

describe('LensInsightPage', () => {
  let queryClient;

  beforeEach(() => {
    checkGateMock.mockReturnValue(true);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    // Reset all mocks
    vi.clearAllMocks();

    // Mock the store hooks with default values
    useRefStore.mockImplementation(() => ({
      agendaMainRef: { current: document.createElement('div') }
    }));

    useUserStore.mockImplementation(() => ({
      user: mockUser,
      setScrollPosition: vi.fn(),
      getScrollPosition: vi.fn()
    }));

    // Setup default mocks
    useNavigate.mockReturnValue(vi.fn());
    useParams.mockReturnValue({ insightId: 'test-insight' });
    vi.mocked(useBreakpointValue).mockReturnValue(false);
    vi.mocked(useInsightWithFootnotes).mockReturnValue({
      data: mockInsight,
      isLoading: false,
      refetch: vi.fn()
    });
    vi.mocked(useInitiativeById).mockReturnValue({
      data: mockInsight.lens,
      isLoading: false
    });
    vi.mocked(usePersonById).mockReturnValue({
      data: mockCreator,
      isLoading: false
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LensInsightPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders loading state', () => {
    vi.mocked(useInsightWithFootnotes).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    });
    renderComponent();
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders insight content when loaded', () => {
    renderComponent();
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
    expect(screen.getByText('Test Lens')).toBeInTheDocument();
  });

  it('renders insight sections correctly', () => {
    renderComponent();
    const sections = screen.getAllByTestId('lens-insight-section');
    expect(sections).toHaveLength(3);
    expect(sections[0]).toHaveTextContent('Test intro content');
    expect(sections[1]).toHaveTextContent('Test main content');
    expect(sections[2]).toHaveTextContent('Test conclusion content');
  });

  it('renders all required components', () => {
    renderComponent();
    // Check for the main stack container with specific attributes
    const mainStack = screen
      .getAllByTestId('stack')
      .find(
        (element) => element.getAttribute('gap') === '11' && element.getAttribute('p') === '11'
      );
    expect(mainStack).toBeTruthy();
    expect(screen.getAllByTestId('stack')).toHaveLength(7);
    expect(screen.getByTestId('insight-metadata')).toBeInTheDocument();
    expect(screen.getByTestId('about-this-lens')).toBeInTheDocument();
  });

  it('does not render share button if insight-sharing flag is disabled', () => {
    const { rerender } = renderComponent();
    expect(screen.getByText('Share')).toBeInTheDocument();

    checkGateMock.mockReturnValue(false);
    rerender();
    expect(screen.queryByText('Share')).not.toBeInTheDocument();
  });
});
