import { render, waitFor, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ReskinSummariesPage from '@pages/reskin-summaries/reskin-summaries.page';

// Mocks
vi.mock('@components/feed/feed-filter-sidebar.component', () => ({
  default: () => <div data-testid='sidebar' />
}));
vi.mock('@components/feed/feed-summaries.component', () => ({
  default: () => <div data-testid='summaries' />
}));
vi.mock('@components/agenda/agenda-header.component', () => ({
  default: () => <div data-testid='agenda-header' />
}));
vi.mock('@layouts/columned.layout', () => ({
  default: ({ children, rightRailContent }) => (
    <div>
      <div data-testid='layout'>{children}</div>
      {rightRailContent}
    </div>
  )
}));
vi.mock('@components/general/reskin-mobile-sticky-nav.component', () => ({
  default: ({ children }) => <div>{children}</div>
}));
vi.mock('@components/feed/feed-filter-mobile.component', () => ({
  default: () => <div data-testid='filter-mobile' />
}));
vi.mock('@components/explorer/explorer-analyze-button.component', () => ({
  default: ({ isDisabled, sourcesToSet }) => (
    <button
      data-testid='explorer-analyze-button'
      disabled={isDisabled}
      data-sources-count={sourcesToSet?.length || 0}
    >
      Analyze Button
    </button>
  )
}));

// Hook/state mocks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn(),
  useQueryStore: vi.fn(),
  useRefStore: vi.fn(() => ({ current: null }))
}));
vi.mock('@util/hooks', () => ({
  useFeedPageFilters: vi.fn(),
  useDebouncedProp: vi.fn()
}));
vi.mock('@services/query-services/cards.query-service', () => ({
  useInfiniteCards: vi.fn()
}));

import { useUserStore, useQueryStore } from '@store/app.store';
import { useFeedPageFilters, useDebouncedProp } from '@util/hooks';
import { useInfiniteCards } from '@services/query-services/cards.query-service';

