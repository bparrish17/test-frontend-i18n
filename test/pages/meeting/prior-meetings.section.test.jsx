import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useMeetings } from '@services/query-services/meetings.query-service';
import { useUserStore } from '@store/app.store';
import PriorMeetingsSection from '@pages/meeting/prior-meetings.section.jsx';

vi.mock('@services/query-services/meetings.query-service');
vi.mock('@store/app.store');
vi.mock('@util/hooks');
vi.mock('@components/general/card/reskin-meeting-card/reskin-meeting-card.component', () => ({
  default: ({ meeting }) => <div data-testid='meeting-card'>{meeting.id}</div>
}));
vi.mock('@pages/meeting/section.component', () => ({
  default: ({ children }) => <div data-testid='meeting-section'>{children}</div>
}));
vi.mock('@pages/meeting/section-header.component', () => ({
  default: ({ text }) => <div data-testid='section-header'>{text}</div>
}));

vi.mock('@components/general/card/reskin-summary-card/reskin-summary-card.component', () => ({
  default: ({ card }) => (
    <div>
      <span>{card?.headline}</span>
    </div>
  )
}));

describe('PriorMeetingsSection', () => {
  const mockAttendees = [
    { id: '1', email: 'user1@example.com' },
    { id: '2', email: 'user2@example.com' }
  ];

  const mockPriorMeetingsSections = [
    {
      sectionDescriptor: 'with Team',
      searchBody: {
        participant_emails: ['team@example.com']
      },
      priorMeetings: [
        {
          id: '1',
          start_at: 1643673600000,
          card: {
            title: 'Summary Headline 1'
          }
        },
        {
          id: '2',
          start_at: 1643673600000,
          card: {
            title: 'Summary Headline 2'
          }
        }
      ]
    }
  ];

  const mockUser = {
    id: 'user123',
    email: 'user@example.com',
    type: 'Regular'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.mockReturnValue(mockUser);
    useMeetings.mockReturnValue({ data: [{ id: 'prior1' }] });
  });

  it('should render if there is at least 1 prior meeting', () => {
    render(
      <PriorMeetingsSection
        attendees={mockAttendees}
        priorMeetingsSections={mockPriorMeetingsSections}
      />
    );
    expect(screen.getByTestId('meeting-section')).toBeInTheDocument();
  });

  it('should render nothing when attendees length is less than 2', () => {
    const { container } = render(
      <PriorMeetingsSection
        attendees={[{ id: '1' }]}
        priorMeetingsSections={mockPriorMeetingsSections}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render prior meetings sections when attendees length is 2 or more', () => {
    render(
      <PriorMeetingsSection
        attendees={mockAttendees}
        priorMeetingsSections={mockPriorMeetingsSections}
      />
    );
    expect(screen.getByTestId('meeting-section')).toBeInTheDocument();
  });

  it('should render summary cards with card headline body', () => {
    render(
      <PriorMeetingsSection
        attendees={mockAttendees}
        priorMeetingsSections={mockPriorMeetingsSections}
      />
    );
    expect(screen.getByText('Summary Headline 1')).toBeInTheDocument();
    expect(screen.getByText('Summary Headline 2')).toBeInTheDocument();
  });
});
