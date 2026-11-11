import { screen } from '@testing-library/react';
import { expect } from 'vitest';

import { renderWithProviders } from '@test/test.helpers';
import MeetingOrganizations from '@components/meeting/meeting-organizations.component';

const mockOrganizations = [
  {
    id: 'org1',
    name: 'Org 1',
    meetings: {
      meeting1: 1,
      meeting2: 2
    }
  }
];

describe('MeetingOrganizations', () => {
  it('renders organizations with attendee count for a meeting', () => {
    const { rerender } = renderWithProviders(
      <MeetingOrganizations
        meetingId={'meeting1'}
        organizations={mockOrganizations}
      />
    );
    expect(screen.getByText('1 Attendee')).toBeInTheDocument();

    rerender(
      <MeetingOrganizations
        meetingId={'meeting2'}
        organizations={mockOrganizations}
      />
    );

    expect(screen.getByText('2 Attendees')).toBeInTheDocument();
  });
});
