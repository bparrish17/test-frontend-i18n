import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  DeactivateLensModal,
  ReactivateLensModal
} from '@components/lens/lens-activation-modals.component';

describe('DeactivateLensModal', () => {
  const mockOnConfirm = vi.fn();
  const mockDisclosure = {
    isOpen: true,
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders deactivate modal with correct content', () => {
    render(
      <DeactivateLensModal
        disclosure={mockDisclosure}
        onConfirm={mockOnConfirm}
      />
    );

    // Use getAllByText since the text appears multiple times
    expect(screen.getAllByText('Deactivate this Lens?')).toHaveLength(2);
    expect(
      screen.getByText(/Disabling this lens will stop FORA from updating you/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    render(
      <DeactivateLensModal
        disclosure={mockDisclosure}
        onConfirm={mockOnConfirm}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    await fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
      expect(mockDisclosure.onClose).toHaveBeenCalled();
    });
  });
});

describe('ReactivateLensModal', () => {
  const mockOnConfirm = vi.fn();
  const mockDisclosure = {
    isOpen: true,
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders reactivate modal with correct content', () => {
    render(
      <ReactivateLensModal
        disclosure={mockDisclosure}
        onConfirm={mockOnConfirm}
      />
    );

    // Use getAllByText since the text appears multiple times
    expect(screen.getAllByText('Reactivate this Lens?')).toHaveLength(2);
    expect(
      screen.getByText(/Reactivating this Lens ensures that you and all followers/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    render(
      <ReactivateLensModal
        disclosure={mockDisclosure}
        onConfirm={mockOnConfirm}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    await fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
      expect(mockDisclosure.onClose).toHaveBeenCalled();
    });
  });
});
