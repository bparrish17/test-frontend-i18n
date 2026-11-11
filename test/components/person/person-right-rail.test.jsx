import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonPageRightRail from '@components/person/person-right-rail.component';

vi.mock('@components/person/person-internal-external-chart.component', () => ({
  default: () => <div data-testid='internal-external-chart'>Chart</div>
}));

describe('PersonPageRightRail', () => {
  const defaultProps = {
    personStats: {
      botted: 10,
      duration: 3600000 // 1 hour in milliseconds
    },
    personSummaries: [],
    personExternalMeetings: [{ id: 1 }, { id: 2 }],
    personInternalMeetings: [{ id: 3 }, { id: 4 }],
    firstName: 'John',
    isExternal: false,
    numOfDays: 90
  };

  it('renders the meetings stats section', () => {
    render(<PersonPageRightRail {...defaultProps} />);
    expect(screen.getByText("John's Meetings")).toBeInTheDocument();
  });

  it('displays total meetings count', () => {
    render(<PersonPageRightRail {...defaultProps} />);
    expect(screen.getByText(/10 recorded meetings/)).toBeInTheDocument();
  });

  it('shows average meetings per day for internal users', () => {
    render(<PersonPageRightRail {...defaultProps} />);
    expect(screen.getByText(/0.1 recorded meetings/)).toBeInTheDocument();
  });

  it('displays meeting duration statistics for external users', () => {
    render(
      <PersonPageRightRail
        {...defaultProps}
        isExternal
      />
    );
    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  it('renders internal vs external chart for internal users', () => {
    render(<PersonPageRightRail {...defaultProps} />);
    expect(screen.getByTestId('internal-external-chart')).toBeInTheDocument();
  });

  it('hides internal vs external chart for external users', () => {
    render(
      <PersonPageRightRail
        {...defaultProps}
        isExternal={true}
      />
    );
    expect(screen.queryByTestId('internal-external-chart')).not.toBeInTheDocument();
  });
});
