import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmploymentHistoryPosition from '@components/person/employment-history-position.component';

// Mock the current date to be consistent in tests
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
    isEqual: vi.fn(),
    parseISO: vi.fn((str) => new Date(str)),
    format: vi.fn((date) => date.getFullYear().toString())
  };
});

describe('EmploymentHistoryPosition', () => {
  const mockPosition = {
    title: 'Software Engineer',
    start_date: '2020-01-01',
    end_date: '2021-01-01',
    current: false
  };

  it('renders position title and duration correctly', () => {
    render(
      <EmploymentHistoryPosition
        position={mockPosition}
        positionIndex={0}
        positions={[mockPosition]}
      />
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText(/2020-2021/)).toBeInTheDocument();
  });

  it('shows "Current" for current position', () => {
    const currentPosition = {
      ...mockPosition,
      end_date: null,
      current: true
    };

    render(
      <EmploymentHistoryPosition
        position={currentPosition}
        positionIndex={0}
        positions={[currentPosition]}
      />
    );

    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('calculates duration when end date is provided', () => {
    const positions = [
      {
        ...mockPosition,
        start_date: '2020-01-01',
        end_date: '2022-01-01'
      }
    ];

    render(
      <EmploymentHistoryPosition
        position={positions[0]}
        positionIndex={0}
        positions={positions}
      />
    );

    const durationText = screen.getByText(/2020-2022/);
    expect(durationText).toBeInTheDocument();
  });
});
