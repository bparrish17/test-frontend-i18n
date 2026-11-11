import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import {
  useInitiatives,
  useArchiveInitiative
} from '@services/query-services/initiatives.query-service';

import ManageTemplatesPage from '@pages/settings/manage-templates.page';

// Mock the useInitiatives hook
vi.mock('@services/query-services/initiatives.query-service', () => ({
  useInitiatives: vi.fn(),
  useArchiveInitiative: vi.fn()
}));

const mockTemplates = [
  { id: '1', title: 'Template 1', created_at: 1732225535952 },
  { id: '2', title: 'Template 2', created_at: 1739325535952 }
];

const mockArchiveTemplate = vi.fn();

describe('ManageTemplatesPage', () => {
  beforeEach(() => {
    useArchiveInitiative.mockReturnValue({ mutate: mockArchiveTemplate });
  });

  it('renders correctly with templates', () => {
    useInitiatives.mockReturnValue({ data: mockTemplates, refetch: vi.fn() });

    render(
      <MemoryRouter>
        <ChakraProvider>
          <ManageTemplatesPage />
        </ChakraProvider>
      </MemoryRouter>
    );

    expect(useInitiatives).toHaveBeenCalledWith({
      type: 'Lens',
      tags: ['template'],
      asc: false
    });

    expect(screen.getByText('Manage Templates')).toBeInTheDocument();
    expect(screen.getByText('2 Items')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Date Created')).toBeInTheDocument();
    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Nov 21, 2024')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
    expect(screen.getByText('Feb 12, 2025')).toBeInTheDocument();
  });

  it('opens the modal when delete button is clicked', () => {
    useInitiatives.mockReturnValue({ data: mockTemplates, refetch: vi.fn() });
    render(
      <MemoryRouter>
        <ChakraProvider>
          <ManageTemplatesPage />
        </ChakraProvider>
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Delete Template Permanently?')).toBeInTheDocument();
  });

  it('calls archiveTemplate when confirm delete is clicked', async () => {
    useInitiatives.mockReturnValue({ data: mockTemplates, refetch: vi.fn() });

    render(
      <MemoryRouter>
        <ChakraProvider>
          <ManageTemplatesPage />
        </ChakraProvider>
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]); // Click delete button
    fireEvent.click(screen.getByText('Delete Permanently'));

    await waitFor(() =>
      expect(mockArchiveTemplate).toHaveBeenCalledWith({ id: '1', value: true }, expect.any(Object))
    );
  });
});
