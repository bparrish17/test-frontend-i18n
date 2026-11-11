import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import LabelForm from '@components/settings/manage-labels/label-form.component';

// Mock the dependencies
vi.mock('@services/query-services/initiatives.query-service', () => ({
  useCreateInitiative: vi.fn(),
  usePatchInitiative: vi.fn()
}));

vi.mock('@services/query-services/lambda.query-service', () => ({
  useGenerateLabelPrompts: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useMutationToast: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@components/settings/manage-labels/meeting-type-radio-group.component', () => ({
  default: ({ value, onChange }) => (
    <div data-testid='meeting-type-radio'>
      <input
        type='radio'
        value='internal'
        checked={value === 'internal'}
        onChange={() => onChange('internal')}
        data-testid='internal-radio'
      />
      <input
        type='radio'
        value='external'
        checked={value === 'external'}
        onChange={() => onChange('external')}
        data-testid='external-radio'
      />
    </div>
  ),
  MEETING_TYPE_OPTIONS: [{ value: 'internal' }, { value: 'external' }, { value: 'either' }]
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

const Wrapper = ({ children }) => (
  <QueryClientProvider client={createQueryClient()}>
    <ChakraProvider>{children}</ChakraProvider>
  </QueryClientProvider>
);

describe('LabelForm onSubmit', () => {
  const mockCreateLabel = vi.fn();
  const mockPatchLabel = vi.fn();
  const mockGenerateLabelPrompts = vi.fn();
  const mockOnCreateLabel = vi.fn();
  const mockOnClose = vi.fn();
  const mockRefetch = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  const mockOnTitleAlreadyInUseError = vi.fn();

  const defaultProps = {
    disclosure: { onClose: mockOnClose },
    isEditing: false,
    refetch: mockRefetch,
    selectedLabel: null,
    onCreateLabel: mockOnCreateLabel
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock store
    const { useUserStore } = await import('@store/app.store');
    useUserStore.mockReturnValue({
      id: 'tenant-123'
    });

    // Mock mutation hooks
    const { useCreateInitiative, usePatchInitiative } = await import(
      '@services/query-services/initiatives.query-service'
    );
    useCreateInitiative.mockReturnValue({
      mutateAsync: mockCreateLabel
    });
    usePatchInitiative.mockReturnValue({
      mutateAsync: mockPatchLabel
    });

    const { useGenerateLabelPrompts } = await import(
      '@services/query-services/lambda.query-service'
    );
    useGenerateLabelPrompts.mockReturnValue({
      mutateAsync: mockGenerateLabelPrompts
    });

    // Mock toast hooks
    const { useMutationToast } = await import('@util/hooks');
    useMutationToast.mockImplementation((config) => {
      if (config?.error?.title === 'Title is already in use.') {
        return { onError: mockOnTitleAlreadyInUseError };
      }
      return {
        onSuccess: mockOnSuccess,
        onError: mockOnError
      };
    });

    // Mock generateLabelPrompts response
    mockGenerateLabelPrompts.mockResolvedValue({
      formatting_instructions: 'Test formatting instructions',
      lens_config: { test: 'config' }
    });

    // Mock createLabel response
    mockCreateLabel.mockResolvedValue({
      id: 'new-label-123',
      title: 'Test Label',
      description: 'Test Description'
    });
  });

  it('should successfully create a new label when form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <LabelForm {...defaultProps} />
      </Wrapper>
    );

    // Fill out the form
    await user.type(screen.getByTestId('title-input'), 'Test Label');
    await user.type(screen.getByTestId('description-textarea'), 'Test Description');
    await user.click(screen.getByTestId('internal-radio'));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /create/i }));

    // Wait for async operations
    await waitFor(() => {
      expect(mockGenerateLabelPrompts).toHaveBeenCalledWith({
        title: 'Test Label',
        description: 'Test Description',
        tenantId: 'tenant-123'
      });
    });

    await waitFor(() => {
      expect(mockCreateLabel).toHaveBeenCalledWith(
        {
          title: 'Test Label',
          description: 'Test Description',
          type: 'Label',
          formatting_instructions: 'Test formatting instructions',
          lens_config: { test: 'config' },
          visibility: 'Tenant',
          tags: ['not-compliance', 'internal']
        },
        expect.objectContaining({
          onSuccess: mockOnSuccess,
          onError: expect.any(Function)
        })
      );
    });

    await waitFor(() => {
      expect(mockOnCreateLabel).toHaveBeenCalledWith({
        id: 'new-label-123',
        title: 'Test Label',
        description: 'Test Description',
        match: 'Manual'
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should patch existing label when editing', async () => {
    const user = userEvent.setup();
    const selectedLabel = {
      id: 'existing-label-123',
      title: 'Existing Label',
      description: 'Existing Description',
      tags: ['not-compliance', 'external']
    };

    render(
      <Wrapper>
        <LabelForm
          {...defaultProps}
          isEditing={true}
          selectedLabel={selectedLabel}
        />
      </Wrapper>
    );

    // Update the form
    const titleInput = screen.getByTestId('title-input');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Label');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockPatchLabel).toHaveBeenCalledWith(
        {
          id: 'existing-label-123',
          title: 'Updated Label',
          description: 'Existing Description',
          type: 'Label',
          formatting_instructions: 'Test formatting instructions',
          lens_config: { test: 'config' },
          visibility: 'Tenant',
          tags: ['not-compliance', 'external']
        },
        expect.objectContaining({
          onSuccess: mockOnSuccess,
          onError: expect.any(Function)
        })
      );
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should handle title already in use error', async () => {
    const user = userEvent.setup();

    // Mock error response
    const error = {
      response: {
        data: {
          errors: ['The title is already in use by another Initiative.']
        }
      }
    };

    mockCreateLabel.mockImplementation(async (data, options) => {
      // Call the error handler
      options.onError(error);
      // Return a resolved promise to avoid unhandled rejection
      return Promise.resolve();
    });

    render(
      <Wrapper>
        <LabelForm {...defaultProps} />
      </Wrapper>
    );

    await user.type(screen.getByTestId('title-input'), 'Duplicate Label');
    await user.type(screen.getByTestId('description-textarea'), 'Test Description');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockOnTitleAlreadyInUseError).toHaveBeenCalledWith(error);
    });
  });

  it('should handle general errors', async () => {
    const user = userEvent.setup();

    const error = {
      response: {
        data: {
          errors: ['Some other error']
        }
      }
    };

    mockCreateLabel.mockImplementation(async (data, options) => {
      // Call the error handler
      options.onError(error);
      // Return a resolved promise to avoid unhandled rejection
      return Promise.resolve();
    });

    render(
      <Wrapper>
        <LabelForm {...defaultProps} />
      </Wrapper>
    );

    await user.type(screen.getByTestId('title-input'), 'Test Label');
    await user.type(screen.getByTestId('description-textarea'), 'Test Description');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });
});
