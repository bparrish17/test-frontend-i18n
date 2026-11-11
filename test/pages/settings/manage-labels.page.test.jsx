import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';

import {
  useInitiatives,
  useArchiveInitiative,
  useCreateInitiative,
  usePatchInitiative
} from '@services/query-services/initiatives.query-service';
import ManageLabelsPage from '@pages/settings/manage-labels.page';

vi.mock('@services/query-services/initiatives.query-service', () => ({
  useInitiatives: vi.fn(),
  useArchiveInitiative: vi.fn(),
  useCreateInitiative: vi.fn(),
  usePatchInitiative: vi.fn()
}));

const mockLabels = [
  { id: '1', title: 'Label 1', created_at: 1732225535952 },
  { id: '2', title: 'Label 2', created_at: 1739325535952 }
];

const mockArchiveLabel = vi.fn();
const mockCreateLabel = vi.fn();
const mockPatchLabel = vi.fn();

const renderComponent = () =>
  render(
    <MemoryRouter>
      <ChakraProvider>
        <ManageLabelsPage />
      </ChakraProvider>
    </MemoryRouter>
  );

describe('ManageLabelsPage', () => {
  beforeEach(() => {
    useArchiveInitiative.mockReturnValue({ mutateAsync: mockArchiveLabel });
    useCreateInitiative.mockReturnValue({ mutateAsync: mockCreateLabel });
    usePatchInitiative.mockReturnValue({ mutateAsync: mockPatchLabel });
  });

  it('renders correctly with labels', () => {
    useInitiatives.mockReturnValue({
      data: { data: mockLabels, total: mockLabels.length }
    });

    renderComponent();

    expect(useInitiatives).toHaveBeenCalledWith(
      {
        type: 'Label',
        asc: true,
        has_archived_at: false,
        page: 1,
        pageSize: 10,
        sort: 'title.keyword'
      },
      {
        includeTotal: true,
        keepPreviousData: true
      }
    );

    expect(screen.getByText('Manage Labels')).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2')).toBeInTheDocument();
    expect(screen.getByText('11/21/2024, 9:45 PM')).toBeInTheDocument();
    expect(screen.getByText('02/12/2025, 1:58 AM')).toBeInTheDocument();
  });

  it('opens the confirmation modal when delete button is clicked', () => {
    useInitiatives.mockReturnValue({
      data: { data: mockLabels, total: mockLabels.length }
    });

    renderComponent();

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Delete Label Permanently?')).toBeInTheDocument();
  });

  it('calls archiveTemplate when confirm delete is clicked', async () => {
    useInitiatives.mockReturnValue({
      data: { data: mockLabels, total: mockLabels.length }
    });

    renderComponent();

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Delete Permanently'));

    await waitFor(() =>
      expect(mockArchiveLabel).toHaveBeenCalledWith({ id: '1', value: true }, expect.any(Object))
    );
  });
});
