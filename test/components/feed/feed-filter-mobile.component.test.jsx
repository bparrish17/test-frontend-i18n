import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { useUserStore } from '@store/app.store';
import { useFeedPageFilters } from '@util/hooks';
import FeedFilterMobile from '@components/feed/feed-filter-mobile.component';

// Mock child components
vi.mock('@components/feed/feed-filter-tabs.component', () => ({
  default: ({ tab }) => <div data-testid='tabs'>Tabs - {tab}</div>
}));

vi.mock('@components/feed/feed-filter-accordion.component', () => ({
  default: ({ tab }) => <div data-testid='accordion'>Accordion - {tab}</div>
}));

// Mock user store
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

// Mock custom hooks
vi.mock('@util/hooks', () => ({
  useFeedPageFilters: vi.fn()
}));

describe('FeedFilterMobile', () => {
  const mockResetFilters = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = ({ isGuest = false, hasActiveFilters = false, tab = 'someTab' } = {}) => {
    useUserStore.mockReturnValue({ isGuest });
    useFeedPageFilters.mockReturnValue({
      hasActiveFilters,
      handleResetFilters: mockResetFilters
    });

    const setIsSelectingFilters = vi.fn();
    render(
      <FeedFilterMobile
        setIsSelectingFilters={setIsSelectingFilters}
        tab={tab}
      />
    );
    return { setIsSelectingFilters };
  };

  it('renders the header and child components', () => {
    setup();
    expect(screen.getByText('FILTER OPTIONS')).toBeInTheDocument();
    expect(screen.getByTestId('tabs')).toHaveTextContent('Tabs - someTab');
    expect(screen.getByTestId('accordion')).toHaveTextContent('Accordion - someTab');
  });

  it('shows "Clear Filters" and "View Results" when filters are active', () => {
    setup({ hasActiveFilters: true });
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Results/i })).toBeInTheDocument();
  });

  it('does not show "Clear Filters" or "View Results" when no filters are active', () => {
    setup({ hasActiveFilters: false });
    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /View Results/i })).not.toBeInTheDocument();
  });

  it('calls handleResetFilters when "Clear Filters" is clicked', () => {
    setup({ hasActiveFilters: true });
    fireEvent.click(screen.getByText('Clear Filters'));
    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });

  it('calls setIsSelectingFilters(false) when "View Results" is clicked', () => {
    const { setIsSelectingFilters } = setup({ hasActiveFilters: true });
    fireEvent.click(screen.getByRole('button', { name: /View Results/i }));
    expect(setIsSelectingFilters).toHaveBeenCalledWith(false);
  });

  it('hides FeedFilterTabs when user is a guest', () => {
    setup({ isGuest: true });
    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
  });
});
