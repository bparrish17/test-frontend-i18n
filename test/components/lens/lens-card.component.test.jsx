import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import LensCard from '@components/lens/lens-card.component';
import { useLatestInsight } from '@services/query-services/insights.query-service';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';

// Mock dependencies
vi.mock('@services/query-services/insights.query-service', () => ({
  useLatestInsight: vi.fn()
}));
vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));
vi.mock('@services/query-services/default.query-service');

vi.mock('@components/lens/lens-card-menu.component', () => ({
  default: () => <div data-testid='lens-card-menu-mock'>Mocked LensCardMenu</div>
}));

vi.mock('@components/lens/lens-card-loading.component', () => ({
  default: () => <div data-testid='lens-card-loading-mock'>Mocked loading</div>
}));

describe('LensCard Component', () => {
  const lensMock = {
    id: '123',
    title: 'Test Lens',
    visibility: 'Public',
    color: 'blue',
    creator: { name: 'John Doe' },
    lens_config: { match_prompt: 'Test prompt' }
  };

  beforeEach(() => {
    // Reset mocks
    useLatestInsight.mockReturnValue({ data: null, isLoading: false, isFetched: true });
    useStyledToast.mockReturnValue(vi.fn());
  });

  it('renders the LensCard component correctly', () => {
    render(
      <BrowserRouter>
        <LensCard
          lens={lensMock}
          enableMenu
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Lens')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays the loading state when insights are loading', () => {
    useLatestInsight.mockReturnValue({ data: null, isLoading: true, isFetched: false });
    render(
      <BrowserRouter>
        <LensCard lens={lensMock} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('lens-card-loading-mock')).toBeInTheDocument();
  });

  it('renders LensCardMenu when enableMenu is true', () => {
    render(
      <BrowserRouter>
        <LensCard
          lens={lensMock}
          enableMenu
        />
      </BrowserRouter>
    );
    expect(screen.getByTestId('lens-card-menu-mock')).toBeInTheDocument();
  });

  it('displays toast notification when heading is clicked without an insight', () => {
    useLatestInsight.mockReturnValue({ data: null, isLoading: false, isFetched: true });
    const toastMock = vi.fn();
    useStyledToast.mockReturnValue(toastMock);
    render(
      <BrowserRouter>
        <LensCard lens={lensMock} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Test Lens'));
    expect(toastMock).toHaveBeenCalledWith({
      title: 'You do not currently have any insights for this lens.',
      status: 'warning',
      duration: 9000,
      isClosable: true
    });
  });

  it('navigates to the insight link when clicked and insight exists', () => {
    useLatestInsight.mockReturnValue({
      data: { id: 'insight123' },
      isLoading: false,
      isFetched: true
    });
    render(
      <BrowserRouter>
        <LensCard
          lens={lensMock}
          enableNavigation
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test Lens')).toHaveAttribute('href', '/insights/insight123');
  });

  it('renders fallback text when lens title or visibility is not provided', () => {
    render(
      <BrowserRouter>
        <LensCard lens={{}} />
      </BrowserRouter>
    );
    expect(screen.getByText('Untitled Lens')).toBeInTheDocument();
    expect(screen.getByText('Unset')).toBeInTheDocument();
  });
});