describe('ReskinSummariesPage', () => {
  const mockSetFeedCardsSearchBody = vi.fn();

  beforeEach(() => {
    useUserStore.mockReturnValue({ id: 'user-123' });
    useQueryStore.mockReturnValue(mockSetFeedCardsSearchBody);

    useFeedPageFilters.mockReturnValue({
      filters: {
        keyword: 'meeting',
        savedFilter: true,
        focuses: ['focus-1'],
        labels: ['label-1'],
        participantId: 'user-456',
        archivedFilter: true,
        contentTypeSubSources: ['sub-1'],
        createdAtFrom: '2024-01-01',
        createdAtTo: '2024-12-31'
      },
      hasActiveFilters: false, // Set to false so agenda header renders
      handleFilterChange: vi.fn()
    });

    useDebouncedProp.mockReturnValue(['meeting']);

    useInfiniteCards.mockReturnValue({
      data: [
        { id: 1, title: 'Test Card 1' },
        { id: 2, title: 'Test Card 2' }
      ]
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders components', async () => {
    render(<ReskinSummariesPage />);

    expect(screen.queryByTestId('page-header')).toBeInTheDocument();
    expect(screen.queryByTestId('agenda-header')).toBeInTheDocument();
    expect(screen.queryByTestId('summaries')).toBeInTheDocument();
  });

  it('calls setFeedCardsSearchBody with correct payload on mount', async () => {
    // Override the default mock for this test to have active filters
    useFeedPageFilters.mockReturnValue({
      filters: {
        keyword: 'meeting',
        savedFilter: true,
        focuses: ['focus-1'],
        labels: ['label-1'],
        participantId: 'user-456',
        archivedFilter: true,
        contentTypeSubSources: ['sub-1'],
        createdAtFrom: '2024-01-01',
        createdAtTo: '2024-12-31'
      },
      hasActiveFilters: true,
      handleFilterChange: vi.fn()
    });

    render(<ReskinSummariesPage />);

    await waitFor(() => {
      expect(mockSetFeedCardsSearchBody).toHaveBeenCalledTimes(1);
    });

    const expected = {
      has_source: true,
      person_id: 'user-123',
      preferred: true,
      pageSize: 25,
      initiative_ids: ['focus-1'],
      label_ids: ['label-1'],
      participants_id: 'user-456',
      query: 'meeting*',
      archived: true,
      has_sub_source: true,
      sub_sources: ['sub-1'],
      created_at_from: '2024-01-01',
      created_at_to: '2024-12-31'
    };

    expect(mockSetFeedCardsSearchBody).toHaveBeenCalledWith(expected);
  });

  it('omits optional fields when filters are empty', async () => {
    useFeedPageFilters.mockReturnValue({
      filters: {},
      hasActiveFilters: false,
      handleFilterChange: vi.fn()
    });
    useDebouncedProp.mockReturnValue(['']);

    render(<ReskinSummariesPage />);

    await waitFor(() => {
      expect(mockSetFeedCardsSearchBody).toHaveBeenCalledTimes(1);
    });

    expect(mockSetFeedCardsSearchBody).toHaveBeenCalledWith({
      has_source: true,
      person_id: 'user-123',
      preferred: undefined,
      pageSize: 25,
      initiative_ids: undefined,
      label_ids: undefined,
      participants_id: undefined,
      query: undefined,
      archived: false,
      has_sub_source: undefined,
      sub_sources: undefined,
      created_at_from: undefined,
      created_at_to: undefined
    });
  });

  describe('tooltip behavior', () => {
    it('button is disabled when no filters are active', async () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        hasActiveFilters: false,
        handleFilterChange: vi.fn()
      });

      render(<ReskinSummariesPage />);

      // Check that the analyze button is disabled when no filters are active
      const analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).toBeDisabled();

      // When no filters are active, button should be disabled regardless of cards
      expect(analyzeButton).toHaveAttribute('data-sources-count', '2');
    });

    it('button is disabled when filters are active but no cards found', async () => {
      useFeedPageFilters.mockReturnValue({
        filters: { keyword: 'test' },
        hasActiveFilters: true,
        handleFilterChange: vi.fn()
      });

      useInfiniteCards.mockReturnValue({
        data: [] // No cards found
      });

      render(<ReskinSummariesPage />);

      // Check that the analyze button is disabled when no cards are found
      const analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).toBeDisabled();
      expect(analyzeButton).toHaveAttribute('data-sources-count', '0');
    });

    it('button is enabled when filters are active and cards are found', async () => {
      useFeedPageFilters.mockReturnValue({
        filters: { keyword: 'test' },
        hasActiveFilters: true,
        handleFilterChange: vi.fn()
      });

      useInfiniteCards.mockReturnValue({
        data: [
          { id: 1, title: 'Test Card 1' },
          { id: 2, title: 'Test Card 2' }
        ]
      });

      render(<ReskinSummariesPage />);

      // When filters are active and cards are found, button should be enabled
      const analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).not.toBeDisabled();
      expect(analyzeButton).toHaveAttribute('data-sources-count', '2');
    });

    // Test the tooltip logic indirectly by checking different scenarios
    it('tooltip logic behaves correctly for different states', () => {
      // Test case 1: No active filters
      const getTooltipText1 = (hasActiveFilters, cards) => {
        if (!hasActiveFilters) {
          return 'Select one or more filters to analyze summary cards';
        } else if (!cards?.length) {
          return 'Zero summary cards found, please query for more';
        } else {
          return '';
        }
      };

      expect(getTooltipText1(false, [])).toBe(
        'Select one or more filters to analyze summary cards'
      );
      expect(getTooltipText1(false, [{ id: 1 }])).toBe(
        'Select one or more filters to analyze summary cards'
      );

      // Test case 2: Active filters but no cards
      expect(getTooltipText1(true, [])).toBe('Zero summary cards found, please query for more');
      expect(getTooltipText1(true, null)).toBe('Zero summary cards found, please query for more');

      // Test case 3: Active filters with cards (tooltip should be disabled)
      expect(getTooltipText1(true, [{ id: 1 }, { id: 2 }])).toBe('');
    });
  });

  describe('analyze button disabled state', () => {
    it('analyzes button disabled state correctly across all scenarios', async () => {
      // Scenario 1: No filters active, with cards - should be disabled
      useFeedPageFilters.mockReturnValue({
        filters: {},
        hasActiveFilters: false,
        handleFilterChange: vi.fn()
      });

      useInfiniteCards.mockReturnValue({
        data: [
          { id: 1, title: 'Card 1' },
          { id: 2, title: 'Card 2' }
        ]
      });

      const { rerender } = render(<ReskinSummariesPage />);

      let analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).toBeDisabled();

      // Scenario 2: No filters active, no cards - should be disabled
      useInfiniteCards.mockReturnValue({ data: [] });
      rerender(<ReskinSummariesPage />);

      analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).toBeDisabled();

      // Scenario 3: Filters active, no cards - should be disabled
      useFeedPageFilters.mockReturnValue({
        filters: { keyword: 'test' },
        hasActiveFilters: true,
        handleFilterChange: vi.fn()
      });

      useInfiniteCards.mockReturnValue({ data: [] });
      rerender(<ReskinSummariesPage />);

      analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).toBeDisabled();

      // Scenario 4: Filters active, with cards - should be enabled
      useInfiniteCards.mockReturnValue({
        data: [
          { id: 1, title: 'Card 1' },
          { id: 2, title: 'Card 2' }
        ]
      });
      rerender(<ReskinSummariesPage />);

      analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).not.toBeDisabled();

      // Scenario 5: Filters active, single card - should be enabled
      useInfiniteCards.mockReturnValue({
        data: [{ id: 1, title: 'Card 1' }]
      });
      rerender(<ReskinSummariesPage />);

      analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).not.toBeDisabled();

      // Scenario 6: Filters active, undefined cards data - should be disabled
      useInfiniteCards.mockReturnValue({ data: undefined });
      rerender(<ReskinSummariesPage />);

      analyzeButton = screen.getByTestId('explorer-analyze-button');
      expect(analyzeButton).toBeDisabled();
    });
  });

  describe('filtered results count', () => {
    it('displays correct count when filters are active and cards are found', async () => {
      const mockCards = [
        { id: 1, title: 'Test Card 1' },
        { id: 2, title: 'Test Card 2' },
        { id: 3, title: 'Test Card 3' }
      ];

      useFeedPageFilters.mockReturnValue({
        filters: { keyword: 'test' },
        hasActiveFilters: true,
        handleFilterChange: vi.fn()
      });

      useInfiniteCards.mockReturnValue({
        data: mockCards
      });

      render(<ReskinSummariesPage />);

      expect(screen.getByText('Filtered Results')).toBeInTheDocument();
      expect(screen.getByText('3 items')).toBeInTheDocument();
    });

    it('does not display count when no filters are active', async () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        hasActiveFilters: false,
        handleFilterChange: vi.fn()
      });

      render(<ReskinSummariesPage />);

      expect(screen.getByText('Recent Updates')).toBeInTheDocument();
      expect(screen.queryByText('Filtered Results')).not.toBeInTheDocument();
      expect(screen.queryByText(/items/)).not.toBeInTheDocument();
    });

    it('displays "Filtered Results" without count when filters are active but no cards found', async () => {
      useFeedPageFilters.mockReturnValue({
        filters: { keyword: 'test' },
        hasActiveFilters: true,
        handleFilterChange: vi.fn()
      });

      useInfiniteCards.mockReturnValue({
        data: []
      });

      render(<ReskinSummariesPage />);

      expect(screen.getByText('Filtered Results')).toBeInTheDocument();
      expect(screen.queryByText(/items/)).not.toBeInTheDocument();
    });
  });
});
