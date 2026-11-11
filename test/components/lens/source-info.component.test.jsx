import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SourceInfo from '@components/lens/source-info.component';

describe('SourceInfo', () => {
  const mockMeetingCard = {
    source: 'Meeting',
    source_data: {
      id: 'meeting-1',
      title: 'Test Meeting',
      start_at: '2024-02-07T10:00:00Z',
      sensitive: false
    }
  };

  const mockEarningsCallCard = {
    source: 'Bot',
    sub_source: 'Earnings_Call',
    id: 'earnings-call-1',
    source_data: {
      id: 'earnings-call-1',
      title: 'Earnings Call Meeting',
      start_at: '2024-02-08T14:00:00Z',
      sensitive: false
    }
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <SourceInfo {...props} />
      </BrowserRouter>
    );
  };

  it('renders meeting title correctly', () => {
    renderComponent({ fullCard: mockMeetingCard });
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
  });

  it('renders date when showDate is true', () => {
    renderComponent({ fullCard: mockMeetingCard, showDate: true });
    expect(screen.getByText('WED, FEB 7')).toBeInTheDocument();
  });

  it('does not render date when showDate is false', () => {
    renderComponent({ fullCard: mockMeetingCard, showDate: false });
    expect(screen.queryByText('WED, FEB 7')).not.toBeInTheDocument();
  });

  it('renders meeting link for meeting sources', () => {
    renderComponent({ fullCard: mockMeetingCard });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/meeting/meeting-1');
  });

  it('renders title as text for non-meeting sources', () => {
    const nonMeetingCard = {
      ...mockMeetingCard,
      source: 'Document'
    };
    renderComponent({ fullCard: nonMeetingCard });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders earnings call title correctly', () => {
    renderComponent({ fullCard: mockEarningsCallCard });
    expect(screen.getByText('Earnings Call Meeting')).toBeInTheDocument();
  });

  it('renders earnings call link with correct path', () => {
    renderComponent({ fullCard: mockEarningsCallCard });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/earnings-calls/earnings-call-1');
  });
});
