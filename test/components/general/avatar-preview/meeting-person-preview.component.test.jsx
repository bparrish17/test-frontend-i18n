import { screen } from '@testing-library/react';
import { expect } from 'vitest';
import { renderWithProviders } from '@test/test.helpers';
import MeetingPersonPreview from '@components/general/avatar-preview/meeting-person-preview.component';

describe('MeetingPersonPreview', () => {
  it('renders right rail variant', () => {
    renderWithProviders(<MeetingPersonPreview variant='meeting-right-rail' />);
    expect(screen.getByTestId('person-preview-meeting-right-rail')).toBeInTheDocument();
  });

  it('renders right rail variant', () => {
    renderWithProviders(<MeetingPersonPreview variant='meeting-prep' />);
    expect(screen.getByTestId('person-preview-meeting-prep')).toBeInTheDocument();
  });
});
