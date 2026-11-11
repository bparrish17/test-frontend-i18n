import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import FocusesPage from '@pages/focuses/focuses.page';
import { useIsUserType, useMutationToast } from '@util/hooks';
import { useInitiatives, useArchiveInitiative } from '@services/query-services/initiatives.query-service';

// Router mocks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null })
}));

// Hooks/service mocks used by the page
vi.mock('@util/hooks', () => ({
  useIsUserType: vi.fn(),
  useMutationToast: vi.fn(),
  useSetDocumentTitle: vi.fn()
}));

vi.mock('@services/query-services/initiatives.query-service', () => ({
  useInitiatives: vi.fn(),
  useArchiveInitiative: vi.fn()
}));

// Component mocks to keep the test focused and deterministic
vi.mock('@components/general/dropdown.component', () => ({
  default: ({ menuItems }) => (
    <div data-testid='mock-dropdown'>
      {menuItems.map((item) => (
        <button key={item.name} onClick={item.onClick}>
          {item.name}
        </button>
      ))}
    </div>
  )
}));

vi.mock('@components/general/styled-link.component', () => ({
  default: ({ children }) => <span>{children}</span>
}));

vi.mock('@components/create-focus/create-focus-success-modal.component', () => ({
  default: () => null
}));

vi.mock('@components/general/search.component', () => ({
  default: () => <div data-testid='mock-search' />
}));

vi.mock('@layouts/centered.layout', () => ({
  default: ({ children }) => <div data-testid='mock-centered-layout'>{children}</div>
}));

vi.mock('@components/general/action-popover.component', () => ({
  default: ({ children }) => <div data-testid='mock-action-popover'>{children}</div>
}));

vi.mock('@components/focus/focus-metadata.component', () => ({
  default: () => <div data-testid='mock-focus-metadata' />
}));

vi.mock('@assets/icons');

describe('FocusesPage', () => {
  const focus = { id: 'f1', title: 'Category One', description: 'Desc' };
  describe('executive user', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      useIsUserType.mockReturnValue(true);
      useMutationToast.mockReturnValue({ onSuccess: vi.fn(), onError: vi.fn() });
      useArchiveInitiative.mockReturnValue({ mutate: vi.fn() });
      useInitiatives
        .mockReset()
        .mockReturnValueOnce({ data: [focus], isLoading: false })
        .mockReturnValue({ data: [], isLoading: false });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('shows Edit Category in the action menu and navigates to settings when clicked', () => {
      render(<FocusesPage />);
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Category One')).toBeInTheDocument();
      const editButton = screen.getByText('Edit Category');
      expect(editButton).toBeInTheDocument();
      fireEvent.click(editButton);
      expect(mockNavigate).toHaveBeenCalledWith('/focuses/f1/settings');
    });

    it('shows Archive Category in the action menu and calls archiveFocus with correct args when clicked', () => {
      const archiveFocusMock = vi.fn();
      useArchiveInitiative.mockReturnValue({ mutate: archiveFocusMock });

      render(<FocusesPage />);
      const archiveButton = screen.getByText('Archive Category');
      expect(archiveButton).toBeInTheDocument();
      fireEvent.click(archiveButton);
      expect(archiveFocusMock).toHaveBeenCalledWith(
        { id: focus.id, value: true },
        expect.any(Object)
      );
    });
  });

  describe('non-executive user', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      useIsUserType.mockReturnValue(false);
      useMutationToast.mockReturnValue({ onSuccess: vi.fn(), onError: vi.fn() });
      useArchiveInitiative.mockReturnValue({ mutate: vi.fn() });
      useInitiatives
        .mockReset()
        .mockReturnValueOnce({ data: [focus], isLoading: false })
        .mockReturnValue({ data: [], isLoading: false });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('does not show Archive Category in the action menu', () => {
      render(<FocusesPage />);
      expect(screen.queryByText('Archive Category')).not.toBeInTheDocument();
    });
  });
});