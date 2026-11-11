import React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExplorerAnalyzeButton from '@components/explorer/explorer-analyze-button.component';
import { useExplorerPageStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { useNavigate } from 'react-router-dom';

// Mock the hooks
vi.mock('@store/app.store', () => ({
  useExplorerPageStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  Icon: ({ children, ...props }) => <svg {...props}>{children}</svg>
}));

// Mock the icon component
vi.mock('@assets/icons', () => ({
  SFSparkleStarIcon: ({ boxSize, mr, ...props }) => (
    <span
      data-testid='sparkle-star-icon'
      {...props}
    >
      ✨
    </span>
  )
}));

describe('ExplorerAnalyzeButton', () => {
  const mockSetSourcesInLocalstorage = vi.fn();
  const mockToast = vi.fn();
  const mockNavigate = vi.fn();

  const mockSourcesWithData = [
    {
      id: 'source1',
      source_data: {
        title: 'Test Source 1'
      }
    },
    {
      id: 'source2',
      source_data: {
        title: 'Test Source 2'
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    useExplorerPageStore.mockImplementation((selector) => {
      const state = {
        setSources: mockSetSourcesInLocalstorage
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useStyledToast.mockReturnValue(mockToast);
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders analyze button', () => {
    render(<ExplorerAnalyzeButton sourcesToSet={mockSourcesWithData} />);

    expect(screen.getByText('Analyze')).toBeInTheDocument();
  });

  it('navigates to explorer page when clicked with valid sources', () => {
    render(<ExplorerAnalyzeButton sourcesToSet={mockSourcesWithData} />);

    fireEvent.click(screen.getByText('Analyze'));

    expect(mockSetSourcesInLocalstorage).toHaveBeenCalledWith([
      {
        id: 'source1',
        title: 'Test Source 1',
        type: 'Card'
      },
      {
        id: 'source2',
        title: 'Test Source 2',
        type: 'Card'
      }
    ]);
    expect(mockNavigate).toHaveBeenCalledWith('/explorer');
  });

  it('shows error toast when no sources provided', () => {
    render(<ExplorerAnalyzeButton sourcesToSet={null} />);

    fireEvent.click(screen.getByText('Analyze'));

    expect(mockToast).toHaveBeenCalledWith({
      title: 'No Sources Selected',
      status: 'error'
    });
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetSourcesInLocalstorage).not.toHaveBeenCalled();
  });

  it('handles empty sources array by showing error toast', () => {
    render(<ExplorerAnalyzeButton sourcesToSet={[]} />);

    fireEvent.click(screen.getByText('Analyze'));

    expect(mockToast).toHaveBeenCalledWith({
      title: 'No Valid Sources Selected',
      status: 'error'
    });
    expect(mockSetSourcesInLocalstorage).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('maps sources correctly with id, title, and type', () => {
    const sourcesWithDifferentTitles = [
      {
        id: 'meeting1',
        source_data: {
          title: 'Weekly Standup Meeting'
        }
      }
    ];

    render(<ExplorerAnalyzeButton sourcesToSet={sourcesWithDifferentTitles} />);

    fireEvent.click(screen.getByText('Analyze'));

    expect(mockSetSourcesInLocalstorage).toHaveBeenCalledWith([
      {
        id: 'meeting1',
        title: 'Weekly Standup Meeting',
        type: 'Card'
      }
    ]);
  });

  it('handles sources with undefined source_data by showing error toast', () => {
    const sourcesWithoutData = [
      {
        id: 'source1',
        source_data: undefined
      }
    ];

    render(<ExplorerAnalyzeButton sourcesToSet={sourcesWithoutData} />);

    fireEvent.click(screen.getByText('Analyze'));

    // The component now shows error toast when all sources are filtered out
    expect(mockToast).toHaveBeenCalledWith({
      title: 'No Valid Sources Selected',
      status: 'error'
    });
    expect(mockSetSourcesInLocalstorage).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows error toast when sources without id are filtered out', () => {
    const sourcesWithoutId = [
      {
        id: undefined,
        source_data: {
          title: 'Test Source'
        }
      }
    ];

    render(<ExplorerAnalyzeButton sourcesToSet={sourcesWithoutId} />);

    fireEvent.click(screen.getByText('Analyze'));

    // The component shows error toast when all sources are filtered out
    expect(mockToast).toHaveBeenCalledWith({
      title: 'No Valid Sources Selected',
      status: 'error'
    });
    expect(mockSetSourcesInLocalstorage).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('filters out invalid sources but keeps valid ones', () => {
    const mixedSources = [
      {
        id: 'valid1',
        source_data: {
          title: 'Valid Source 1'
        }
      },
      {
        id: undefined,
        source_data: {
          title: 'Invalid - no id'
        }
      },
      {
        id: 'invalid2',
        source_data: undefined
      },
      {
        id: 'valid2',
        source_data: {
          title: 'Valid Source 2'
        }
      }
    ];

    render(<ExplorerAnalyzeButton sourcesToSet={mixedSources} />);

    fireEvent.click(screen.getByText('Analyze'));

    // Only valid sources should be included
    expect(mockSetSourcesInLocalstorage).toHaveBeenCalledWith([
      {
        id: 'valid1',
        title: 'Valid Source 1',
        type: 'Card'
      },
      {
        id: 'valid2',
        title: 'Valid Source 2',
        type: 'Card'
      }
    ]);
    expect(mockNavigate).toHaveBeenCalledWith('/explorer');
  });
});
