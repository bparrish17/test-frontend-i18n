import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArtifactContent from '@components/chat/chat-artifact-content.component';
import { useChatStore } from '@store/chat/chat.store';
import { useUserStore } from '@store/app.store';
import { useBreakpoints, useCopyToClipboard, useStyledToast } from '@util/hooks';
import { useQueryClient } from '@tanstack/react-query';

// Mock the hooks
vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn(),
  useCopyToClipboard: vi.fn(),
  useStyledToast: vi.fn()
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn()
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), vi.fn()]
  };
});

// Mock the MessageContent component
vi.mock('@components/chat/chat-message-content.component', () => ({
  MessageContent: ({ content }) => <div data-testid='message-content'>{content}</div>
}));

// Mock StyledTabBox component
vi.mock('@components/general/styled-tab-box.component', () => ({
  default: ({ children, onClick }) => (
    <button
      data-testid='styled-tab-box'
      onClick={onClick}
      type='button'
    >
      {children}
    </button>
  )
}));

// Mock the icons
vi.mock('@assets/icons', () => ({
  ChevronLeftIcon: () => 'ChevronLeftIcon',
  ChevronRightIcon: () => 'ChevronRightIcon',
  CopyIcon: () => 'CopyIcon',
  SFSquareAndPencil: () => 'PencilIcon'
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, ...props }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          ![
            'overflowY',
            'maxHeight',
            'bgColor',
            'borderRadius',
            'alignItems',
            'flexDirection'
          ].includes(key)
      )
    );
    return <div {...filteredProps}>{children}</div>;
  },
  Flex: ({ children, flexDirection, borderRadius, alignItems, ...props }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) => !['flexDirection', 'borderRadius', 'alignItems'].includes(key)
      )
    );
    return <div {...filteredProps}>{children}</div>;
  },
  Text: ({ children, ...props }) => <span {...props}>{children}</span>,
  HStack: ({ children, ...props }) => <div {...props}>{children}</div>,
  IconButton: ({ 'aria-label': ariaLabel, onClick, icon, bgColor, ...props }) => {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => key !== 'bgColor')
    );
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        {...filteredProps}
      >
        {icon}
      </button>
    );
  },
  Button: ({ children, onClick, ...props }) => (
    <button
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  Spinner: () => <div data-testid='spinner'>Loading...</div>,
  Input: ({ value, onChange, ...props }) => (
    <input
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}));

