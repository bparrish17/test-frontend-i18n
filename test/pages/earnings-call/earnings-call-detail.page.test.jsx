import { render, screen } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import { vi } from 'vitest';
import { createRef } from 'react';

import { useBotById } from '@services/query-services/bots.query-service';
import { useCardById, useCards } from '@services/query-services/cards.query-service';
import { useSetDocumentTitle, useTopicGroupsAndSummaries } from '@util/hooks';
import EarningsCallDetailPage from '@pages/earnings-call/earnings-call-detail.page';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: vi.fn()
}));

vi.mock('@services/query-services/bots.query-service', () => ({
  useBotById: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardById: vi.fn(),
  useCards: vi.fn(),
  useShareCard: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useSetDocumentTitle: vi.fn(),
  useTopicGroupsAndSummaries: vi.fn().mockReturnValue({
    topicGroups: [],
    ungroupedSummaries: []
  }),
  useListRefs: vi.fn().mockReturnValue({
    refs: { current: [createRef(), createRef(), createRef()] },
    closestRef: 0,
    getRef: vi.fn(),
    handleScrollToRef: vi.fn(),
    getClosestRefIndex: vi.fn()
  }),
  useStyledToast: vi.fn().mockReturnValue({ toast: vi.fn() }),
  useDocumentScrollListener: vi.fn()
}));

vi.mock('@layouts/columned.layout', () => ({
  default: ({ children, rightRailContent }) => (
    <div data-testid='columned-layout'>
      {children}
      {rightRailContent && <div data-testid='right-rail'>{rightRailContent}</div>}
    </div>
  )
}));

vi.mock('@pages/meeting/skeleton.component', () => ({
  default: () => <div data-testid='meeting-page-skeleton'>Loading...</div>
}));

vi.mock('@pages/earnings-call/earnings-call-right-rail.component', () => ({
  default: () => <div data-testid='earnings-call-right-rail'>Right Rail Content</div>
}));

vi.mock('@pages/earnings-call/earnings-call-header-card.component', () => ({
  default: () => <div data-testid='earnings-call-header-card'>Header Card</div>
}));

vi.mock('@components/meeting/meeting-summary.component', () => ({
  default: ({ card }) => <div data-testid='meeting-summary'>{card?.headline}</div>
}));

vi.mock('@components/meeting/topics.component', () => ({
  default: () => <div data-testid='topics'>Topics</div>
}));

vi.mock('@components/meeting/relevant-lenses.component', () => ({
  default: () => <div data-testid='relevant-lenses'>Relevant Lenses</div>
}));

vi.mock('@components/meeting/timeline.component', () => ({
  default: () => <div data-testid='timeline'>Timeline</div>
}));

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    Alert: ({ children }) => <div data-testid='alert'>{children}</div>,
    AlertIcon: () => <div data-testid='alert-icon'></div>,
    AlertTitle: ({ children }) => <div data-testid='alert-title'>{children}</div>,
    AlertDescription: ({ children }) => <div data-testid='alert-description'>{children}</div>
  };
});

vi.mock('@components/meeting/section-header.component', () => ({
  default: ({ headline }) => <div data-testid='section-header'>{headline}</div>
}));

