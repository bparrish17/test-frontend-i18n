import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Profile from '@components/layout/profile.component';
import { useUserStore } from '@store/app.store';

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

describe('Profile Component', () => {
  const mockUser = {
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    apollo_profile: { photo_url: null },
    type: 'Executive'
  };

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

  beforeEach(() => {
    useUserStore.mockReturnValue(mockUser);
  });

  it('renders the avatar and popover content', () => {
    renderComponent();
    const popoverTrigger = screen.getByRole('button');
    expect(popoverTrigger).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /john doe/i })).toBeInTheDocument();
  });

  it('opens the popover when the avatar is clicked', () => {
    renderComponent();
    const popoverTrigger = screen.getByRole('button');
    fireEvent.click(popoverTrigger);
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('has correct links', () => {
    renderComponent();
    const popoverTrigger = screen.getByRole('button');
    fireEvent.click(popoverTrigger);
    expect(screen.getByText('Profile Settings').href).toEqual(
      expect.stringContaining('/settings/account')
    );
    expect(screen.getByText('Sign Out').href).toEqual(expect.stringContaining('/logout'));
  });
});
