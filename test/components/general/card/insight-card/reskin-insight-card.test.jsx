import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ReskinInsightCard from '@components/general/card/insight-card/reskin-insight-card.component';
import { getCardSourceLink } from '@util/helpers';

vi.mock(import('@assets/icons'), async (importOriginal) => {
  return {
    ...(await importOriginal()),
    SFCalendarIcon: () => <div>SFCalendarIcon</div>
  };
});

vi.mock('@util/helpers', () => ({
  getCardSourceLink: vi.fn(),
  getLensIconComponent: () => 'MockLensIcon',
  removeFootnotesFromInsightSection: (str) => str
}));

// Mock Statsig client with a simple function that can be manually overridden in tests
let checkGateReturnValue = false;
vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: () => ({
    checkGate: (gate) => (gate === 'high-priority-cards' ? checkGateReturnValue : false)
  })
}));

vi.mock('@components/general/high-priority-explanation.component', () => ({
  default: () => <div data-testid='high-priority-explanation'>High Priority</div>
}));

vi.mock('@components/general/card/insight-card/insight-carousel.component', () => ({
  default: ({ children }) => <div data-testid='insight-carousel'>{children}</div>
}));

describe('ReskinInsightCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockMeeting = {
    id: 'meeting-1',
    source: 'Meeting',
    source_data: {
      id: 'meeting-1',
      title: 'Test Meeting',
      sensitive: false
    },
    title: 'Meeting Card Title'
  };

  const mockEarningsCall = {
    id: 'earnings-call-1',
    source: 'Meeting',
    sub_source: 'Earnings_Call',
    source_data: {
      id: 'earnings-call-source-id-1',
      title: 'Earnings Call Meeting',
      sensitive: false
    },
    title: 'Earnings Call Card Title'
  };

  const mockInsightWithMeeting = {
    id: 'insight-1',
    headline: 'Test Insight',
    subheadline: 'This is a test insight',
    updated_at: new Date(),
    initiative: {
      title: 'Test Initiative',
      color: 'red'
    },
    sections: [
      {
        content: 'This is the insight content'
      }
    ],
    cards: [mockMeeting]
  };

  const mockInsightWithEarningsCall = {
    id: 'insight-2',
    headline: 'Test Insight',
    subheadline: 'This is a test insight',
    updated_at: new Date(),
    initiative: {
      title: 'Test Initiative',
      color: 'red'
    },
    sections: [
      {
        content: 'This is the insight content'
      }
    ],
    cards: [mockEarningsCall]
  };

  const mockMeetingWithHighPriority = {
    id: 'meeting-2',
    source: 'Meeting',
    source_data: {
      id: 'meeting-2',
      title: 'High Priority Meeting',
      sensitive: false
    },
    title: 'High Priority Meeting Card',
    high_priority: true,
    high_priority_explanation: 'This is very important'
  };

  const mockInsightWithHighPriorityCard = {
    id: 'insight-3',
    headline: 'Test Insight with High Priority',
    subheadline: 'This is a test insight with high priority card',
    updated_at: new Date(),
    initiative: {
      title: 'Test Initiative',
      color: 'red'
    },
    sections: [
      {
        content: 'This is the insight content'
      }
    ],
    cards: [mockMeetingWithHighPriority]
  };

  it('renders meeting source card with correct link', () => {
    getCardSourceLink.mockReturnValueOnce('/meeting/meeting-1');

    render(
      <BrowserRouter>
        <ReskinInsightCard insight={mockInsightWithMeeting} />
      </BrowserRouter>
    );

    // Verify the function was called with the right card
    expect(getCardSourceLink).toHaveBeenCalledWith(mockMeeting);

    // Check that the card elements are properly rendered
    expect(screen.getByText('Meeting Card Title')).toBeInTheDocument();
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
    expect(screen.getByText('SFCalendarIcon')).toBeInTheDocument();
  });

  it('renders earnings call source card with correct link', () => {
    getCardSourceLink.mockReturnValueOnce('/earnings-calls/earnings-call-1');

    render(
      <BrowserRouter>
        <ReskinInsightCard insight={mockInsightWithEarningsCall} />
      </BrowserRouter>
    );

    expect(getCardSourceLink).toHaveBeenCalledWith(mockEarningsCall);

    // Check that the card elements are properly rendered
    expect(screen.getByText('Earnings Call Card Title')).toBeInTheDocument();
    expect(screen.getByText('Earnings Call Meeting')).toBeInTheDocument();
    expect(screen.getByText('SFCalendarIcon')).toBeInTheDocument();
  });

  it('does not render high priority explanation when feature flag is off', () => {
    render(
      <BrowserRouter>
        <ReskinInsightCard insight={mockInsightWithHighPriorityCard} />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('high-priority-explanation')).not.toBeInTheDocument();
  });

  it('renders high priority explanation when feature flag is on and card has high priority', () => {
    // Set the flag to return true for the high-priority-cards gate
    checkGateReturnValue = true;

    render(
      <BrowserRouter>
        <ReskinInsightCard insight={mockInsightWithHighPriorityCard} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('high-priority-explanation')).toBeInTheDocument();

    // Reset the flag
    checkGateReturnValue = false;
  });
});
