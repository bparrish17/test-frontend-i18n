import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useUserStore } from '@store/app.store';
import { useCardActions, useSetDocumentTitle, useFeedPageFilters } from '@util/hooks';
import { getSummaryObject } from '@util/helpers';
import { useInfiniteCards } from '@services/query-services/cards.query-service';
import { useInfiniteMeetings } from '@services/query-services/meetings.query-service';
import { renderWithProviders } from '@test/test.helpers';

import FeedSummaries from '@components/feed/feed-summaries.component';

// Mocks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCardActions: vi.fn(),
  useSetDocumentTitle: vi.fn(),
  useFeedPageFilters: vi.fn()
}));

vi.mock('@util/helpers', async (importActual) => ({
  ...(await importActual()),
  getSummaryObject: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useInfiniteCards: vi.fn()
}));

vi.mock('@services/query-services/meetings.query-service', () => ({
  useInfiniteMeetings: vi.fn()
}));

vi.mock('@components/feed/feed-scroll-container.component', () => ({
  default: ({ children, infiniteQueryResult, noResultsText, loadingSkeleton, ...props }) => (
    <div
      data-testid='feed-scroll-container'
      {...props}
    >
      {infiniteQueryResult?.data?.pages?.map((page, pageIndex) => children(page, pageIndex))}
      {!infiniteQueryResult?.data?.pages?.length && (
        <div data-testid='loading'>{loadingSkeleton}</div>
      )}
      {infiniteQueryResult?.data?.pages?.length === 0 && (
        <div data-testid='no-results'>{noResultsText}</div>
      )}
    </div>
  )
}));

vi.mock('@components/general/card/summary-card/summary-card-skeleton.component', () => ({
  default: () => <div data-testid='summary-card-skeleton' />
}));

vi.mock('@components/general/card/reskin-summary-card/reskin-summary-card.component', () => ({
  default: ({ card, onCardActionClick, enableLabels, showFooter, ...props }) => (
    <div
      data-testid='reskin-summary-card'
      data-card-id={card?.id}
      data-enable-labels={enableLabels}
      data-show-footer={showFooter}
      {...props}
    >
      {card?.headline || card?.title}
    </div>
  )
}));

