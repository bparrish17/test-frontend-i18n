import { screen } from '@testing-library/react';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/test.helpers';
import MeetingAttendees from '@components/meeting/meeting-attendees.component';

const mockAttendees = [
  {
    duration: 1,
    behavior: 'curious'
  },
  {
    duration: 2,
    behavior: 'unimpressed'
  },
  {
    behavior: 'silent'
  }
];

describe('MeetingAttendees', () => {
  it('initially only renders attendees with speaker times', () => {
    renderWithProviders(<MeetingAttendees attendees={mockAttendees} />);
    expect(screen.getByText('curious')).toBeInTheDocument();
    expect(screen.getByText('unimpressed')).toBeInTheDocument();
    expect(screen.queryByText('silent')).toBeNull();
    expect(screen.getByTestId('see-more-button')).toBeInTheDocument();
  });

  it('renders all attendees after clicking "see more"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MeetingAttendees attendees={mockAttendees} />);

    const button = screen.getByTestId('see-more-button');
    await user.click(button);

    expect(screen.getByText('curious')).toBeInTheDocument();
    expect(screen.getByText('unimpressed')).toBeInTheDocument();
    expect(screen.getByText('silent')).toBeInTheDocument();
  });
});
