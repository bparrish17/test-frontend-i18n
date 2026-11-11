import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import UploadLink from '@components/settings/manage-uploads/upload-link.component';
import { getUploadLink, getOriginalFileEntry } from '@util/helpers';
import { getPresignedUrl } from '@services/query-services/lambda.query-service';

// Mock the helpers & services
vi.mock('@util/helpers', () => ({
  getUploadLink: vi.fn(),
  getOriginalFileEntry: vi.fn()
}));

vi.mock('@services/query-services/lambda.query-service', () => ({
  getPresignedUrl: vi.fn()
}));

// Mock the icon so we don’t need real SVGs
vi.mock('@assets/icons', () => ({
  SFLinkIcon: () => <div data-testid='mock-icon'>ICON</div>
}));

// Mock react-router Link as a simple <a>
vi.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => (
    <a
      href={to}
      {...props}
      data-testid='mock-link'
    >
      {children}
    </a>
  )
}));

describe('UploadLink', () => {
  const upload = { results: ['original_file:test.pdf'] };
  const cards = [{ id: '1' }];

  beforeEach(() => {
    vi.resetAllMocks();
    global.open = vi.fn(); // mock window.open
  });

  it('renders as a Link for Meeting type', () => {
    getUploadLink.mockReturnValue('/meeting/123');

    render(
      <UploadLink
        upload={upload}
        cards={cards}
        type='Meeting'
      />
    );

    const button = screen.getByTestId('mock-link');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/meeting/123');
  });

  it('calls getPresignedUrl and opens URL for Document type', async () => {
    getUploadLink.mockReturnValue('/cards/1');
    getOriginalFileEntry.mockReturnValue('/path/to/test.pdf');
    getPresignedUrl.mockResolvedValue({ url: 'https://test.com/file.pdf' });

    render(
      <UploadLink
        upload={upload}
        cards={cards}
        type='Document'
      />
    );

    const button = screen.getByRole('button'); // IconButton renders as a button
    expect(button).toBeInTheDocument();

    act(() => fireEvent.click(button));
    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    expect(getPresignedUrl).toHaveBeenCalledWith({
      command: 'get',
      bucket: 'email-parser-processing',
      fileName: '/path/to/test.pdf'
    });

    expect(global.open).toHaveBeenCalledWith(
      'https://test.com/file.pdf',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