describe('FeedSummaries Component', () => {
  const mockUser = { id: 'user-123' };
  const mockCardSearchBody = { query: 'test' };
  const mockOnCardActionClick = vi.fn();
  const mockHandleFilterChange = vi.fn();

  const mockCardData = {
    data: [
      { id: '1', headline: 'Test Card 1' },
      { id: '2', headline: 'Test Card 2' }
    ]
  };

  const mockMeetingData = {
    data: [
      { id: 'meeting-1', title: 'Test Meeting 1' },
      { id: 'meeting-2', title: 'Test Meeting 2' }
    ]
  };

  beforeEach(() => {
    useUserStore.mockReturnValue(mockUser);
    useCardActions.mockReturnValue(mockOnCardActionClick);
    useSetDocumentTitle.mockImplementation(() => {});
    useFeedPageFilters.mockReturnValue({
      filters: {},
      handleFilterChange: mockHandleFilterChange
    });
    useInfiniteCards.mockReturnValue({
      data: { pages: [mockCardData] },
      isLoading: false
    });
    useInfiniteMeetings.mockReturnValue({
      data: { pages: [mockMeetingData] },
      isLoading: false
    });
    getSummaryObject.mockImplementation((obj) => obj);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderFeedSummaries = (props = {}) => {
    return renderWithProviders(
      <FeedSummaries
        cardSearchBody={mockCardSearchBody}
        noResultsText='No results found'
        {...props}
      />
    );
  };

  it('sets document title on mount', () => {
    renderFeedSummaries();
    expect(useSetDocumentTitle).toHaveBeenCalledWith('Summaries - FORA');
  });

  it('calls useInfiniteCards with correct parameters when user is present', () => {
    renderFeedSummaries();

    expect(useInfiniteCards).toHaveBeenCalledWith(mockCardSearchBody, {
      enabled: true,
      refetchOnMount: false
    });
  });

  it('disables useInfiniteCards when user is not present', () => {
    useUserStore.mockReturnValue({ id: null });
    renderFeedSummaries();

    expect(useInfiniteCards).toHaveBeenCalledWith(mockCardSearchBody, {
      enabled: false,
      refetchOnMount: false
    });
  });

  it('calls useInfiniteMeetings when sharedFilter is enabled', () => {
    useFeedPageFilters.mockReturnValue({
      filters: { sharedFilter: true },
      handleFilterChange: mockHandleFilterChange
    });

    renderFeedSummaries();

    expect(useInfiniteMeetings).toHaveBeenCalledWith(
      { shared_with_me: true },
      {
        enabled: true,
        refetchOnMount: false
      }
    );
  });

  it('disables useInfiniteMeetings when sharedFilter is false', () => {
    useFeedPageFilters.mockReturnValue({
      filters: { sharedFilter: false },
      handleFilterChange: mockHandleFilterChange
    });

    renderFeedSummaries();

    expect(useInfiniteMeetings).toHaveBeenCalledWith(
      { shared_with_me: true },
      {
        enabled: false,
        refetchOnMount: false
      }
    );
  });

  it('renders cards from useInfiniteCards when sharedFilter is not active', () => {
    renderFeedSummaries();

    expect(screen.getByTestId('feed-scroll-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('reskin-summary-card')).toHaveLength(2);
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    expect(screen.getByText('Test Card 2')).toBeInTheDocument();
  });

  it('renders meetings from useInfiniteMeetings when sharedFilter is active', () => {
    useFeedPageFilters.mockReturnValue({
      filters: { sharedFilter: true },
      handleFilterChange: mockHandleFilterChange
    });

    getSummaryObject.mockImplementation((obj, isShared) =>
      isShared ? { id: obj.id, headline: obj.title } : obj
    );

    renderFeedSummaries();

    expect(screen.getByTestId('feed-scroll-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('reskin-summary-card')).toHaveLength(2);

    expect(screen.getByText('Test Meeting 1')).toBeInTheDocument();
    expect(screen.getByText('Test Meeting 2')).toBeInTheDocument();
  });

  it('calls getSummaryObject with correct parameters', () => {
    renderFeedSummaries();

    expect(getSummaryObject).toHaveBeenCalledWith({ id: '1', headline: 'Test Card 1' }, undefined);
    expect(getSummaryObject).toHaveBeenCalledWith({ id: '2', headline: 'Test Card 2' }, undefined);
  });

  it('calls getSummaryObject with sharedFilter flag when shared filter is active', () => {
    useFeedPageFilters.mockReturnValue({
      filters: { sharedFilter: true },
      handleFilterChange: mockHandleFilterChange
    });

    renderFeedSummaries();

    expect(getSummaryObject).toHaveBeenCalledWith(expect.any(Object), true);
  });

  it('passes correct props to ReskinSummaryCard when not in shared mode', () => {
    renderFeedSummaries();

    const cards = screen.getAllByTestId('reskin-summary-card');
    expect(cards[0]).toHaveAttribute('data-enable-labels', 'true');
    expect(cards[0]).toHaveAttribute('data-show-footer', 'true');
  });

  it('passes correct props to ReskinSummaryCard when in shared mode', () => {
    useFeedPageFilters.mockReturnValue({
      filters: { sharedFilter: true },
      handleFilterChange: mockHandleFilterChange
    });

    renderFeedSummaries();

    const cards = screen.getAllByTestId('reskin-summary-card');
    expect(cards[0]).toHaveAttribute('data-enable-labels', 'false');
    expect(cards[0]).toHaveAttribute('data-show-footer', 'false');
  });

  it('passes through additional props to FeedScrollContainer', () => {
    // override data-testid of FeedScrollContainer
    renderFeedSummaries({ 'data-testid': 'custom-test-id' });

    const container = screen.getByTestId('custom-test-id');
    expect(container).toBeInTheDocument();
  });

  it('passes cardProps to ReskinSummaryCard', () => {
    renderFeedSummaries({ cardProps: { 'data-custom': 'value' } });

    const cards = screen.getAllByTestId('reskin-summary-card');
    expect(cards[0]).toHaveAttribute('data-custom', 'value');
  });

  it('has correct data-id attribute', () => {
    renderFeedSummaries();

    const container = screen.getByTestId('feed-scroll-container');
    expect(container).toHaveAttribute('data-id', 'FeedSummaries');
  });

  it('sets up card actions with correct parameters', () => {
    renderFeedSummaries();

    expect(useCardActions).toHaveBeenCalledWith({
      type: 'infinite',
      queryKeyToUpdate: mockCardSearchBody
    });
  });
});
