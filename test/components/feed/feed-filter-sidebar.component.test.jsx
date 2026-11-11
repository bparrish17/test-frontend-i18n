import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { useFeedPageFilters } from '@util/hooks';
import { useUserStore } from '@store/app.store';
import FeedFilterSidebar from '@components/feed/feed-filter-sidebar.component';

// Mock child components
vi.mock('@components/feed/feed-filter-accordion.component', () => ({
  default: ({ tab }) => <div data-testid='accordion'>Accordion - {tab}</div>
}));

vi.mock('@components/feed/feed-filter-tabs.component', () => ({
  default: ({ tab }) => <div data-testid='tabs'>Tabs - {tab}</div>
}));

vi.mock('@util/hooks', () => ({
  useFeedPageFilters: vi.fn()
}));

vi.mock('@store/app.store');

describe('FeedFilterSidebar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: false });
    });

    it('renders without crashing and displays filter header and child components', () => {
      useFeedPageFilters.mockReturnValue({
        hasActiveFilters: false,
        handleResetFilters: vi.fn()
      });

      render(<FeedFilterSidebar tab='someTab' />);

      expect(screen.getByText('Filter by')).toBeInTheDocument();
      expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
      expect(screen.getByTestId('tabs')).toHaveTextContent('Tabs - someTab');
      expect(screen.getByTestId('accordion')).toHaveTextContent('Accordion - someTab');
    });

    it('displays "Clear Filters" when there are active filters', () => {
      useFeedPageFilters.mockReturnValue({
        hasActiveFilters: true,
        handleResetFilters: vi.fn()
      });

      render(<FeedFilterSidebar tab='someTab' />);
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('calls handleResetFilters when "Clear Filters" is clicked', () => {
      const mockReset = vi.fn();
      useFeedPageFilters.mockReturnValue({
        hasActiveFilters: true,
        handleResetFilters: mockReset
      });

      render(<FeedFilterSidebar tab='someTab' />);
      fireEvent.click(screen.getByText('Clear Filters'));
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('guest user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: true });
    });

    it('hides the FeedFilterTabs component', () => {
      useFeedPageFilters.mockReturnValue({
        hasActiveFilters: false,
        handleResetFilters: vi.fn()
      });

      render(<FeedFilterSidebar tab='someTab' />);

      expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
    });
  });
});
