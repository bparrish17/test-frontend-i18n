import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ConfirmAccessModal from '@components/privacy/confirm-access-modal.component';

// Mocking StyledModal component and other necessary dependencies
vi.mock('@components/general/modals/styled-modal.component', () => ({
  __esModule: true,
  default: ({ title, children }) => (
    <div>
      {title}
      {children}
    </div>
  ) // Just render children
}));

describe('ConfirmAccessModal', () => {
  const mockDisclosure = {
    isOpen: true,
    onClose: vi.fn()
  };

  const mockAccessStats = {
    num_of_collaborators: 5,
    num_of_managers: 3,
    num_of_shares: 1
  };

  const mockToggleMeetingSensitivity = vi.fn();

  it('should render modal with correct title and content', () => {
    render(
      <ConfirmAccessModal
        disclosure={mockDisclosure}
        accessStats={mockAccessStats}
        toggleMeetingSensitivity={mockToggleMeetingSensitivity}
      />
    );

    // Check modal title
    expect(screen.getByText('Confirm Access Change')).toBeInTheDocument();

    // Check the number of people losing access
    expect(screen.getByText('This will remove access for 9 people')).toBeInTheDocument();

    // Check the second text
    expect(
      screen.getByText(
        'This can be undone, but sharing recipients will need to be added back manually.'
      )
    ).toBeInTheDocument();
  });

  it('should call disclosure.onClose when Cancel button is clicked', () => {
    render(
      <ConfirmAccessModal
        disclosure={mockDisclosure}
        accessStats={mockAccessStats}
        toggleMeetingSensitivity={mockToggleMeetingSensitivity}
      />
    );

    // Click on Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check if onClose was called
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('should call toggleMeetingSensitivity when Remove Access button is clicked', () => {
    render(
      <ConfirmAccessModal
        disclosure={mockDisclosure}
        accessStats={mockAccessStats}
        toggleMeetingSensitivity={mockToggleMeetingSensitivity}
      />
    );

    // Click on Remove Access button
    fireEvent.click(screen.getByText('Remove Access'));

    // Check if toggleMeetingSensitivity was called
    expect(mockToggleMeetingSensitivity).toHaveBeenCalled();
  });
});
