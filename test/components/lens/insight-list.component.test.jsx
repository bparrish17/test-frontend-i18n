import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InsightList from '@components/lens/insight-list.component';

// Mock the hooks
vi.mock('@util/hooks', () => ({
  usePrefetchInfiniteSearchQuery: vi.fn(() => ({ model: {}, defaultBody: {} }))
}));

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  Spinner: () => <div data-testid='spinner'></div>
}));

describe('InsightList', () => {
  const mockInsights = [
    {
      id: 'insight1',
      title: 'First Insight',
      content: 'First content',
      created_at: '2024-01-14T20:00:00.000Z',
      initiative: { title: 'Test Initiative' },
      sections: [{ content: 'First content' }]
    },
    {
      id: 'insight2',
      title: 'Second Insight',
      content: 'Second content',
      created_at: '2024-01-15T20:00:00.000Z',
      initiative: { title: 'Test Initiative' },
      sections: [{ content: 'Second content' }]
    }
  ];

  const queryClient = new QueryClient();

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <InsightList
            insights={mockInsights}
            {...props}
          />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders empty state when no insights', () => {
    renderComponent({ insights: [] });
    expect(screen.getByText('No Updates')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders insights correctly', () => {
    renderComponent();
    expect(screen.getAllByText('Test Initiative')).toHaveLength(2);
    expect(screen.getByText('First content')).toBeInTheDocument();
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });

  it('shows date headers by default', () => {
    renderComponent();
    expect(screen.getByText('January 14, 2024')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('hides date headers when showDateHeaders is false', () => {
    renderComponent({ showDateHeaders: false });
    expect(screen.queryByText('January 14, 2024')).not.toBeInTheDocument();
  });

  it('shows all insights when view more is clicked', () => {
    const manyInsights = Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `insight${i + 1}`,
        title: `Insight ${i + 1}`,
        headline: `Insight ${i + 1}`,
        content: `Content ${i + 1}`,
        created_at: `2024-01-${14 + i}T13:00:00.000Z`,
        initiative: { title: 'Test Initiative' },
        sections: [{ content: `Content ${i + 1}` }]
      }));

    renderComponent({ insights: manyInsights });

    fireEvent.click(screen.getByText('View More'));

    // All insights should now be visible
    manyInsights.forEach((insight) => {
      expect(screen.getByText(insight.sections[0].content)).toBeInTheDocument();
    });
    expect(screen.getByText('View Less')).toBeInTheDocument();
  });

  it('hides insights when view less is clicked', () => {
    const manyInsights = Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `insight${i + 1}`,
        title: `Insight ${i + 1}`,
        headline: `Insight ${i + 1}`,
        content: `Content ${i + 1}`,
        created_at: `2024-01-${14 + i}T13:00:00.000Z`,
        initiative: { title: 'Test Initiative' },
        sections: [{ content: `Content ${i + 1}` }]
      }));

    renderComponent({ insights: manyInsights });

    fireEvent.click(screen.getByText('View More'));
    fireEvent.click(screen.getByText('View Less'));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.getByText('Content 3')).toBeInTheDocument();

    expect(screen.queryByText('Content 4')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 5')).not.toBeInTheDocument();

    expect(screen.getByText('View More')).toBeInTheDocument();
  });
});
