import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, beforeAll } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useMeetingPageState, useSetDocumentTitle } from '@util/hooks';
import MeetingPage from '@pages/meeting/meeting.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ChakraProvider } from '@chakra-ui/react';
import { useMeetingPageStore } from '@store/app.store';

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

const renderMeetingPage = () => {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <MeetingPage />
          </QueryParamProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

// Mock the essential hooks and components
vi.mock('@util/hooks', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useMeetingPageState: vi.fn(),
    useUpdateBotFromPusherEvent: vi.fn(),
    useSetDocumentTitle: vi.fn(),
    useProtectTenant: vi.fn()
  };
});

// Mock store
vi.mock('@store/app.store', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useMeetingPageStore: vi.fn(() => ({
      setVideoDisclosure: vi.fn()
    }))
  };
});

// Mock router
vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useParams: () => ({ meetingId: 'test-meeting-id' })
  };
});

// Mock Chakra components used in the page
vi.mock('@chakra-ui/react', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useDisclosure: () => ({
      isOpen: false,
      onOpen: vi.fn(),
      onClose: vi.fn()
    }),
    useBreakpointValue: () => false,
    Box: ({ children, ...props }) => <div {...props}>{children}</div>,
    HStack: ({ children, ...props }) => <div {...props}>{children}</div>,
    Show: ({ children, above, below }) => (
      <div data-testid={`show-${above || below}`}>{children}</div>
    ),
    StackDivider: () => <div data-testid='stack-divider' />
  };
});

describe('MeetingPage', () => {
  const mockMeetingState = {
    meeting: {
      id: 'test-meeting',
      title: 'Test Meeting'
    },
    bot: { id: 'bot-1' },
    isLoading: false,
    sections: {}
  };

  let setVideoDisclosureMock;

  beforeEach(() => {
    vi.clearAllMocks();
    useMeetingPageState.mockReturnValue(mockMeetingState);

    setVideoDisclosureMock = vi.fn();
    vi.mocked(useMeetingPageStore).mockImplementation((selector) => {
      const store = {
        setVideoDisclosure: setVideoDisclosureMock
      };
      return selector ? selector(store) : store;
    });
  });

  it('renders loading state and transitions to content', () => {
    // Set up with loading state
    useMeetingPageState.mockReturnValue({
      ...mockMeetingState,
      isLoading: true
    });

    renderMeetingPage();

    // Verify loading state
    expect(screen.getByText('Loading')).toBeInTheDocument();

    // Verify setVideoDisclosure was called
    expect(setVideoDisclosureMock).toHaveBeenCalled();

    // Update state to loaded
    useMeetingPageState.mockReturnValue(mockMeetingState);

    // Verify content is rendered
    expect(screen.getByTestId('show-1024px')).toBeInTheDocument();
  });

  it('updates document title and handles bot updates', () => {
    renderMeetingPage();

    expect(useSetDocumentTitle).toHaveBeenCalledWith('Test Meeting - FORA');
  });
});
