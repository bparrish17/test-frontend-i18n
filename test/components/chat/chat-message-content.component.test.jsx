import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageContent from '@components/chat/chat-message-content.component';

describe('MessageContent', () => {
  it('renders markdown content', () => {
    const testContent = 'Test markdown content';
    render(<MessageContent content={testContent} />);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('trims whitespace from content', () => {
    const testContent = '  Content with whitespace  ';
    render(<MessageContent content={testContent} />);
    expect(screen.getByText('Content with whitespace')).toBeInTheDocument();
  });

  it('handles empty content', () => {
    const { container } = render(<MessageContent content='' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles null content', () => {
    const { container } = render(<MessageContent content={null} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
