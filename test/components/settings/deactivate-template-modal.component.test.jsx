import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';

import DeactivateTemplateModal from '@components/settings/deactivate-template-modal.component';

// Mock the disclosure object
const mockDisclosure = {
  isOpen: true,
  onClose: vi.fn()
};

// Mock the onConfirm function
const mockOnConfirm = vi.fn();

describe('DeactivateTemplateModal', () => {
  it('renders correctly with title and buttons', () => {
    render(
      <ChakraProvider>
        <DeactivateTemplateModal
          disclosure={mockDisclosure}
          onConfirm={mockOnConfirm}
        />
      </ChakraProvider>
    );

    expect(screen.getByText('Delete Template Permanently?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete Permanently')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <ChakraProvider>
        <DeactivateTemplateModal
          disclosure={mockDisclosure}
          onConfirm={mockOnConfirm}
        />
      </ChakraProvider>
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('calls onConfirm when Delete Permanently button is clicked', () => {
    render(
      <ChakraProvider>
        <DeactivateTemplateModal
          disclosure={mockDisclosure}
          onConfirm={mockOnConfirm}
        />
      </ChakraProvider>
    );

    const deleteButton = screen.getByText('Delete Permanently');
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
