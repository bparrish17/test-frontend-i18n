import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { ChakraProvider, useConst } from '@chakra-ui/react';

import { useUpdateBotFromPusherEvent } from '@util/hooks';
import {
  multiBotStatusChangeUpdaterFn,
  multiBotTranscriptUpdaterFn
} from '@util/helpers/query.helpers';

import AgendaCard from '@components/general/card/agenda-card/agenda-card.component';

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useConst: vi.fn()
  };
});

vi.mock('@components/meeting/meeting-participants.component', () => ({
  default: () => <div>Mocked Participants</div>
}));

vi.mock('@components/general/card/agenda-card/agenda-card-body.component', () => ({
  default: () => <div>Mocked Agenda Body</div>
}));

vi.mock(
  '@components/general/card/reskin-meeting-card/reskin-meeting-card-control-bar.component',
  () => ({
    default: () => <div>Mocked Card Control Bar</div>
  })
);

vi.mock('@util/hooks', async () => {
  const actual = await vi.importActual('@util/hooks');
  return {
    ...actual,
    useMeetingTimeStatus: () => 'upcoming',
    useUpdateBotFromPusherEvent: vi.fn()
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

const mockMeeting = {
  id: '1',
  title: 'Team Sync',
  rsvp: { status: 'yes' },
  preparation: 'Please review the docs.',
  bot: { id: 'bot-123' },
  nylas: {
    participants: [{ email: 'a@b.com' }, { email: 'c@d.com' }]
  },
  card: {
    id: 'card-1',
    title: 'Agenda Title',
    items: []
  }
};

const renderComponent = (props = {}) => {
  return render(
    <ChakraProvider>
      <MemoryRouter>
        <AgendaCard
          meeting={mockMeeting}
          attendees={mockMeeting.nylas.participants}
          onMeetingActionClick={() => {}}
          onCardActionClick={() => {}}
          {...props}
        />
      </MemoryRouter>
    </ChakraProvider>
  );
};

describe('AgendaCard', () => {
  const mockNavigate = vi.fn();
  const fakeToday = new Date('2025-06-13T12:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useConst.mockReturnValue(fakeToday);
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText(/Team Sync/i)).toBeInTheDocument();

    expect(useUpdateBotFromPusherEvent).toHaveBeenCalledWith(
      'bot-123',
      'status_changes',
      ['meetings', 'agenda', '6/13/2025'],
      multiBotStatusChangeUpdaterFn
    );

    expect(useUpdateBotFromPusherEvent).toHaveBeenCalledWith(
      'bot-123',
      'transcripts',
      ['meetings', 'agenda', '6/13/2025'],
      multiBotTranscriptUpdaterFn
    );
  });

  it('renders RSVP icon if RSVP is yes', () => {
    renderComponent();
    const rsvpIcon = document.querySelector('.chakra-icon');
    expect(rsvpIcon).toBeInTheDocument();
  });

  it('renders "Meeting Details" button', () => {
    renderComponent();
    expect(screen.getByText(/Meeting Details/i)).toBeInTheDocument();
  });

  it('renders meeting preparation text', () => {
    renderComponent();
    expect(screen.getByText(/Please review the docs/i)).toBeInTheDocument();
  });

  it('navigates to meeting details when button is clicked', async () => {
    renderComponent();

    const detailsButton = screen.getByTestId('meeting-details-button');
    expect(detailsButton).toBeInTheDocument();
    expect(detailsButton).toHaveAttribute('href', `/meeting/${mockMeeting.id}`);
  });

  it('triggers navigation to meeting detail when clicking header', async () => {
    renderComponent();

    const clickableStack = screen.getByTestId('agenda-card-header');
    await userEvent.click(clickableStack);

    expect(mockNavigate).toHaveBeenCalledWith(`/meeting/${mockMeeting.id}`);
  });

  it('triggers navigation to meeting detail when clicking body ', async () => {
    renderComponent();

    const clickableStack = screen.getByTestId('agenda-card-body');
    await userEvent.click(clickableStack);

    expect(mockNavigate).toHaveBeenCalledWith(`/meeting/${mockMeeting.id}`);
  });
});
