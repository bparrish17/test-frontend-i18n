import { Menu } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrivacyMenuList from '@components/privacy/privacy-menu-list.component';
import { vi } from 'vitest';
import { useIsUserType } from '@util/hooks';

vi.mock('@util/hooks', () => ({
  useIsUserType: vi.fn()
}));

vi.mock('@util/helpers', () => ({
  isMeetingParticipant: vi.fn()
}));

describe('PrivacyMenuList', () => {
  const mockToggleMeetingSensitivity = vi.fn();
  const mockModalDisclosure = { onOpen: vi.fn(), onClose: vi.fn() };

  const mockAccessStats = {
    num_of_participants: 5,
    num_of_shares: 3,
    num_of_collaborators: 10,
    num_of_managers: 1
  };

  it('should render meeting access details', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive={false}
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Check "Meeting Access" header
    expect(screen.getByText('Meeting Access')).toBeInTheDocument();

    // Check total people with access
    expect(screen.getByText('19 people have access to this page')).toBeInTheDocument();

    // Check invitees count
    expect(screen.getByText('5 meeting invitees and 1 manager')).toBeInTheDocument();

    // Check organizational access count
    expect(screen.getByText('10 with organizational access')).toBeInTheDocument();

    // Check sharing recipients
    expect(screen.getByText('3 sharing recipients')).toBeInTheDocument();
  });

  it('should say "person has" when only 1', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          accessStats={{
            num_of_participants: 1,
            num_of_shares: 0,
            num_of_collaborators: 0,
            num_of_managers: 0
          }}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    expect(screen.getByText('1 person has access to this page')).toBeInTheDocument();
  });

  it('should show Available to users with organizational access when 0 collaborators', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          accessStats={{
            num_of_participants: 5,
            num_of_shares: 3,
            num_of_collaborators: 0,
            num_of_managers: 1
          }}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    expect(screen.getByText('Available to users with organizational access')).toBeInTheDocument();
  });

  it('should show No organizational access when sensitive', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    expect(screen.getByText('No organizational access')).toBeInTheDocument();
  });

  it('should not show managers when sensitive', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    expect(screen.getByText('5 meeting invitees')).toBeInTheDocument();
  });

  it('should not show managers when 0', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          accessStats={{
            num_of_participants: 5,
            num_of_shares: 3,
            num_of_collaborators: 0,
            num_of_managers: 0
          }}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Does not say "and 0 managers"
    expect(screen.getByText('5 meeting invitees')).toBeInTheDocument();
  });

  it('should say managers when > 1', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          accessStats={{
            num_of_participants: 5,
            num_of_shares: 3,
            num_of_collaborators: 0,
            num_of_managers: 2
          }}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Does not say "and 0 managers"
    expect(screen.getByText('5 meeting invitees and 2 managers')).toBeInTheDocument();
  });

  it('should show No sharing recipients when sensitive', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    expect(screen.getByText('No sharing recipients')).toBeInTheDocument();
  });

  it('should show No sharing recipients when 0', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    // Force num_of_shares to 0
    mockAccessStats.num_of_shares = 0;

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive={false}
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Ensure sharing recipients is hidden
    const element = screen.getByText('No sharing recipients');
    expect(element).not.toBeVisible();
  });

  it('should disable button and show tooltip if user lacks permissions', () => {
    useIsUserType.mockReturnValue(false); // Mock user without permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive={false}
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
          isMeetingParticipant={false}
        />
      </Menu>
    );

    // Check button is disabled
    const button = document.querySelector('.chakra-button');
    expect(button.textContent).toEqual('Make private to invitees only');
    expect(button).toBeDisabled();
  });

  it('should enable button for non-executive/admin users that are a meeting participant', () => {
    useIsUserType.mockReturnValue(false);

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive={false}
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
          isMeetingParticipant
        />
      </Menu>
    );

    // Check button is enabled
    const button = document.querySelector('.chakra-button');
    expect(button).not.toBeDisabled();
  });

  it('should disable button and show tooltip if meeting is loading', () => {
    useIsUserType.mockReturnValue(true); // Mock user with permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive={false}
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting // is loading meeting with bot
        />
      </Menu>
    );

    // Check button is disabled
    const button = document.querySelector('.chakra-button');
    expect(button.textContent).toEqual('Make private to invitees only');
    expect(button).toBeDisabled();
  });

  it('should render "Enable organizational access" button when isSensitive is true', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Check button text
    const button = document.querySelector('.chakra-button');
    expect(button.textContent).toEqual('Enable organizational access');
    expect(button).not.toBeDisabled();
  });

  it('should call toggleMeetingSensitivity when "Enable organizational access" button is clicked', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Click button
    const button = document.querySelector('.chakra-button');
    fireEvent.click(button);

    // Check if function was called
    expect(mockToggleMeetingSensitivity).toHaveBeenCalledTimes(1);
  });

  it('should call modalDisclosure.onOpen when "Make private to invitees only" button is clicked', () => {
    useIsUserType.mockReturnValue(true); // Mock user permissions

    render(
      <Menu>
        <PrivacyMenuList
          isSensitive={false}
          accessStats={mockAccessStats}
          toggleMeetingSensitivity={mockToggleMeetingSensitivity}
          modalDisclosure={mockModalDisclosure}
          isLoadingMeeting={false}
        />
      </Menu>
    );

    // Click button
    const button = document.querySelector('.chakra-button');
    fireEvent.click(button);

    // Check if function was called
    expect(mockModalDisclosure.onOpen).toHaveBeenCalledTimes(1);
  });
});
