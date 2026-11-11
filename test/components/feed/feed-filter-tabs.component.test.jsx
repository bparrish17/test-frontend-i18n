import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';

import { useUserStore } from '@store/app.store';
import { useFeedPageFilters, useBreakpoints } from '@util/hooks';
import { useMediaQuery } from '@chakra-ui/react';

import FeedFilterTabs from '@components/feed/feed-filter-tabs.component';

// Mocks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMediaQuery: vi.fn()
  };
});

vi.mock('@util/hooks', () => ({
  useFeedPageFilters: vi.fn()
}));

describe('FeedFilterTabs', () => {
  const mockHandleFilterChange = vi.fn();

  beforeEach(() => {
    useUserStore.mockReturnValue({ id: 'user-123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('desktop (width > 1400px)', () => {
    beforeEach(() => {
      useMediaQuery.mockReturnValue([false]); // false: not small screen, so desktop
    });

    it('renders "All Summaries" as the default selected tab when no participantId filter is set', () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);

      const allTab = screen.getByTestId('all-summaries-tab');
      expect(allTab).toHaveAttribute('aria-selected', 'true');

      const yourTab = screen.getByTestId('your-summaries-tab');
      expect(yourTab).toHaveAttribute('aria-selected', 'false');

      const sharedTab = screen.getByTestId('shared-summaries-tab');
      expect(sharedTab).toHaveAttribute('aria-selected', 'false');
    });

    it('renders "Your Summaries" as selected when participantId is set', () => {
      useFeedPageFilters.mockReturnValue({
        filters: { participantId: 'user-123' },
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);

      const allTab = screen.getByTestId('all-summaries-tab');
      const yourTab = screen.getByTestId('your-summaries-tab');
      const sharedTab = screen.getByTestId('shared-summaries-tab');

      expect(yourTab).toHaveAttribute('aria-selected', 'true');
      expect(allTab).toHaveAttribute('aria-selected', 'false');
      expect(sharedTab).toHaveAttribute('aria-selected', 'false');
    });

    it('renders "Shared Summaries" as selected when sharedFilter is set', () => {
      useFeedPageFilters.mockReturnValue({
        filters: { sharedFilter: true },
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);

      const allTab = screen.getByTestId('all-summaries-tab');
      const yourTab = screen.getByTestId('your-summaries-tab');
      const sharedTab = screen.getByTestId('shared-summaries-tab');

      expect(yourTab).toHaveAttribute('aria-selected', 'false');
      expect(allTab).toHaveAttribute('aria-selected', 'false');
      expect(sharedTab).toHaveAttribute('aria-selected', 'true');
    });

    it('calls handleFilterChange with null when "All Summaries" is clicked', () => {
      useFeedPageFilters.mockReturnValue({
        filters: { participantId: 'user-123' },
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);
      fireEvent.click(screen.getByTestId('all-summaries-tab'));
      expect(mockHandleFilterChange).toHaveBeenCalledWith('participantId', null);
      expect(mockHandleFilterChange).toHaveBeenCalledWith('sharedFilter', null);
    });

    it('calls handleFilterChange with user ID when "Your Summaries" is clicked', () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);
      fireEvent.click(screen.getByTestId('your-summaries-tab'));
      expect(mockHandleFilterChange).toHaveBeenCalledWith('participantId', 'user-123');
      expect(mockHandleFilterChange).toHaveBeenCalledWith('sharedFilter', null);
    });

    it('sets participantId and sharedFilter when "Shared Summaries" is clicked', () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);
      fireEvent.click(screen.getByTestId('shared-summaries-tab'));
      expect(mockHandleFilterChange).toHaveBeenCalledWith('participantId', null);
      expect(mockHandleFilterChange).toHaveBeenCalledWith('sharedFilter', true);
    });
  });

  describe('small screen (width <= 1400px)', () => {
    beforeEach(() => {
      useMediaQuery.mockReturnValue([true]); // true: small screen
    });

    it('renders a dropdown with all tab options', () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        handleFilterChange: mockHandleFilterChange
      });

      render(<FeedFilterTabs />);
      const dropdown = screen.getByTestId('feed-filter-dropdown');
      expect(dropdown).toBeInTheDocument();

      const tabList = screen.queryByTestId('feed-filter-tabs');
      expect(tabList).not.toBeInTheDocument();

      const filterList = screen.queryByTestId('feed-filter-list');
      expect(filterList).toBeInTheDocument();

      // Should have all options as children of filterList
      expect(within(filterList).getByText('All Summaries')).toBeInTheDocument();
      expect(within(filterList).getByText('Your Summaries')).toBeInTheDocument();
      expect(within(filterList).getByText('Shared Summaries')).toBeInTheDocument();
    });

    it('selects the "Your Summaries" option based on filters', () => {
      useFeedPageFilters.mockReturnValue({
        filters: { participantId: 'user-123' },
        handleFilterChange: mockHandleFilterChange
      });
      render(<FeedFilterTabs />);
      const dropdownButton = screen.getByTestId('feed-filter-dropdown');
      expect(dropdownButton).toBeInTheDocument();
      expect(dropdownButton).toHaveTextContent('Your Summaries');
    });

    it('selects the "Shared Summaries" option based on filters', () => {
      useFeedPageFilters.mockReturnValue({
        filters: { sharedFilter: true },
        handleFilterChange: mockHandleFilterChange
      });
      render(<FeedFilterTabs />);
      const dropdownButton = screen.getByTestId('feed-filter-dropdown');
      expect(dropdownButton).toBeInTheDocument();
      expect(dropdownButton).toHaveTextContent('Shared Summaries');
    });

    it('calls handleFilterChange when selecting a Your Summaries option', () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        handleFilterChange: mockHandleFilterChange
      });
      render(<FeedFilterTabs />);
      const dropdownButton = screen.getByTestId('feed-filter-dropdown');
      fireEvent.click(dropdownButton);
      const filterList = screen.getByTestId('feed-filter-list');
      const sharedOption = within(filterList).getByText('Your Summaries');
      fireEvent.click(sharedOption);
      // Should call handleFilterChange for sharedFilter and participantId
      expect(mockHandleFilterChange).toHaveBeenCalledWith('participantId', 'user-123');
      expect(mockHandleFilterChange).toHaveBeenCalledWith('sharedFilter', null);
    });

    it('calls handleFilterChange when selecting a Shared Summaries option', () => {
      useFeedPageFilters.mockReturnValue({
        filters: {},
        handleFilterChange: mockHandleFilterChange
      });
      render(<FeedFilterTabs />);
      const dropdownButton = screen.getByTestId('feed-filter-dropdown');
      fireEvent.click(dropdownButton);

      const filterList = screen.getByTestId('feed-filter-list');
      const sharedOption = within(filterList).getByText('Shared Summaries');
      fireEvent.click(sharedOption);

      // Should call handleFilterChange for sharedFilter and participantId
      expect(mockHandleFilterChange).toHaveBeenCalledWith('participantId', null);
      expect(mockHandleFilterChange).toHaveBeenCalledWith('sharedFilter', true);
    });
  });
});
