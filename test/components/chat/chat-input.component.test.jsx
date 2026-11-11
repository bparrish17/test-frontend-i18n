import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatInputSection from '@components/chat/chat-input.component';
import { useChatStore } from '@store/chat/chat.store';
import { useStyledToast } from '@util/hooks';

// Mock Chakra UI components to ensure proper rendering
vi.mock('@chakra-ui/react', () => ({
  Spinner: () => <div data-testid='spinner'>Loading...</div>,
  InputGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  InputRightElement: ({ children, ...props }) => <div {...props}>{children}</div>,
  Textarea: ({ ...props }) => <textarea {...props} />,
  Text: ({ children, ...props }) => <span {...props}>{children}</span>,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, onClick, ...props }) => (
    <button
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}));

// Mock necessary hooks
vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

describe('ChatInputSection', () => {
  const mockHandleSubmit = vi.fn();
  const mockSetInputValue = vi.fn();
  const mockClearChat = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the chat store using selector pattern
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: [] },
        clearChat: mockClearChat
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    useStyledToast.mockReturnValue(mockToast);
  });

  it('should render input field correctly', () => {
    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue=''
        setInputValue={mockSetInputValue}
        isThinking={false}
        inputRef={null}
      />
    );

    expect(screen.getByPlaceholderText('Message FORA')).toBeInTheDocument();
  });

  it('should call handleSubmit when enter is pressed without shift key', () => {
    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue='Test message'
        setInputValue={mockSetInputValue}
        isThinking={false}
        inputRef={null}
      />
    );

    const input = screen.getByPlaceholderText('Message FORA');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should not call handleSubmit when enter is pressed with shift key', () => {
    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue='Test message'
        setInputValue={mockSetInputValue}
        isThinking={false}
        inputRef={null}
      />
    );

    const input = screen.getByPlaceholderText('Message FORA');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('should call clearChat when the Clear Chat button is clicked', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: Array(8).fill({}) },
        clearChat: mockClearChat
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue=''
        setInputValue={mockSetInputValue}
        isThinking={false}
        inputRef={null}
      />
    );

    const clearChatButton = screen.getByText('Clear Chat');
    fireEvent.click(clearChatButton);

    expect(mockClearChat).toHaveBeenCalledWith(mockToast);
  });

  it('should show spinner when isThinking is true', () => {
    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue=''
        setInputValue={mockSetInputValue}
        isThinking={true}
        inputRef={null}
      />
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show ClearChatPopup when there are 8 or more messages', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: Array(8).fill({}) },
        clearChat: mockClearChat
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue=''
        setInputValue={mockSetInputValue}
        isThinking={false}
        inputRef={null}
      />
    );

    expect(screen.getByText('Slow? Clear the chat to improve performance:')).toBeInTheDocument();
  });

  it('should not show ClearChatPopup when there are fewer than 8 messages', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        conversation: { messages: Array(7).fill({}) },
        clearChat: mockClearChat
      };
      return typeof selector === 'function' ? selector(state) : state;
    });

    render(
      <ChatInputSection
        handleSubmit={mockHandleSubmit}
        inputValue=''
        setInputValue={mockSetInputValue}
        isThinking={false}
        inputRef={null}
      />
    );

    expect(
      screen.queryByText('Slow? Clear the chat to improve performance:')
    ).not.toBeInTheDocument();
  });
});
