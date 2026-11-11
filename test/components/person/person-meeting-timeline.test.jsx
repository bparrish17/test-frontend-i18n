import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MeetingTimeline from '@components/person/person-meeting-timeline.component';

// Mock the charts
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  LinearScale: class {},
  TimeScale: class {},
  PointElement: class {},
  Tooltip: class {},
  Legend: class {}
}));

vi.mock('react-chartjs-2', () => ({
  Bubble: vi.fn(({ data }) => <div data-testid='bubble-chart'>{JSON.stringify(data)}</div>)
}));

// Mock the meetings service
vi.mock('@services/query-services/meetings.query-service', () => ({
  useMeetings: () => ({
    data: [
      {
        start_at: 1645488000000,
        end_at: 1645491600000,
        minutes: 60
      }
    ],
    isLoading: false
  })
}));

// Mock StyledSelect component
vi.mock('@components/general/styled-select.component', () => ({
  default: ({ value, onChange, options }) => (
    <div>
      <button
        data-testid='select-button'
        onClick={() => onChange(50)}
      >
        {value}
      </button>
      <div data-testid='select-options'>{options.map((opt) => opt.value)}</div>
    </div>
  )
}));

describe('MeetingTimeline', () => {
  const defaultProps = {
    id: '123',
    email: 'test@example.com',
    numOfDays: 90
  };

  it('renders the timeline component with title', () => {
    render(<MeetingTimeline {...defaultProps} />);
    expect(screen.getByText('Meeting Timeline')).toBeInTheDocument();
  });

  it('allows changing the number of meetings displayed', () => {
    render(<MeetingTimeline {...defaultProps} />);
    const selectButton = screen.getByTestId('select-button');
    fireEvent.click(selectButton);
    expect(screen.getByTestId('select-options')).toBeInTheDocument();
  });

  it('displays the meetings amount selection area', () => {
    render(<MeetingTimeline {...defaultProps} />);
    expect(screen.getByText('Last')).toBeInTheDocument();
    expect(screen.getByText('Meetings')).toBeInTheDocument();
  });

  it('renders the bubble chart', () => {
    render(<MeetingTimeline {...defaultProps} />);
    expect(screen.getByTestId('bubble-chart')).toBeInTheDocument();
  });
});