describe('ArtifactContent', () => {
  const mockCopyToClipboard = vi.fn();
  const mockToast = vi.fn();
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };
  const mockUser = { id: 'test-user' };

  beforeEach(() => {
    vi.clearAllMocks();
    useBreakpoints.mockReturnValue({ isMobile: false });
    useCopyToClipboard.mockReturnValue(mockCopyToClipboard);
    useStyledToast.mockReturnValue(mockToast);
    useQueryClient.mockReturnValue(mockQueryClient);
    useUserStore.mockImplementation((selector) => {
      const state = { user: mockUser };
      return selector(state);
    });
  });

  it('renders artifact content correctly', () => {
    const mockArtifact = { content: 'Test artifact content' };
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          artifacts: [mockArtifact]
        },
        activeArtifactIndex: 0
      };
      return selector(state);
    });

    render(
      <BrowserRouter>
        <ArtifactContent />
      </BrowserRouter>
    );
    expect(screen.getByTestId('message-content')).toHaveTextContent('Test artifact content');
  });

  describe('Template Title Editing', () => {
    const mockTemplateTitle = 'Test Template';
    const mockSetTitle = vi.fn();
    const mockSetIsTitleFormDirty = vi.fn();

    beforeEach(() => {
      useChatStore.mockImplementation((selector) => {
        const state = {
          title: mockTemplateTitle,
          setTitle: mockSetTitle,
          setIsTitleFormDirty: mockSetIsTitleFormDirty,
          conversation: { artifacts: [] }
        };
        return selector(state);
      });
    });

    it('displays template title in read mode', () => {
      render(<ArtifactContent />);
      expect(screen.getByTestId('styled-tab-box')).toHaveTextContent(mockTemplateTitle);
    });

    it('switches to edit mode on click', () => {
      render(<ArtifactContent />);
      fireEvent.click(screen.getByTestId('styled-tab-box'));
      expect(screen.getByRole('textbox')).toHaveValue(mockTemplateTitle);
    });

    it('handles title updates', () => {
      render(<ArtifactContent />);
      fireEvent.click(screen.getByTestId('styled-tab-box'));

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'New Title' } });
      fireEvent.click(screen.getByText('Save'));

      expect(mockSetTitle).toHaveBeenCalledWith('New Title');
      expect(mockSetIsTitleFormDirty).toHaveBeenCalledWith(true);
    });

    it('handles cancel edit', () => {
      render(<ArtifactContent />);
      fireEvent.click(screen.getByTestId('styled-tab-box'));

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'New Title' } });
      fireEvent.click(screen.getByText('Cancel'));

      expect(mockSetTitle).not.toHaveBeenCalled();
    });
  });

  describe('Artifact Navigation', () => {
    const mockSetActiveArtifactIndex = vi.fn();

    beforeEach(() => {
      useChatStore.mockImplementation((selector) => {
        const state = {
          conversation: {
            artifacts: [
              { content: 'Version 1' },
              { content: 'Version 2' },
              { content: 'Version 3' }
            ]
          },
          activeArtifactIndex: 1,
          setActiveArtifactIndex: mockSetActiveArtifactIndex
        };
        return selector(state);
      });
    });

    it('shows correct version information', () => {
      render(<ArtifactContent />);
      expect(screen.getByText('Version 2 of 3')).toBeInTheDocument();
    });

    it('handles previous version navigation', () => {
      render(<ArtifactContent />);
      fireEvent.click(screen.getByLabelText('Previous Artifact Version'));
      expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(0);
    });

    it('handles next version navigation', () => {
      render(<ArtifactContent />);
      fireEvent.click(screen.getByLabelText('Next Artifact Version'));
      expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(2);
    });
  });

  describe('Template Saving', () => {
    const mockSaveAsTemplate = vi.fn();
    const mockHideChat = vi.fn();
    const mockInvalidateQueries = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
      mockQueryClient.invalidateQueries = mockInvalidateQueries;

      useChatStore.mockImplementation((selector) => {
        const state = {
          conversation: {
            artifacts: [{ content: 'Test content' }],
            messages: [{ role: 'user' }, { role: 'assistant' }]
          },
          activeArtifactIndex: 0,
          saveAsTemplate: mockSaveAsTemplate,
          hideChat: mockHideChat
        };
        return selector(state);
      });
    });

    it('handles successful template save', async () => {
      // Setup the successful save flow
      mockSaveAsTemplate.mockImplementation(() => Promise.resolve());

      render(
        <BrowserRouter>
          <ArtifactContent />
        </BrowserRouter>
      );

      // Trigger the save
      fireEvent.click(screen.getByText('Save as Template'));

      // First, check if we see the loading spinner
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      // Wait for all the callbacks to execute
      await waitFor(() => {
        expect(mockSaveAsTemplate).toHaveBeenCalledWith(mockUser);
      });
    });

    it('handles template save error', async () => {
      const error = new Error('Save failed');
      mockSaveAsTemplate.mockRejectedValue(error);

      render(
        <BrowserRouter>
          <ArtifactContent />
        </BrowserRouter>
      );

      fireEvent.click(screen.getByText('Save as Template'));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Template Save Error',
            description: error.toString(),
            status: 'error'
          })
        );
      });

      // Verify spinner is gone after error
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

      // Verify other actions were not called
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
      expect(mockHideChat).not.toHaveBeenCalled();
    });
  });

  it('handles copy to clipboard', () => {
    const artifactContent = 'Test content';
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: {
          artifacts: [{ content: artifactContent }]
        },
        activeArtifactIndex: 0
      };
      return selector(state);
    });

    render(<ArtifactContent />);
    fireEvent.click(screen.getByLabelText('Copy'));
    expect(mockCopyToClipboard).toHaveBeenCalledWith(artifactContent);
  });
});
