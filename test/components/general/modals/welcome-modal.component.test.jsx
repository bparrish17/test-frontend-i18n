import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useUserConfigStore } from '@store/app.store';
import WelcomeModal from '@components/general/modals/welcome-modal.component';

vi.mock('@store/app.store', () => ({
  useUserConfigStore: vi.fn()
}));

describe('WelcomeModal', () => {
  const mockDisclosure = {
    isOpen: true,
    onClose: vi.fn()
  };

  const renderModal = () => {
    render(
      <MemoryRouter>
        <WelcomeModal disclosure={mockDisclosure} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserConfigStore.mockReturnValue(() => ({
      setHasReceivedWelcome: vi.fn(),
      hasReceivedWelcome: false
    }));
  });

  it('renders the modal with all elements', () => {
    renderModal();
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByText("What's New")).toBeInTheDocument();
    expect(screen.getByText('User Prompts')).toBeInTheDocument();
    expect(screen.getByText('Email Updates')).toBeInTheDocument();
    expect(screen.getByText('Per User Auto-Scheduling')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Profile Settings' })).toBeInTheDocument();
  });

  it('closes the modal when "Dismiss" is clicked', () => {
    renderModal();
    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('navigates to profile settings and closes the modal when "Go to Profile Settings" is clicked', () => {
    renderModal();
    const profileSettingsButton = screen.getByRole('link', { name: 'Go to Profile Settings' });
    fireEvent.click(profileSettingsButton);
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('renders all feature items correctly', () => {
    renderModal();
    const featureItems = ['User Prompts', 'Email Updates', 'Per User Auto-Scheduling'];
    featureItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
