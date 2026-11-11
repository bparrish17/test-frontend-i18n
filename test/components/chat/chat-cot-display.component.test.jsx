import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActiveChainOfThoughtDisplay from '@components/chat/chat-cot-display.component';
import { useChatStore } from '@store/chat/chat.store';

// Mock the chat store
vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

// Mock constants
vi.mock('@util/constants', () => ({
  THINKING_STEP_DISPLAY_MAP: {
    step1: 'First Step',
    step2: 'Second Step',
    step3: 'Third Step'
  }
}));

describe('ActiveChainOfThoughtDisplay', () => {
  const mockChainOfThought = [
    { name: 'step1', content: 'Step 1 content' },
    { name: 'step2', content: 'Step 2 content' },
    { name: 'step3', content: 'Step 3 content' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when activeChainOfThought is empty', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        activeChainOfThought: []
      };
      return selector(state);
    });

    const { container } = render(<ActiveChainOfThoughtDisplay />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all steps from the chain of thought', () => {
    useChatStore.mockImplementation((selector) => {
      const state = {
        activeChainOfThought: mockChainOfThought
      };
      return selector(state);
    });

    render(<ActiveChainOfThoughtDisplay />);

    expect(screen.getByText('First Step')).toBeInTheDocument();
    expect(screen.getByText('Step 1 content')).toBeInTheDocument();
    expect(screen.getByText('Second Step')).toBeInTheDocument();
    expect(screen.getByText('Step 2 content')).toBeInTheDocument();
    expect(screen.getByText('Third Step')).toBeInTheDocument();
    expect(screen.getByText('Step 3 content')).toBeInTheDocument();
  });
});