describe('EarningsCallDetailPage', () => {
  const fakeQueryRes = (args = {}) => ({ data: null, isLoading: false, isError: false, ...args });
  const mockCard = {
    id: '1234',
    headline: 'Widgets Inc. is Selling a lot of Widgets',
    source_data: {
      id: 'earnings-call-source-id',
      title: 'Widgets Inc. Q4 2024 Earnings Call (WIG)'
    }
  };
  const mockBot = {
    id: '5678',
    earnings_call: {
      company_name: 'Widgets Inc.',
      symbol: 'WIG',
      year: 2024,
      quarter: 4,
      released_at: 1709089200000
    }
  };

  const returnFocusCard = () =>
    useCards.mockReturnValue(fakeQueryRes({ data: { focusCard: mockCard } }));

  const renderWithProviders = () =>
    render(
      <BrowserRouter>
        <EarningsCallDetailPage />
      </BrowserRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    useCards.mockReturnValue({ data: [] });
  });

  it('should render a loading state when the card is loading', () => {
    useParams.mockReturnValue({ botId: '1234' });
    useBotById.mockReturnValue(fakeQueryRes());
    useCards.mockReturnValue(fakeQueryRes({ isLoading: true }));
    renderWithProviders();
    expect(screen.getByTestId('meeting-page-skeleton')).toBeInTheDocument();
  });

  it('should render a loading state when the bot is loading', () => {
    useParams.mockReturnValue({ earningsCallId: '1234' });
    useBotById.mockReturnValue(fakeQueryRes({ isLoading: true }));
    renderWithProviders();
    expect(screen.getByTestId('meeting-page-skeleton')).toBeInTheDocument();
  });

  it('should set document title with earnings call card data', () => {
    returnFocusCard();
    renderWithProviders();
    expect(useSetDocumentTitle).toHaveBeenCalledWith(`${mockCard?.source_data?.title} - FORA`);
  });

  it('should render an error state with access denied message if cards fail to load with 401 error', () => {
    useCards.mockReturnValue(
      fakeQueryRes({
        isError: true,
        error: { response: { status: 401 } }
      })
    );
    renderWithProviders();
    expect(screen.getByTestId('columned-layout')).toBeInTheDocument();
    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText("You don't have access to this earnings call")).toBeInTheDocument();
  });

  it('should render the earnings call details in a columned layout', () => {
    useBotById.mockReturnValue(fakeQueryRes({ data: mockBot }));
    returnFocusCard();
    renderWithProviders();
    expect(screen.getByTestId('columned-layout')).toBeInTheDocument();
  });

  it('should render the right rail section', () => {
    useBotById.mockReturnValue(fakeQueryRes({ data: mockBot }));
    returnFocusCard();
    renderWithProviders();
    expect(screen.getByTestId('right-rail')).toBeInTheDocument();
    expect(screen.getByText('Right Rail Content')).toBeInTheDocument();
  });

  it('should render the earnings call header card', () => {
    useBotById.mockReturnValue(fakeQueryRes({ data: mockBot }));
    returnFocusCard();
    renderWithProviders();
    expect(screen.getByTestId('earnings-call-header-card')).toBeInTheDocument();
    expect(screen.getByText('Header Card')).toBeInTheDocument();
  });

  it('should render the summary, topics, and timeline sections', () => {
    useBotById.mockReturnValue(fakeQueryRes({ data: mockBot }));
    returnFocusCard();
    useTopicGroupsAndSummaries.mockReturnValue({
      topicGroups: [{ id: 'group1', topics: [{ id: 'topic1', text: 'Topic 1' }] }],
      ungroupedSummaries: []
    });
    renderWithProviders();
    expect(useTopicGroupsAndSummaries).toHaveBeenCalledWith(
      expect.objectContaining({ start_at: mockBot?.created_at, id: expect.any(Number) }),
      mockBot
    );
    expect(screen.getByTestId('meeting-summary')).toBeInTheDocument();
    expect(screen.getByTestId('topics')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
  });

  it('should render the "Insights from Lenses" section if Lens cards exist', () => {
    useCards.mockReturnValue({ data: { focusCard: mockCard, lensCards: [mockCard, mockCard] } });
    useBotById.mockReturnValue(fakeQueryRes({ data: mockBot }));
    renderWithProviders();
    expect(screen.getByTestId('relevant-lenses')).toBeInTheDocument();
  });

  it('should not render the "Insights from Lenses" section if no Lens cards available', () => {
    returnFocusCard();
    renderWithProviders();
    expect(screen.queryByTestId('relevant-lenses')).not.toBeInTheDocument();
  });
});
