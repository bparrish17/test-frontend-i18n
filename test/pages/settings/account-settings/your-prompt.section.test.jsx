import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { useUserStore } from '@store/app.store';
import { usePatchPerson } from '@services/query-services/people.query-service';
import { useMutationToast } from '@util/hooks';
import YourPromptSection from '@pages/settings/account-settings/your-prompt.section';

// Mock dependencies
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@services/query-services/people.query-service', () => ({
  usePatchPerson: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useMutationToast: vi.fn()
}));

describe('YourPromptSection', () => {
  const mockUser = { id: '123', context: 'Initial context' };
  const mockSetUser = vi.fn();
  const mockUpdatePrompt = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <YourPromptSection />
      </MemoryRouter>
    );

  beforeEach(() => {
    useUserStore.mockImplementation((selector) => {
      const state = {
        user: {
          ...mockUser,
          time_zone_id: 'PST8PDT',
          digest_configs: { morning: 640 }
        }
      };
      return selector(state);
    });

    usePatchPerson.mockReturnValue({
      mutateAsync: mockUpdatePrompt,
      isLoading: false
    });

    useMutationToast.mockReturnValue({
      onSuccess: mockOnSuccess,
      onError: mockOnError
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    renderComponent();
    expect(screen.getByText('Save Prompt')).toBeInTheDocument();
    expect(screen.getByText('On Writing Prompts')).toBeInTheDocument();
  });

  it('disables the save button when the context matches the user context', () => {
    renderComponent();
    const saveButton = screen.getByText('Save Prompt');
    expect(saveButton).toBeDisabled();
  });

  it('enables the save button when the context changes', () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText('Enter your user prompt...');
    const saveButton = screen.getByText('Save Prompt');

    fireEvent.change(textarea, { target: { value: 'New context' } });
    expect(saveButton).not.toBeDisabled();
  });

  it('calls onSubmit when the form is submitted', async () => {
    mockUpdatePrompt.mockResolvedValueOnce({});
    renderComponent();

    const textarea = screen.getByPlaceholderText('Enter your user prompt...');
    const saveButton = screen.getByText('Save Prompt');

    fireEvent.change(textarea, { target: { value: 'New context' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdatePrompt).toHaveBeenCalledWith(
        { id: mockUser.id, context: 'New context' },
        { onSuccess: mockOnSuccess, onError: mockOnError }
      );
    });
  });
});
