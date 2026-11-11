// Move vi.mock calls to the top of the file, before any imports
vi.mock('chart.js', () => ({
  BubbleController: class MockBubbleController {
    draw() {}
    getMeta() {
      return { data: [] };
    }
  },
  ArcElement: class {},
  Tooltip: class {},
  Legend: class {},
  Chart: { register: vi.fn() }
}));

vi.mock('react-chartjs-2', () => ({
  Doughnut: vi.fn((props) => <div data-testid='mock-doughnut-chart'>Doughnut Chart</div>)
}));

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonInternalExternalChart from '@components/person/person-internal-external-chart.component';

describe('PersonInternalExternalChart', () => {
  const mockProps = {
    personInternalMeetings: [
      { id: 1, title: 'Internal Meeting 1' },
      { id: 2, title: 'Internal Meeting 2' }
    ],
    personExternalMeetings: [{ id: 3, title: 'External Meeting 1' }],
    numOfDays: 90
  };

  it('renders the chart component', () => {
    render(<PersonInternalExternalChart {...mockProps} />);
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });

  it('handles empty meeting data', () => {
    render(
      <PersonInternalExternalChart
        personInternalMeetings={[]}
        personExternalMeetings={[]}
        numOfDays={90}
      />
    );
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });
});
