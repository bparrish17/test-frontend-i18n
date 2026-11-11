import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';

vi.mock('@util/helpers', async (importActual) => ({
  ...(await importActual()),
  getUserAttendanceStatus: vi.fn(() => ({
    status: 'yes'
  }))
}));

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: () => ({
    checkGate: vi.fn((gate) => {
      if (gate === 'pulses') return false;
      if (gate === 'high-priority-cards') return false;
      return false;
    })
  })
}));

vi.mock('@util/hooks', () => ({
  useAgendaMeetingActions: vi.fn(() => ({
    onMeetingActionClick: vi.fn()
  })),
  useMeetingTimeStatus: vi.fn(() => 'done'),
  useUpdateBotFromPusherEvent: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn(() => ({ id: 'user-123', email: 'test@fora.com' }))
}));

vi.mock('@components/general/card/status-time-label.component', () => ({
  StatusTimeLabel: () => <div data-testid='mock-status-time-label'>Mocked StatusTimeLabel</div>
}));

vi.mock('@components/general/card/reskin-card-structure/reskin-card-header.component', () => ({
  default: ({ title, titleLink }) => (
    <div data-testid='mock-header'>
      <div data-testid='title'>{title}</div>
      <div data-testid='title-link'>{titleLink ?? 'undefined'}</div>
    </div>
  )
}));

vi.mock('@components/general/card/reskin-card-structure/reskin-card-body.component', () => ({
  default: ({ children }) => (
    <>
      <div data-testid='reskin-card-body'>Reskin Card Body</div>
      {children}
    </>
  )
}));

vi.mock('@components/meeting/meeting-participants.component', () => ({
  default: () => <div data-testid='meeting-participants'>Meeting Participants</div>
}));

vi.mock(
  '@components/general/card/reskin-meeting-card/reskin-meeting-card-control-bar.component',
  () => ({
    default: () => <div data-testid='reskin-control-bar'>ReskinMeetingCardControlBar</div>
  })
);

describe('<ReskinMeetingCard />', () => {
  const baseProps = {
    meeting: {
      id: 'meeting-1',
      title: 'Test Meeting',
      start_at: 1744817400000,
      end_at: 1744821000000,
      nylas: { participants: [{ email: 'test@fora.com' }] },
      created_at: new Date().toISOString()
    },
    card: {
      id: 'card-1',
      initiative: { id: 'lens-1' }
    },
    bot: {
      id: 'bot-1'
    },
    onMeetingActionClick: vi.fn(),
    onCardActionClick: vi.fn(),
    botQueryKey: ['key'],
    botUpdaterFn: vi.fn()
  };

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <ReskinMeetingCard
          {...baseProps}
          {...props}
        />
      </MemoryRouter>
    );
  };

  it('renders the meeting title', () => {
    renderComponent();
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
  });

  it('renders the ReskinCardBody component', () => {
    renderComponent();
    expect(screen.getByText('Reskin Card Body')).toBeInTheDocument();
  });

  it('does not render the ReskinCardBody when enableBody is false', () => {
    renderComponent({ enableBody: false });
    expect(screen.queryByTestId('reskin-card-body')).not.toBeInTheDocument();

    // child component, should not be rendered either
    expect(screen.queryByTestId('meeting-participants')).not.toBeInTheDocument();
  });

  it('renders the MeetingParticipants component', () => {
    renderComponent();
    expect(screen.getByText('Meeting Participants')).toBeInTheDocument();
  });

  it('renders the ReskinMeetingCardControlBar', () => {
    renderComponent();
    expect(screen.getByText('ReskinMeetingCardControlBar')).toBeInTheDocument();
  });

  it('does not render the ReskinMeetingCardControlBar when enableControlBar is false', () => {
    renderComponent({ enableControlBar: false });
    expect(screen.queryByTestId('reskin-control-bar')).not.toBeInTheDocument();
  });

  it('passes titleLink to ReskinCardHeader', () => {
    renderComponent();

    expect(screen.getByTestId('title-link').textContent).toBe(`/meeting/${baseProps.meeting.id}`);
  });

  it('passes undefined titleLink when enableTitleLink is false', () => {
    renderComponent({ enableTitleLink: false });

    expect(screen.getByTestId('title-link').textContent).toBe('undefined');
  });
});
