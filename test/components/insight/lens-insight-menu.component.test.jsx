import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import LensInsightMenu from '@components/insight/lens-insight-menu.component';
import { useUserStore } from '@store/app.store';
import { useLensActivation } from '@services/query-services/lens-activation.query-service';
import { useCopyToClipboard } from '@util/hooks';

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@services/query-services/lens-activation.query-service', () => ({
  useLensActivation: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCopyToClipboard: vi.fn()
}));

describe('LensInsightMenu', () => {
  const mockCopyToClipboard = vi.fn();
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
    useCopyToClipboard.mockReturnValue(mockCopyToClipboard);
    useLensActivation.mockReturnValue({
      disclosure: mockDisclosure,
      deactivateLens: mockDeactivateLens,
      reactivateLens: mockReactivateLens
    });
  });

  const insight = {
    id: 1
  };

  const lens = {
    id: 1,
    creator: { id: 1 }
  };

  test('renders menu options based on user role', () => {
    render(
      <MemoryRouter>
        <LensInsightMenu
          insight={insight}
          lens={lens}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button')); // Open menu

    // expect(screen.getByText('Copy Link')).toBeInTheDocument();
    expect(screen.getByText('Edit Lens Settings')).toBeInTheDocument();
    expect(screen.getByText('Deactivate Lens')).toBeInTheDocument();
  });

  test('shows View Lens Details for non-creators', () => {
    const nonCreatorLens = {
      ...lens,
      creator: { id: 2 }
    };

    render(
      <MemoryRouter>
        <LensInsightMenu
          insight={insight}
          lens={nonCreatorLens}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button')); // Open menu

    expect(screen.getByText('View Lens Details')).toBeInTheDocument();
    expect(screen.queryByText('Edit Lens Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Deactivate Lens')).not.toBeInTheDocument();
  });

  test('shows Deactivate option for active lens when user is creator', () => {
    render(
      <MemoryRouter>
        <LensInsightMenu
          insight={insight}
          lens={lens}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button')); // Open menu

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
        <LensInsightMenu
          insight={insight}
          lens={archivedLens}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button')); // Open menu

    expect(screen.getByText('Reactivate Lens')).toBeInTheDocument();
    expect(screen.queryByText('Deactivate Lens')).not.toBeInTheDocument();
  });

  test('opens deactivate modal when Deactivate Lens is clicked', () => {
    render(
      <MemoryRouter>
        <LensInsightMenu
          insight={insight}
          lens={lens}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button')); // Open menu
    fireEvent.click(screen.getByText('Deactivate Lens'));

    expect(mockDisclosure.onOpen).toHaveBeenCalled();
  });

  test('opens reactivate modal when Reactivate Lens is clicked', () => {
    const archivedLens = {
      ...lens,
      archived_at: new Date().toISOString()
    };

    render(
      <MemoryRouter>
        <LensInsightMenu
          insight={insight}
          lens={archivedLens}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button')); // Open menu
    fireEvent.click(screen.getByText('Reactivate Lens'));

    expect(mockDisclosure.onOpen).toHaveBeenCalled();
  });

  // test('copies link when Copy Link is clicked', () => {
  //   render(
  //     <MemoryRouter>
  //       <LensInsightMenu
  //         insight={insight}
  //         lens={lens}
  //       />
  //     </MemoryRouter>
  //   );
  //
  //   fireEvent.click(screen.getByRole('button')); // Open menu
  //   fireEvent.click(screen.getByText('Copy Link'));
  //
  //   expect(mockCopyToClipboard).toHaveBeenCalledWith(
  //     `${window.location.origin}/insights/${insight.id}`,
  //     'Insight Link'
  //   );
  // });
});
