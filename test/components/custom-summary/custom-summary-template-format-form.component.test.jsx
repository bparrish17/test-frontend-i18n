import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryTemplateFormatForm from '@components/custom-summary/custom-summary-template-format-form.component';
import { useUserStore } from '@store/app.store';

// Mock all required dependencies
vi.mock('@store/app.store');
vi.mock('@services/query-services/initiatives.query-service', () => ({
  useGenerateImprovedFormattingInstructions: () => ({
    mutateAsync: vi.fn()
  }),
  getFormattingInstructionsSuggestion: vi.fn()
}));

// Mock any Chakra UI components that might cause issues
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: vi.fn()
  };
});

describe('SummaryTemplateFormatForm', () => {
  // Setup common test props
  const defaultProps = {
    form: {
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { isSubmitting: false },
      watch: vi.fn(),
      setValue: vi.fn()
    },
    undoRedo: {
      state: '',
      setState: vi.fn(),
      canRedo: false,
      canUndo: false,
      redo: vi.fn(),
      undo: vi.fn(),
      nextState: '',
      prevState: ''
    },
    createNewSummary: vi.fn(),
    isGenerating: false,
    isGenerated: false,
    setStep: vi.fn(),
    regenerateWithNewInstructions: vi.fn()
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    useUserStore.mockImplementation(() => 'test-tenant');
    defaultProps.form.register.mockImplementation((name) => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn()
    }));
    defaultProps.form.watch.mockImplementation((field) => {
      if (field === 'formattingInstructions') return '';
      if (field === 'initiativeTitle') return '';
      return '';
    });
  });

  it('renders textarea component', () => {
    render(<SummaryTemplateFormatForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Template contents...')).toBeDefined();
  });

  it('allows typing in textarea', async () => {
    const user = userEvent.setup();
    render(<SummaryTemplateFormatForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Template contents...');
    await user.type(textarea, 'Test content');

    expect(textarea.value).toBe('Test content');
  });

  it('handles multiple keystrokes correctly', async () => {
    const user = userEvent.setup();
    render(<SummaryTemplateFormatForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Template contents...');
    await user.type(textarea, 'Multiple keystrokes test 123');

    expect(textarea.value).toBe('Multiple keystrokes test 123');
  });

  it('maintains textarea functionality when rewrite is not in progress', () => {
    render(<SummaryTemplateFormatForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Template contents...');
    expect(textarea.disabled).toBe(false);
  });

  it('handles newlines correctly', async () => {
    const user = userEvent.setup();
    render(<SummaryTemplateFormatForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Template contents...');
    await user.type(textarea, 'Line 1{enter}Line 2');

    expect(textarea.value).toBe('Line 1\nLine 2');
  });
});
