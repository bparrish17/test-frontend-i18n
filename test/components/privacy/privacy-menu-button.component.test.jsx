import { Menu } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { totalPeopleWithAccess } from '@util/helpers/privacy.helpers';

import PrivacyMenuButton from '@components/privacy/privacy-menu-button.component';

vi.mock('@assets/icons', () => ({
  SFUnlockIcon: vi.fn(() => <div data-testid='unlock-icon' />),
  SFLockIcon: vi.fn(() => <div data-testid='lock-icon' />)
}));

vi.mock('@util/helpers/privacy.helpers', () => ({
  totalPeopleWithAccess: vi.fn()
}));

describe('PrivacyMenuButton', () => {
  const mockDisclosure = {
    isOpen: false,
    onToggle: vi.fn()
  };

  it('renders the lock icon when isSensitive is true', () => {
    render(
      <Menu>
        <PrivacyMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          isSensitive
          accessStats={{}}
        />
      </Menu>
    );

    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('unlock-icon')).not.toBeInTheDocument();
  });

  it('renders the unlock icon when isSensitive is false', () => {
    render(
      <Menu>
        <PrivacyMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          isSensitive={false}
          accessStats={{}}
        />
      </Menu>
    );

    expect(screen.getByTestId('unlock-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('lock-icon')).not.toBeInTheDocument();
  });

  it('renders a spinner when isLoading is true', () => {
    render(
      <Menu>
        <PrivacyMenuButton
          disclosure={mockDisclosure}
          isLoading
          isSensitive={false}
          accessStats={{}}
        />
      </Menu>
    );

    expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
    expect(screen.queryByText(/totalPeopleWithAccess/i)).not.toBeInTheDocument();
  });

  it('displays the total people with access when isLoading is false', () => {
    totalPeopleWithAccess.mockReturnValue(42);

    render(
      <Menu>
        <PrivacyMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          isSensitive={false}
          accessStats={{ num_of_participants: 42 }}
        />
      </Menu>
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('calls disclosure.onToggle when clicked', () => {
    render(
      <Menu>
        <PrivacyMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          isSensitive={false}
          accessStats={{}}
        />
      </Menu>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockDisclosure.onToggle).toHaveBeenCalledTimes(1);
  });
});
