import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import LensCardMenu from '@components/lens/lens-card-menu.component';
import { useUserStore } from '@store/app.store';
import {
  useFollowInitiative,
  useUnfollowInitiative
} from '@services/query-services/initiatives.query-service';
import { useStyledToast } from '@util/hooks';
import { useLensActivation } from '@services/query-services/lens-activation.query-service';
import { MemoryRouter } from 'react-router-dom';

// Mock Chakra UI Menu component
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    Menu: vi.fn(({ children }) => children),
    MenuButton: vi.fn(({ children }) => children),
    MenuList: vi.fn(({ children }) => <div>{children}</div>),
    MenuItem: vi.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>)
  };
});

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));
vi.mock('@services/query-services/initiatives.query-service', () => ({
  useFollowInitiative: vi.fn(),
  useUnfollowInitiative: vi.fn()
}));
vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));
vi.mock('@services/query-services/lens-activation.query-service', () => ({
  useLensActivation: vi.fn()
}));

describe('LensCardMenu', () => {
  const mockToast = vi.fn();
  const mockFollowLens = vi.fn();
  const mockUnfollowLens = vi.fn();
  const mockDeactivateLens = vi.fn();
  const mockReactivateLens = vi.fn();
  const mockDisclosure = {
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.mockReturnValue({ id: 1, name: 'Test User' });
    useFollowInitiative.mockReturnValue({ mutateAsync: mockFollowLens });
    useUnfollowInitiative.mockReturnValue({ mutateAsync: mockUnfollowLens });
    useStyledToast.mockReturnValue(mockToast);
    useLensActivation.mockReturnValue({
      disclosure: mockDisclosure,
      deactivateLens: mockDeactivateLens,
      reactivateLens: mockReactivateLens
    });
  });

  const lens = {
    id: 1,
    creator: { id: 1 },
    visibility: 'Tenant',
    collaborators: [{ id: 1, name: 'Test User' }]
  };
  const insight = { id: 1 };

  test('renders menu options based on user role', () => {
    render(
      <MemoryRouter>
        <LensCardMenu
          lens={lens}
          insight={insight}
        />
      </MemoryRouter>
    );

    // Check if the correct menu items are displayed
    expect(screen.getByText('Edit Lens Settings')).toBeInTheDocument();
    expect(screen.getByText('Deactivate Lens')).toBeInTheDocument();
    expect(screen.queryByText('Follow Lens')).not.toBeInTheDocument();
    expect(screen.queryByText('Unfollow Lens')).not.toBeInTheDocument();
  });

  test('renders "Follow Lens" when conditions are met', async () => {
    const lensWithCollaborator = {
      ...lens,
      creator: { id: 2 },
      visibility: 'Tenant',
      collaborators: []
    };
    render(
      <MemoryRouter>
        <LensCardMenu
          lens={lensWithCollaborator}
          insight={insight}
        />
      </MemoryRouter>
    );

    // Check if Follow Lens is present when the user is not a collaborator
    expect(screen.getByText('Follow Lens')).toBeInTheDocument();
  });

  test('renders "Unfollow Lens" when user canUnfollow', async () => {
    const lensWithCollaborator = {
      ...lens,
      creator: { id: 2 },
      visibility: 'Tenant'
    };
    render(
      <MemoryRouter>
        <LensCardMenu
          lens={lensWithCollaborator}
          insight={insight}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Unfollow Lens')).toBeInTheDocument();
  });

  test('shows Deactivate option for active lens when user is creator', () => {
    render(
      <MemoryRouter>
        <LensCardMenu lens={lens} />
      </MemoryRouter>
    );

    expect(screen.getByText('Deactivate Lens')).toBeInTheDocument();
    expect(screen.queryByText('Reactivate Lens')).not.toBeInTheDocument();
  });

  test('shows Reactivate option for archived lens when user is creator', () => {
    const archivedLens = {
      ...lens,
      archived_at: new Date().toISOString()
    };
    render(
      <MemoryRouter>
        <LensCardMenu lens={archivedLens} />
      </MemoryRouter>
    );

    expect(screen.getByText('Reactivate Lens')).toBeInTheDocument();
    expect(screen.queryByText('Deactivate Lens')).not.toBeInTheDocument();
  });

  test('opens deactivate modal when Deactivate Lens is clicked', async () => {
    render(
      <MemoryRouter>
        <LensCardMenu lens={lens} />
      </MemoryRouter>
    );

    const deactivateButton = screen.getByText('Deactivate Lens');
    await fireEvent.click(deactivateButton);

    expect(mockDisclosure.onOpen).toHaveBeenCalled();
  });

  test('opens reactivate modal when Reactivate Lens is clicked', async () => {
    const archivedLens = {
      ...lens,
      archived_at: new Date().toISOString()
    };
    render(
      <MemoryRouter>
        <LensCardMenu lens={archivedLens} />
      </MemoryRouter>
    );

    const reactivateButton = screen.getByText('Reactivate Lens');
    await fireEvent.click(reactivateButton);

    expect(mockDisclosure.onOpen).toHaveBeenCalled();
  });
});
