import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SourceModalHeader from '@components/general/modals/source-modal-header.component';

vi.mock('@services/query-services/insights.query-service', () => ({
  useLatestInsight: () => ({
    data: {
      id: 'test-insight-id'
    }
  })
}));

vi.mock('@components/general/private-label.component', () => ({
  default: ({ dark, ...props }) => (
    <div
      data-testid='private-label'
      data-dark={dark ? 'true' : 'false'}
      {...props}
    >
      Private
    </div>
  )
}));

vi.mock('@components/general/source-logo.component', () => ({
  default: ({ sourceType, subSource, source }) => (
    <div data-testid='source-logo'>
      <span>source {sourceType}</span>
      <span>sub_source {subSource}</span>
      <span>title {source.title}</span>
    </div>
  )
}));

describe('SourceModalHeader', () => {
  const mockMeetingCard = {
    source: 'Meeting',
    sub_source: 'Google_Meet',
    initiative: {
      id: 'lens-1',
      title: 'Test Lens'
    },
    source_data: {
      id: 'meeting-1',
      title: 'Test Meeting',
      sensitive: false
    }
  };

  const mockEarningsCallCard = {
    source: 'Bot',
    sub_source: 'Earnings_Call',
    id: 'earnings-call-1',
    initiative: {
      id: 'lens-1',
      title: 'Test Lens'
    },
    source_data: {
      id: 'earnings-call-1',
      title: 'Earnings Call Meeting',
      sensitive: false
    }
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <SourceModalHeader
          card={mockMeetingCard}
          {...props}
        />
      </BrowserRouter>
    );
  };

  it('renders lens title correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Lens')).toBeInTheDocument();
  });

  it('renders "was discussed at" text', () => {
    renderComponent();
    expect(screen.getByText('was discussed at')).toBeInTheDocument();
  });

  it('renders meeting title correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
  });

  it('renders meeting source-logo', () => {
    renderComponent();
    expect(screen.getByTestId('source-logo')).toBeInTheDocument();
    expect(screen.getByText('source Meeting')).toBeInTheDocument();
    expect(screen.getByText('sub_source Google_Meet')).toBeInTheDocument();
    expect(screen.getByText('title Test Meeting')).toBeInTheDocument();
  });

  it('renders private label for sensitive meetings', () => {
    const sensitiveCard = {
      ...mockMeetingCard,
      source_data: { ...mockMeetingCard.source_data, sensitive: true }
    };
    renderComponent({ card: sensitiveCard });
    expect(screen.getByTestId('private-label')).toBeInTheDocument();
    expect(screen.getByTestId('private-label')).toHaveAttribute('data-dark', 'true');
  });

  it('renders meeting link with correct path', () => {
    renderComponent();
    const links = screen.getAllByRole('link');
    const meetingLink = links.find((link) => link.getAttribute('href').includes('/meeting/'));
    expect(meetingLink).toBeInTheDocument();
    expect(meetingLink).toHaveAttribute('href', '/meeting/meeting-1');
  });

  // Tests for earnings call functionality
  it('renders earnings call title correctly', () => {
    renderComponent({ card: mockEarningsCallCard });
    expect(screen.getByText('Earnings Call Meeting')).toBeInTheDocument();
  });

  it('renders source logo with card source data', () => {
    renderComponent({ card: mockEarningsCallCard });
    expect(screen.getByText('Earnings Call Meeting')).toBeInTheDocument();
    expect(screen.getByText('Earnings Call Meeting')).toBeInTheDocument();
    expect(screen.getByText('Earnings Call Meeting')).toBeInTheDocument();
  });

  it('renders earnings call link with correct path', () => {
    renderComponent({ card: mockEarningsCallCard });
    const links = screen.getAllByRole('link');
    const earningsCallLink = links.find((link) =>
      link.getAttribute('href').includes('/earnings-calls/')
    );
    expect(earningsCallLink).toBeInTheDocument();
    expect(earningsCallLink).toHaveAttribute('href', '/earnings-calls/earnings-call-1');
  });

  it('renders private label for sensitive earnings calls', () => {
    const sensitiveCard = {
      ...mockEarningsCallCard,
      source_data: { ...mockEarningsCallCard.source_data, sensitive: true }
    };
    renderComponent({ card: sensitiveCard });
    expect(screen.getByTestId('private-label')).toBeInTheDocument();
  });
});
