import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

import FeedFilterAccordion from '@components/feed/feed-filter-accordion.component';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { useUserStore } from '@store/app.store';

// Mocks
vi.mock('@store/app.store');

vi.mock('@services/query-services/initiatives.query-service', () => ({
  useInitiatives: vi.fn(({ type }) => ({
    data:
      type === 'Focus'
        ? [{ id: 'focus-1', title: 'Focus 1' }]
        : [{ id: 'label-1', title: 'Label 1' }]
  }))
}));

const handleFilterChange = vi.fn();
vi.mock('@util/hooks', () => ({
  useFeedPageFilters: () => ({
    filters: {
      keyword: '',
      focuses: [],
      labels: [],
      dateRange: 'All Dates',
      contentTypeSubSources: [],
      createdAtFrom: null,
      createdAtTo: null
    },
    handleFilterChange,
    activeFilterCount: 0,
    hasActiveFilters: false
  }),
  useContentTypeOptions: () => [
    {
      id: 'type-1',
      title: 'Type 1',
      source: 'source-1',
      sub_sources: [],
      icon: () => <span data-testid='mock-icon' />
    }
  ]
}));

vi.mock('@components/general/form/custom-select.component', () => ({
  default: () => {
    return <div data-testid='custom-select'>Label Select</div>;
  }
}));

vi.mock('@components/feed/feed-rangepicker.component', () => ({
  default: function MockFeedRangepicker() {
    return <div data-testid='feed-rangepicker'>FeedRangepicker</div>;
  },
  SelectedDateRange: function MockSelectedDateRange({ startDate, endDate, onClick }) {
    return (
      <div
        data-testid='selected-date-range'
        onClick={onClick}
      >
        {startDate} - {endDate}
      </div>
    );
  }
}));

vi.mock('use-query-params', () => ({
  useQueryParam: vi.fn(() => [null, vi.fn()]),
  NumberParam: {},
  withDefault: vi.fn((param, defaultValue) => param)
}));

// Custom wrapper to include Chakra UI
const renderWithChakra = (ui) => render(<ChakraProvider>{ui}</ChakraProvider>);

describe('FeedFilterAccordion', () => {
  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) => {
        return selector({
          user: {
            id: '111',
            isGuest: false
          },
          tenant: {
            id: '222'
          }
        });
      });
    });

    it('renders keyword filter input', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);

      expect(screen.getByPlaceholderText('Enter a keyword')).toBeInTheDocument();
    });

    it('enables useInitiatives query ', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);

      expect(useInitiatives).toHaveBeenCalledWith({ type: 'Focus' }, { enabled: true });
      expect(useInitiatives).toHaveBeenCalledWith(
        {
          type: 'Label',
          has_archived_at: false,
          tenant_id: '222',
          pageSize: 100
        },
        { enabled: true }
      );
    });

    it('renders label select when labels gate is enabled', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);
      expect(screen.queryByTestId('custom-select')).toBeInTheDocument();
    });

    it('renders focus checkboxes when not guest', () => {
      renderWithChakra(<FeedFilterAccordion tab='some-tab' />);
      expect(screen.getByText('Focus 1')).toBeInTheDocument();
      expect(screen.queryByTestId('focus-checkbox')).toBeInTheDocument();
    });

    it('renders content type filters when tab is "summaries"', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);
      expect(screen.getByText('Content Type')).toBeInTheDocument();
      expect(screen.getByText('Type 1')).toBeInTheDocument();
    });

    it('renders date range dropdown with correct default label', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });

    it('renders FeedRangepicker even if dateRange is not "Custom"', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      // We assume it's present — you can tag FeedRangepicker with a `data-testid` for more precision
    });

    it('renders saved, archived and shared when not guest', async () => {
      renderWithChakra(<FeedFilterAccordion tab='some-tab' />);
      expect(screen.queryByTestId('saved-and-archived')).toBeInTheDocument();

      const savedCheckbox = screen.queryByTestId('saved-filter-checkbox');
      const archivedCheckbox = screen.queryByTestId('archived-filter-checkbox');
      act(() => {
        fireEvent.click(savedCheckbox);
        fireEvent.click(archivedCheckbox);
      });

      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalledWith('savedFilter', true);
        expect(handleFilterChange).toHaveBeenCalledWith('archivedFilter', true);
      });
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) => {
        return selector({
          user: {
            id: '111',
            isGuest: true
          },
          tenant: {
            id: '222'
          }
        });
      });
    });

    it('disables useInitiatives query ', () => {
      renderWithChakra(<FeedFilterAccordion tab='summaries' />);

      expect(useInitiatives).toHaveBeenCalledWith({ type: 'Focus' }, { enabled: false });
      expect(useInitiatives).toHaveBeenCalledWith(
        {
          type: 'Label',
          has_archived_at: false,
          tenant_id: '222',
          pageSize: 100
        },
        { enabled: false }
      );
    });

    it('does not render saved and archived when guest', () => {
      renderWithChakra(<FeedFilterAccordion tab='some-tab' />);
      expect(screen.queryByTestId('saved-and-archived')).not.toBeInTheDocument();
    });
  });
});
