import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GenericInsightPanel from '@components/lens/generic-insight-panel.component';

// Mock the SourceButton component
vi.mock('@components/general/source-button.component', () => ({
  default: ({ children, card }) => (
    <button data-testid='source-button'>
      {children}
      {card?.referenceId && <span>Reference {card.referenceId}</span>}
    </button>
  )
}));

// Mock the SourceInfo component
vi.mock('@components/lens/source-info', () => ({
  default: ({ fullCard }) => (
    <div data-testid='source-info'>
      {fullCard?.source_data?.title}
      {fullCard?.referenceId && <span>Reference {fullCard.referenceId}</span>}
    </div>
  )
}));

// Mock the SourceModal component
vi.mock('@components/general/modals/source-modal.component', () => ({
  default: ({ children, card }) => (
    <div data-testid='source-modal'>
      {children}
      {card?.source_data?.title}
    </div>
  )
}));

describe('GenericInsightPanel', () => {
  const mockItems = [
    {
      id: 'meeting-1',
      source_data: {
        title: 'Meeting 1 Title',
        date: '2024-01-15T10:00:00Z',
        source: 'zoom',
        sensitive: false
      }
    },
    {
      id: 'meeting-2',
      source_data: {
        title: 'Meeting 2 Title',
        date: '2024-01-16T10:00:00Z',
        source: 'teams',
        sensitive: true
      }
    }
  ];

  const mockFullCards = {
    'meeting-1': mockItems[0],
    'meeting-2': mockItems[1]
  };

  const queryClient = new QueryClient();

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <GenericInsightPanel
            items={mockItems}
            fullCards={mockFullCards}
            headerText='Test Header'
            {...props}
          />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders header text correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders source buttons when useNumbering is true', () => {
    renderComponent({ useNumbering: true });
    const sourceButtons = screen.getAllByTestId('source-button');
    expect(sourceButtons).toHaveLength(2);
    expect(screen.getAllByText(/Reference 1/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Reference 2/)[0]).toBeInTheDocument();
  });

  it('renders bullet points when useNumbering is false', () => {
    renderComponent({ useNumbering: false });
    const bullets = screen.getAllByText('•');
    expect(bullets).toHaveLength(2);
  });

  it('renders source modals with titles', () => {
    renderComponent();
    const sourceModals = screen.getAllByTestId('source-modal');
    expect(sourceModals).toHaveLength(2);
    expect(sourceModals[0]).toHaveTextContent('Meeting 1 Title');
    expect(sourceModals[1]).toHaveTextContent('Meeting 2 Title');
  });

  it('shows all items when view more is clicked', () => {
    const manyItems = Array(10)
      .fill()
      .map((_, i) => ({
        id: `meeting-${i + 1}`,
        source_data: {
          title: `Meeting ${i + 1} Title`,
          date: '2024-01-15T10:00:00Z',
          source: 'zoom',
          sensitive: false
        }
      }));
    const manyFullCards = Object.fromEntries(manyItems.map((item) => [item.id, item]));

    renderComponent({
      items: manyItems,
      fullCards: manyFullCards,
      showViewMoreAfter: 5
    });

    fireEvent.click(screen.getByText('View More'));
    const sourceModals = screen.getAllByTestId('source-modal');
    expect(sourceModals).toHaveLength(10);
  });

  it('hides items when view less is clicked', () => {
    const manyItems = Array(10)
      .fill()
      .map((_, i) => ({
        id: `meeting-${i + 1}`,
        source_data: {
          title: `Meeting ${i + 1} Title`,
          date: '2024-01-15T10:00:00Z',
          source: 'zoom',
          sensitive: false
        }
      }));
    const manyFullCards = Object.fromEntries(manyItems.map((item) => [item.id, item]));

    renderComponent({
      items: manyItems,
      fullCards: manyFullCards
    });

    fireEvent.click(screen.getByText('View More'));
    fireEvent.click(screen.getByText('View Less'));
    const sourceModals = screen.getAllByTestId('source-modal');
    expect(sourceModals).toHaveLength(3);
  });

  it('doesnt show View More if provided items are of length 3', () => {
    const manyItems = Array(3)
      .fill()
      .map((_, i) => ({
        id: `meeting-${i + 1}`,
        source_data: {
          title: `Meeting ${i + 1} Title`,
          date: '2024-01-15T10:00:00Z',
          source: 'zoom',
          sensitive: false
        }
      }));
    const manyFullCards = Object.fromEntries(manyItems.map((item) => [item.id, item]));

    renderComponent({
      items: manyItems,
      fullCards: manyFullCards
    });

    const sourceModals = screen.getAllByTestId('source-modal');
    expect(sourceModals).toHaveLength(3);
    expect(screen.queryByText('View More')).not.toBeInTheDocument();
    expect(screen.queryByText('View Less')).not.toBeInTheDocument();
  });

  it('handles forceHideShowMore prop correctly', () => {
    const manyItems = Array(10)
      .fill()
      .map((_, i) => ({
        id: `meeting-${i + 1}`,
        source_data: {
          title: `Meeting ${i + 1} Title`,
          date: '2024-01-15T10:00:00Z',
          source: 'zoom',
          sensitive: false
        }
      }));
    const manyFullCards = Object.fromEntries(manyItems.map((item) => [item.id, item]));

    renderComponent({
      items: manyItems,
      fullCards: manyFullCards,
      showViewMoreAfter: 5,
      forceHideShowMore: true
    });

    expect(screen.queryByText('View More')).not.toBeInTheDocument();
    expect(screen.queryByText('View Less')).not.toBeInTheDocument();
  });

  it('renders sensitive meeting indicators correctly', () => {
    renderComponent();
    const privateMeeting = screen.getAllByTestId('source-modal')[1]; // second meeting is sensitive
    expect(privateMeeting).toHaveTextContent('Meeting 2 Title');
    const privateLabel = screen.getByText('Private');
    expect(privateLabel).toBeInTheDocument();
  });

  it('handles empty items array gracefully', () => {
    renderComponent({ items: [], fullCards: {} });
    expect(screen.queryByTestId('source-modal')).not.toBeInTheDocument();
    expect(screen.queryByText('View More')).not.toBeInTheDocument();
  });

  it('handles missing fullCards gracefully', () => {
    renderComponent({ fullCards: undefined });
    const sourceModals = screen.queryAllByTestId('source-modal');
    expect(sourceModals.every((modal) => !modal.textContent.trim())).toBe(true);
  });

  it('handles invalid card IDs gracefully', () => {
    const invalidItems = [{ id: 'non-existent' }];
    renderComponent({ items: invalidItems });
    const sourceModals = screen.queryAllByTestId('source-modal');
    expect(sourceModals).toHaveLength(0);
  });
});
