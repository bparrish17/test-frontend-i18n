import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SourceButton from '@components/general/source-button.component';

// Mock dependencies first
vi.mock('@util/hooks', () => ({
  useFullCards: () => ({ fullCards: {} }),
  usePrefetchInfiniteSearchQuery: () => () => Promise.resolve()
}));

vi.mock('@services/query-services/insights.query-service', () => ({
  useInsights: () => ({
    data: [],
    isSuccess: false
  })
}));

vi.mock('@assets/icons', () => ({
  ChevronRightIcon: () => <span data-testid='chevron-right-icon' />,
  SFBoltFillIcon: () => <span data-testid='bolt-fill-icon' />
}));

vi.mock('@assets/icons/sf-icons/exclamation-mark-circle-filled.icon', () => ({
  default: () => <span data-testid='exclamation-mark-circle-filled-icon' />
}));

vi.mock('@components/general/modals/styled-modal.component', () => ({
  default: ({ children, openButton, onClose }) => {
    const handleClick = () => {
      if (onClose) {
        onClose();
      }
    };
    return (
      <button
        data-testid='styled-modal'
        onClick={handleClick}
        type='button'
      >
        {openButton}
        {children}
      </button>
    );
  }
}));

vi.mock('@util/constants', () => ({
  ICON_MAPPING: {
    lens: { icon: () => <span data-testid='lens-icon' /> }
  }
}));

// Mock scrollIntoView since it's not available in jsdom
Element.prototype.scrollIntoView = vi.fn();

describe('SourceButton', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView.mockClear();
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SourceButton {...props} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders with the correct number', () => {
    renderComponent({ children: '1' });
    const button = screen.getByTestId('source-button');
    expect(button).toHaveTextContent('1');
  });

  it('renders with bracketed number', () => {
    renderComponent({ children: '[1]' });
    const button = screen.getByTestId('source-button');
    expect(button).toHaveTextContent('[1]');
  });

  it('handles non-numeric source references', () => {
    renderComponent({ children: '[A]' });
    const button = screen.getByTestId('source-button');
    expect(button).toHaveTextContent('[A]');
  });
});
